import { NextRequest, NextResponse } from 'next/server';
import { calculateRate, CalculationInput, CalculationResult } from '@/lib/calculator';

// Google Sheets Web App URL
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwh0gcSObkcqfGKUQTPHoBcZduYhSZ7_2vjIpmGYbma87gQpLW3TCTvN1Uknn9jfSL2/exec';

// Запрос к Google Sheets для получения расстояния
async function getDistanceFromGoogleSheets(data: Record<string, string>): Promise<{ distance: number; success: boolean; error?: string }> {
  try {
    console.log('[GOOGLE_SHEETS] Sending request:', JSON.stringify(data));
    
    // Google Apps Script требует GET запрос с параметрами
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const url = `${GOOGLE_SHEETS_URL}?${params.toString()}`;
    console.log('[GOOGLE_SHEETS] URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
      },
      redirect: 'follow',
    });
    
    console.log('[GOOGLE_SHEETS] Response status:', response.status);
    
    const responseText = await response.text();
    console.log('[GOOGLE_SHEETS] Response text:', responseText.substring(0, 500));
    
    if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
      return { 
        distance: 0, 
        success: false, 
        error: 'Google Sheets Web App недоступен' 
      };
    }
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      return { 
        distance: 0, 
        success: false, 
        error: `Неверный формат ответа: ${responseText.substring(0, 100)}` 
      };
    }
    
    console.log('[GOOGLE_SHEETS] Parsed response:', JSON.stringify(result));
    
    if (result.success && typeof result.distance === 'number') {
      return { distance: result.distance, success: true };
    }
    
    return { 
      distance: 0, 
      success: false, 
      error: result.error || 'Не удалось получить расстояние' 
    };
  } catch (e: any) {
    console.error('[GOOGLE_SHEETS] Error:', e);
    return { distance: 0, success: false, error: e.message };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { 
      cityFrom, cityTo, containerType, cargoWeight, transportMode, dangerType,
      additionalPoints = 0, gensetRequired, onEdge,
      fromCoords, toCoords, fromName, toName,
      tspDifferentFromNt, tspCity, tspCoords, tspName,
      // Экспорт
      tzpCity, tzpCoords, tzpName,
      ntCity, ntCoords, ntName,
    } = body;

    // Валидация
    if (!cityFrom || !cityTo) {
      return NextResponse.json({ success: false, error: 'Укажите пункты отправления и назначения' }, { status: 400 });
    }
    if (!containerType || !transportMode || !dangerType) {
      return NextResponse.json({ success: false, error: 'Не все параметры указаны' }, { status: 400 });
    }
    if (typeof cargoWeight !== 'number' || cargoWeight < 0) {
      return NextResponse.json({ success: false, error: 'Некорректный вес груза' }, { status: 400 });
    }

    // ============================================
    // ОПРЕДЕЛЕНИЕ ТОЧЕК МАРШРУТА
    // ============================================
    
    const isExportDirect = transportMode === 'EXPORT_DIRECT';
    
    // Названия городов
    const fromCityName = fromName || cityFrom;
    const toCityName = toName || cityTo;
    
    // Для расчёта расстояния
    let sheetsData: Record<string, string> = {};
    
    if (isExportDirect) {
      // ЭКСПОРТ: НТ → ТЗП → ТЗ → КТ → НТ
      // Нужно рассчитать несколько расстояний
      
      const NT = ntName || ntCity || '';           // Начальная точка
      const TZP = tzpName || tzpCity || '';        // Точка забора порожнего
      const TZ = fromCityName;                      // Точка загрузки
      const KT = toCityName;                        // Конечная точка
      const TSP = tspDifferentFromNt ? (tspName || tspCity || '') : '';
      
      sheetsData = { NT, TZP, TZ, KT, TSP };
    } else {
      // ГТД, ВТТ, МТТ: ТЗ → КТ (один гружёный рейс)
      // ТЗ = cityFrom, КТ = cityTo
      // НТ совпадает с ТЗ (контейнер уже в точке загрузки)
      
      const NT = fromCityName;  // Начальная точка = точка загрузки
      const TZ = fromCityName;  // Точка загрузки
      const KT = toCityName;    // Конечная точка
      const TSP = tspDifferentFromNt ? (tspName || tspCity || '') : '';
      
      sheetsData = { NT, TZ, KT };
      if (TSP) sheetsData.TSP = TSP;
    }
    
    console.log('[ROUTE] Mode:', transportMode, 'Data:', sheetsData);

    // ============================================
    // ЗАПРОС РАССТОЯНИЯ
    // ============================================
    
    const sheetsResult = await getDistanceFromGoogleSheets(sheetsData);
    
    if (!sheetsResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: sheetsResult.error || 'Не удалось рассчитать расстояние',
        _debug: {
          sentData: sheetsData,
          sheetsResponse: sheetsResult
        }
      }, { status: 400 });
    }
    
    const distance = sheetsResult.distance;
    console.log(`[DISTANCE] ${distance} km (from Google Sheets)`);

    // ============================================
    // РАСЧЁТ СТАВКИ
    // ============================================
    
    const input: CalculationInput = {
      cityFrom,
      cityTo,
      containerType,
      cargoWeight,
      transportMode,
      dangerType,
      additionalCities: [],
      gensetRequired: gensetRequired || false,
      customsClearance: false,
      onEdge: onEdge || false,
      emptyReturnCity: tspDifferentFromNt ? tspCity : undefined,
      preCalculatedDistance: distance,
      fromName,
      toName,
      tspName: tspDifferentFromNt ? tspName : fromName,
      tspCoords: tspDifferentFromNt ? tspCoords : undefined,
      tzpCity,
      tzpCoords,
      tzpName,
      ntCity,
      ntCoords,
      ntName,
    };

    const result: CalculationResult = calculateRate(input);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({
      ...result,
      _debug: {
        version: '4.2-fixed-logic',
        transportMode,
        sentToSheets: sheetsData,
        receivedDistance: distance,
      }
    });
    
  } catch (error: any) {
    console.error('Calculation error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка сервера: ' + error.message }, { status: 500 });
  }
}

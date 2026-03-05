import { NextRequest, NextResponse } from 'next/server';

// ============================================
// API РАСЧЁТА РАССТОЯНИЙ
// ============================================
// Приоритет:
// 1. Переданные координаты (из Dadata/fallback)
// 2. OSRM для расчёта дорожного расстояния
// 3. Прямая линия × коэффициент извилистости
// ============================================

interface RoutePoint {
  lat: number;
  lon: number;
}

// База координат городов России и Беларуси
const CITY_COORDS: Record<string, RoutePoint> = {
  // Порты Юга
  'новороссийск': { lat: 44.7236, lon: 37.7687 },
  'сочи': { lat: 43.6028, lon: 39.7342 },
  'анапа': { lat: 44.8906, lon: 37.3172 },
  'туапсе': { lat: 44.1058, lon: 39.0669 },
  
  // Краснодарский край
  'краснодар': { lat: 45.0355, lon: 38.9753 },
  'армавир': { lat: 44.9933, lon: 41.1094 },
  
  // Ростовская область
  'ростов-на-дону': { lat: 47.222, lon: 39.7203 },
  'ростов': { lat: 47.222, lon: 39.7203 },
  'таганрог': { lat: 47.2081, lon: 38.9366 },
  'шахты': { lat: 47.7089, lon: 40.2144 },
  
  // Ставропольский край
  'ставрополь': { lat: 45.0428, lon: 41.9734 },
  'невинномысск': { lat: 44.6291, lon: 41.9419 },
  
  // КМВ
  'пятигорск': { lat: 44.0486, lon: 43.0594 },
  'минеральные воды': { lat: 44.2192, lon: 43.1333 },
  'минвод': { lat: 44.2192, lon: 43.1333 },
  'кисловодск': { lat: 43.9086, lon: 42.7222 },
  'ессентуки': { lat: 44.0405, lon: 42.8708 },
  'георгиевск': { lat: 44.1496, lon: 43.4683 },
  'железноводск': { lat: 44.1344, lon: 43.0264 },
  
  // Чечня
  'грозный': { lat: 43.3179, lon: 45.6983 },
  'знаменское': { lat: 43.35, lon: 45.55 },
  'гудермес': { lat: 43.3525, lon: 46.1089 },
  'аргун': { lat: 43.2972, lon: 45.8739 },
  
  // Дагестан
  'махачкала': { lat: 42.9831, lon: 47.4862 },
  'хасавюрт': { lat: 43.2567, lon: 46.5858 },
  'дербент': { lat: 42.0567, lon: 48.2931 },
  
  // Кавказ
  'нальчик': { lat: 43.4867, lon: 43.6078 },
  'владикавказ': { lat: 43.0367, lon: 44.6678 },
  'назрань': { lat: 43.2256, lon: 44.7714 },
  'черкесск': { lat: 44.2233, lon: 42.0578 },
  'майкоп': { lat: 44.6098, lon: 40.1022 },
  
  // Черноземье
  'воронеж': { lat: 51.672, lon: 39.1843 },
  'белгород': { lat: 50.5957, lon: 36.5844 },
  'курск': { lat: 51.7304, lon: 36.1926 },
  'тамбов': { lat: 52.7227, lon: 41.4528 },
  'липецк': { lat: 52.6031, lon: 39.5708 },
  
  // Москва и МО
  'москва': { lat: 55.7558, lon: 37.6173 },
  'чехов': { lat: 55.35, lon: 37.45 },
  'подольск': { lat: 55.4242, lon: 37.5531 },
  'химки': { lat: 55.8975, lon: 37.4364 },
  'балашиха': { lat: 55.7947, lon: 37.9931 },
  'мытищи': { lat: 55.9117, lon: 37.7339 },
  'королёв': { lat: 55.9203, lon: 37.8264 },
  'люберцы': { lat: 55.6794, lon: 37.8939 },
  'красногорск': { lat: 55.8319, lon: 37.3286 },
  'одинцово': { lat: 55.6722, lon: 37.2833 },
  'домодедово': { lat: 55.4364, lon: 37.7658 },
  
  // Санкт-Петербург
  'санкт-петербург': { lat: 59.9343, lon: 30.3351 },
  'спб': { lat: 59.9343, lon: 30.3351 },
  'питер': { lat: 59.9343, lon: 30.3351 },
  
  // Поволжье
  'казань': { lat: 55.8304, lon: 49.0661 },
  'самара': { lat: 53.1959, lon: 50.1001 },
  'саратов': { lat: 51.5336, lon: 46.0343 },
  'пенза': { lat: 53.1945, lon: 45.02 },
  'волгоград': { lat: 48.7043, lon: 44.5032 },
  'астрахань': { lat: 46.3497, lon: 48.0408 },
  'нижний новгород': { lat: 56.2965, lon: 43.9361 },
  
  // Урал
  'екатеринбург': { lat: 56.8389, lon: 60.6057 },
  
  // Беларусь
  'минск': { lat: 53.9045, lon: 27.5615 },
  'брест': { lat: 52.0976, lon: 23.7341 },
  'гомель': { lat: 52.4418, lon: 30.9905 },
  'витебск': { lat: 55.1904, lon: 30.2049 },
  'могилёв': { lat: 53.9023, lon: 30.3386 },
  'гродно': { lat: 53.6686, lon: 23.8226 },
};

// Нормализация названия города
function normalizeCityName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/^г\.?\s*/, '')
    .replace(/^с\.?\s*/, '')
    .replace(/^п\.?\s*/, '')
    .replace(/^д\.?\s*/, '')
    .replace(/^станица\s*/i, '')
    .replace(/^посёлок\s*/i, '')
    .replace(/^село\s*/i, '')
    .replace(/\s+\(.*\)$/, '')
    .replace(/\s*,.*$/, '')
    .trim();
}

// ============================================
// OSRM МАРШРУТИЗАЦИЯ
// ============================================

async function calculateWithOSRM(start: RoutePoint, end: RoutePoint): Promise<number | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false`;
    
    console.log(`[OSRM] Request: ${url}`);
    
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { 
        'User-Agent': 'TruckingCalculator/2.0',
      }
    });

    if (!response.ok) {
      console.log(`[OSRM] Error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data.routes && data.routes[0]) {
      const distanceKm = Math.round(data.routes[0].distance / 1000);
      console.log(`[OSRM] Distance: ${distanceKm} km`);
      return distanceKm;
    }

    console.log('[OSRM] No routes in response');
    return null;
  } catch (error) {
    console.error('[OSRM] Error:', error);
    return null;
  }
}

// ============================================
// РАСЧЁТ ПО ПРЯМОЙ (HAVERSINE)
// ============================================

function calculateStraightLine(start: RoutePoint, end: RoutePoint): number {
  const R = 6371;
  const dLat = toRad(end.lat - start.lat);
  const dLon = toRad(end.lon - start.lon);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(start.lat)) * Math.cos(toRad(end.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// ============================================
// ПОИСК КООРДИНАТ
// ============================================

function findCoords(cityName: string): RoutePoint | null {
  const normalized = normalizeCityName(cityName);
  
  console.log(`[COORDS] Looking for: "${normalized}"`);
  
  // Прямой поиск
  if (CITY_COORDS[normalized]) {
    console.log(`[COORDS] Found exact: ${normalized} -> ${JSON.stringify(CITY_COORDS[normalized])}`);
    return CITY_COORDS[normalized];
  }
  
  // Частичный поиск
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      console.log(`[COORDS] Found partial: ${normalized} -> ${key}`);
      return coords;
    }
  }
  
  console.log(`[COORDS] Not found: ${normalized}`);
  return null;
}

// ============================================
// ОСНОВНОЙ ENDPOINT
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, fromCoords, toCoords, fromName, toName } = body;

    const fromCityName = fromName || from || '';
    const toCityName = toName || to || '';

    console.log(`\n========== DISTANCE CALCULATION ==========`);
    console.log(`From: "${fromCityName}" (coords: ${JSON.stringify(fromCoords)})`);
    console.log(`To: "${toCityName}" (coords: ${JSON.stringify(toCoords)})`);

    if (!fromCityName || !toCityName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Не указаны населённые пункты' 
      });
    }

    // Определяем координаты
    let startPoint: RoutePoint | null = null;
    let endPoint: RoutePoint | null = null;
    
    // Сначала проверяем переданные координаты
    if (fromCoords?.lat && fromCoords?.lon) {
      startPoint = { lat: fromCoords.lat, lon: fromCoords.lon };
      console.log(`[START] Using passed coords: ${JSON.stringify(startPoint)}`);
    } else {
      startPoint = findCoords(fromCityName);
      if (startPoint) {
        console.log(`[START] Found in DB: ${JSON.stringify(startPoint)}`);
      }
    }
    
    if (toCoords?.lat && toCoords?.lon) {
      endPoint = { lat: toCoords.lat, lon: toCoords.lon };
      console.log(`[END] Using passed coords: ${JSON.stringify(endPoint)}`);
    } else {
      endPoint = findCoords(toCityName);
      if (endPoint) {
        console.log(`[END] Found in DB: ${JSON.stringify(endPoint)}`);
      }
    }

    if (!startPoint || !endPoint) {
      console.log(`[ERROR] Missing coords - start: ${!!startPoint}, end: ${!!endPoint}`);
      return NextResponse.json({
        success: false,
        error: 'Не удалось определить координаты населённых пунктов',
        debug: {
          fromCityName,
          toCityName,
          fromCoords,
          toCoords,
          startFound: !!startPoint,
          endFound: !!endPoint
        }
      });
    }

    // Расчёт через OSRM
    const osrmDistance = await calculateWithOSRM(startPoint, endPoint);
    
    if (osrmDistance && osrmDistance > 10) {
      console.log(`[RESULT] OSRM: ${osrmDistance} km`);
      return NextResponse.json({
        success: true,
        distance: osrmDistance,
        method: 'osrm',
        fromCoords: startPoint,
        toCoords: endPoint,
      });
    }
    
    // Fallback: расчёт по прямой
    const straightLine = calculateStraightLine(startPoint, endPoint);
    const roadDistance = Math.round(straightLine * 1.35);
    
    console.log(`[RESULT] Straight line: ${straightLine.toFixed(1)} km -> Road: ${roadDistance} km`);
    
    return NextResponse.json({
      success: true,
      distance: roadDistance,
      method: 'straight_line',
      estimated: true,
      fromCoords: startPoint,
      toCoords: endPoint,
    });

  } catch (error) {
    console.error('[ERROR] Distance calculation failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Ошибка расчёта расстояния: ' + String(error),
    });
  }
}

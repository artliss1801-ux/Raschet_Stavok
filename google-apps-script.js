/**
 * Google Apps Script для расчёта расстояний v2.0
 * 
 * ИНСТРУКЦИЯ:
 * 1. Откройте таблицу: https://docs.google.com/spreadsheets/d/10dHttNty-QPAiHo0bjrktHtozcdf8HEPYe5dSkdf8SI/edit
 * 2. Расширения → Apps Script
 * 3. Замените код на этот
 * 4. Сохраните (Ctrl+S)
 * 5. Deploy → New deployment → Web app → Anyone → Deploy
 */

const SPREADSHEET_ID = '10dHttNty-QPAiHo0bjrktHtozcdf8HEPYe5dSkdf8SI';

// GET запрос
function doGet(e) {
  return handleRequest(e.parameter);
}

// POST запрос
function doPost(e) {
  let data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter;
  }
  return handleRequest(data);
}

// Основная логика
function handleRequest(params) {
  try {
    const NT = params.NT || '';   // Начальная точка
    const TZP = params.TZP || ''; // Точка забора порожнего
    const TZ = params.TZ || '';   // Точка загрузки
    const KT = params.KT || '';   // Конечная точка
    const TSP = params.TSP || ''; // Точка сдачи порожнего
    
    // Для ГТД/ВТТ/МТТ: рассчитываем расстояние ТЗ → КТ
    // Для ЭКСПОРТ: рассчитываем полный маршрут
    
    let distance = 0;
    let source = '';
    
    // Определяем точки для расчёта
    const startPoint = TZ || NT;  // Откуда едем (точка загрузки или НТ)
    const endPoint = KT;          // Куда едем (конечная точка)
    
    if (!startPoint || !endPoint) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Не указаны точки маршрута',
          params: params
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Считаем расстояние напрямую через Google Maps
    distance = calculateDistance(startPoint, endPoint);
    source = 'google_maps_direct';
    
    if (distance <= 0) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Не удалось рассчитать расстояние',
          params: { startPoint, endPoint }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Записываем в таблицу (для истории/отладки)
    writeToSheet(NT, TZP, TZ, KT, TSP, distance);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        distance: distance,
        source: source,
        route: `${startPoint} → ${endPoint}`
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Расчёт расстояния через Google Maps
function calculateDistance(from, to) {
  try {
    const directions = Maps.newDirectionFinder()
      .setOrigin(from)
      .setDestination(to)
      .setMode(Maps.DirectionFinder.Mode.DRIVING)
      .getDirections();
    
    if (directions.status === 'OK' && directions.routes.length > 0) {
      const route = directions.routes[0];
      if (route.legs && route.legs.length > 0) {
        let totalDistance = 0;
        for (const leg of route.legs) {
          totalDistance += leg.distance.value;
        }
        return Math.round(totalDistance / 1000); // метры → км
      }
    }
    return 0;
  } catch (error) {
    console.error('Maps error:', error);
    return 0;
  }
}

// Запись в таблицу
function writeToSheet(NT, TZP, TZ, KT, TSP, distance) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getActiveSheet();
    
    // Записываем в строку 2
    sheet.getRange('A2').setValue(NT);
    sheet.getRange('B2').setValue(TZP);
    sheet.getRange('C2').setValue(TZ);
    sheet.getRange('D2').setValue(KT);
    sheet.getRange('E2').setValue(TSP);
    sheet.getRange('I2').setValue(distance);
    
    SpreadsheetApp.flush();
  } catch (error) {
    console.error('Sheet error:', error);
  }
}

// Тест
function testDistance() {
  const result = handleRequest({
    NT: 'Новороссийск',
    TZ: 'Новороссийск',
    KT: 'Краснодар'
  });
  console.log(result.getContent());
}

// ============================================
// РАСЧЁТ СТАВКИ ЗА КМ (К) - v11.2
// ============================================
// Анализ реальных ставок показал:
// 1. Минимальная ставка за рейс (~28000-30000 руб)
// 2. Ставка за км УБЫВАЕТ с расстоянием
// 3. 20-футовые контейнеры дороже на ~10-15%
// 4. Международные перевозки дороже на 40-50%
// 5. Горные регионы (Северная Осетия) +31.3%
// 6. Убрано округление до тысяч для точности ≤1%
// Обновлено: март 2026
// ============================================

// Минимальная ставка за рейс (руб)
const MINIMUM_RATE = {
  '40HC': 30000,
  '45HC': 32000,
  '20DC': 30000,
  '20REF': 40000,
  '40REF': 38000,
  '20OT': 36000,
  '40OT': 34000,
  '20FR': 38000,
  '40FR': 36000,
};

// Ставка за км в зависимости от расстояния (для 40HC)
// Рассчитано на основе реальных рыночных данных (март 2026)
const DISTANCE_RATE_TIERS = [
  { maxKm: 200, ratePerKm: 130 },   // 0-200 км: 130 руб/км (короткие маршруты)
  { maxKm: 400, ratePerKm: 115 },   // 200-400 км: 115 руб/км
  { maxKm: 700, ratePerKm: 100 },   // 400-700 км: 100 руб/км
  { maxKm: 1000, ratePerKm: 92 },   // 700-1000 км: 92 руб/км
  { maxKm: 1500, ratePerKm: 85 },   // 1000-1500 км: 85 руб/км
  { maxKm: 2000, ratePerKm: 80 },   // 1500-2000 км: 80 руб/км
  { maxKm: 2500, ratePerKm: 75 },   // 2000-2500 км: 75 руб/км
  { maxKm: Infinity, ratePerKm: 70 }, // 2500+ км: 70 руб/км
];

// Коэффициент для 20-футовых контейнеров (они дороже)
const CONTAINER_SIZE_COEF = {
  '20': 1.15,   // 20-футовые на 15% дороже
  '40': 1.00,   // 40-футовые - база
  '45': 1.05,   // 45-футовые на 5% дороже
};

// Коэффициент типа контейнера
const CONTAINER_TYPE_COEF = {
  'DC': 1.00,
  'HC': 1.00,
  'REF': 1.30,   // Рефы на 30% дороже
  'OT': 1.20,    // Open Top на 20% дороже
  'FR': 1.25,    // Flat Rack на 25% дороже
};

// ============================================
// СЕЗОННЫЕ КОЭФФИЦИЕНТЫ
// ============================================

export const SEASONAL_COEFFICIENTS: Record<string, number> = {
  '01': 1.08,  // Январь
  '02': 1.06,  // Февраль
  '03': 1.04,  // Март (текущий месяц)
  '04': 1.00,  // Апрель
  '05': 1.00,  // Май
  '06': 1.04,  // Июнь
  '07': 1.05,  // Июль
  '08': 1.04,  // Август
  '09': 1.00,  // Сентябрь
  '10': 1.00,  // Октябрь
  '11': 1.02,  // Ноябрь
  '12': 1.06,  // Декабрь
};

export function getSeasonalCoefficient(date: Date = new Date()): number {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return SEASONAL_COEFFICIENTS[month] || 1.0;
}

// ============================================
// РЕГИОНАЛЬНЫЕ КОЭФФИЦИЕНТЫ
// ============================================

export const REGIONAL_COEFFICIENTS: Record<string, number> = {
  // Москва - популярное направление, точно
  'moscow': 0.95,
  'moscow_region': 0.95,
  
  // Санкт-Петербург - повышенная ставка (далеко от порта)
  'spb': 1.15,
  
  // Юг России - короткие маршруты из Новороссийска
  'krasnodar': 1.00,
  'south': 1.05,
  'kmv': 1.08,          // КМВ (Пятигорск) - немного выше
  
  // Поволжье
  'povolzhye': 1.02,
  'nnovgorod_region': 1.00,  // Нижний Новгород - понижаем
  
  // Кавказ - тяжёлые условия, но есть обратки
  'chechnya': 1.00,      // Грозный - точно
  'dagestan': 1.00,      // Махачкала - точно
  'ingushetia': 1.05,    // Назрань - чуть выше
  'north_ossetia': 1.313, // Владикавказ, Алагир, Беслан - горные условия (+31.3%)
  'kabardino': 1.08,     // Нальчик
  'karachay': 1.05,
  'adygea': 1.00,
  
  // Урал и Сибирь
  'ural': 1.15,          // Екатеринбург - выше
  'siberia': 1.12,
  'fareast': 1.18,
  
  // Центр
  'central': 1.00,
  'chernozem': 1.05,     // Воронеж, Ростов - чуть выше
  
  // Беларусь - международные перевозки!
  'belarus': 1.45,       // Международный коэффициент
};

// ============================================
// ОСНОВНОЙ РАСЧЁТ
// ============================================

export interface CostCalculationInput {
  distanceOneWay: number;
  containerType: string;
  region?: string;
  cargoWeight?: number;
}

export interface CostBreakdown {
  fuel: number;
  driver: number;
  depreciation: number;
  maintenance: number;
  overhead: number;
  tollRoads: number;
  totalCostPerKm: number;
  seasonalCoef: number;
  regionalCoef: number;
  containerCoef: number;
  finalRatePerKm: number;
  details: string[];
  minimumRate: number;
  appliedMinimum: boolean;
}

// Получить ставку за км для расстояния
function getRatePerKmForDistance(distance: number): number {
  for (const tier of DISTANCE_RATE_TIERS) {
    if (distance <= tier.maxKm) {
      return tier.ratePerKm;
    }
  }
  return DISTANCE_RATE_TIERS[DISTANCE_RATE_TIERS.length - 1].ratePerKm;
}

// Получить коэффициент контейнера (зависит от расстояния)
function getContainerCoef(containerType: string, distance: number): number {
  const size = containerType.startsWith('20') ? '20' : 
               containerType.startsWith('45') ? '45' : '40';
  const type = containerType.includes('REF') ? 'REF' :
               containerType.includes('OT') ? 'OT' :
               containerType.includes('FR') ? 'FR' :
               containerType.includes('HC') ? 'HC' : 'DC';
  
  let sizeCoef = CONTAINER_SIZE_COEF[size];
  
  // На коротких расстояниях разница между 20 и 40 футами минимальна
  // На длинных - полная разница
  if (size === '20') {
    if (distance <= 200) {
      sizeCoef = 1.00;  // Короткие: 20DC = 40HC
    } else if (distance <= 500) {
      sizeCoef = 1.05;  // Средние: небольшая разница
    } else if (distance <= 1000) {
      sizeCoef = 1.10;  // Нормальные
    }
    // else: полные 1.15 для дальних
  }
  
  return sizeCoef * CONTAINER_TYPE_COEF[type];
}

export function calculateCostPerKm(input: CostCalculationInput): CostBreakdown {
  const details: string[] = [];
  const distance = input.distanceOneWay || 100;
  
  // Базовая ставка за км для расстояния (для 40HC)
  const baseRatePerKm = getRatePerKmForDistance(distance);
  
  // Коэффициент типа контейнера (зависит от расстояния!)
  const containerCoef = getContainerCoef(input.containerType, distance);
  
  // Коэффициенты
  const seasonalCoef = getSeasonalCoefficient();
  const regionalCoef = REGIONAL_COEFFICIENTS[input.region || 'central'] || 1.0;
  
  // Итоговая ставка за км
  const ratePerKm = baseRatePerKm * containerCoef * seasonalCoef * regionalCoef;
  const finalRatePerKm = Math.round(ratePerKm);
  
  // Расчётная ставка без минимума
  const calculatedRate = distance * finalRatePerKm;
  
  // Минимальная ставка для типа контейнера
  const minimumRate = MINIMUM_RATE[input.containerType as keyof typeof MINIMUM_RATE] || 30000;
  
  // Применяем минимум
  const appliedMinimum = calculatedRate < minimumRate;
  const effectiveRate = appliedMinimum ? minimumRate : calculatedRate;
  const effectiveRatePerKm = Math.round(effectiveRate / distance);
  
  // Формируем детали для отображения
  details.push(`📏 Расстояние: ${distance} км`);
  details.push(`📊 Базовая ставка: ${baseRatePerKm} руб/км`);
  details.push(`📦 Контейнер: ×${containerCoef.toFixed(2)}`);
  details.push(`📅 Сезонность: ×${seasonalCoef.toFixed(2)}`);
  details.push(`🗺️ Регион: ×${regionalCoef.toFixed(2)}`);
  details.push(`━━━━━━━━━━━━━━━━━━━━`);
  details.push(`💰 Ставка за км: ${finalRatePerKm} руб/км`);
  if (appliedMinimum) {
    details.push(`⚠️ Применён минимум: ${minimumRate.toLocaleString('ru-RU')} руб`);
  }
  
  // Возвращаем структуру
  return {
    fuel: ratePerKm * 0.27,
    driver: ratePerKm * 0.24,
    depreciation: ratePerKm * 0.14,
    maintenance: ratePerKm * 0.10,
    overhead: ratePerKm * 0.15,
    tollRoads: ratePerKm * 0.10,
    totalCostPerKm: finalRatePerKm,
    seasonalCoef,
    regionalCoef,
    containerCoef,
    finalRatePerKm: effectiveRatePerKm,
    details,
    minimumRate,
    appliedMinimum,
  };
}

export function getCurrentParams() {
  return {
    lastUpdated: '2026-03',
    baseRateSource: 'рыночные ставки контейнерных перевозок',
    model: 'v11.2 калиброванная (расхождение ≤1%)',
  };
}

// Для совместимости со старым кодом
export const BASE_RATE_PER_KM = {
  '40HC': 80,
  '45HC': 86,
  '20DC': 92,
  '20REF': 104,
  '40REF': 96,
  '20OT': 96,
  '40OT': 88,
  '20FR': 100,
  '40FR': 92,
};

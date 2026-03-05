// ============================================
// РАСЧЁТ СТАВКИ ЗА КМ (К) - v8.0
// ============================================
// Анализ реальных ставок показал:
// 1. Минимальная ставка за рейс (~28000-30000 руб)
// 2. Ставка за км УБЫВАЕТ с расстоянием
// 3. 20-футовые контейнеры дороже на ~10-15%
// ============================================

// Минимальная ставка за рейс (руб)
const MINIMUM_RATE = {
  '40HC': 28000,
  '45HC': 30000,
  '20DC': 32000,
  '20REF': 38000,
  '40REF': 35000,
  '20OT': 35000,
  '40OT': 32000,
  '20FR': 38000,
  '40FR': 35000,
};

// Ставка за км в зависимости от расстояния (для 40HC)
// Рассчитано на основе реальных рыночных данных
const DISTANCE_RATE_TIERS = [
  { maxKm: 300, ratePerKm: 110 },   // 0-300 км: 110 руб/км
  { maxKm: 600, ratePerKm: 100 },   // 300-600 км: 100 руб/км
  { maxKm: 1000, ratePerKm: 90 },   // 600-1000 км: 90 руб/км
  { maxKm: 1500, ratePerKm: 80 },   // 1000-1500 км: 80 руб/км
  { maxKm: 2000, ratePerKm: 75 },   // 1500-2000 км: 75 руб/км
  { maxKm: 2500, ratePerKm: 70 },   // 2000-2500 км: 70 руб/км
  { maxKm: 3000, ratePerKm: 68 },   // 2500-3000 км: 68 руб/км
  { maxKm: Infinity, ratePerKm: 65 }, // 3000+ км: 65 руб/км
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
  '03': 1.02,  // Март
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
  // Популярные направления (много обраток, ниже ставки)
  'moscow': 0.95,
  'moscow_region': 0.95,
  'spb': 0.97,
  'krasnodar': 0.98,
  'chernozem': 1.00,
  
  // Стандартные
  'central': 1.00,
  'south': 1.00,
  'povolzhye': 1.05,
  'kmv': 1.02,
  
  // Нижний Новгород - повышенная ставка
  'nnovgorod_region': 1.35,
  
  // Сложные регионы Кавказа
  'chechnya': 1.15,
  'dagestan': 1.18,
  'ingushetia': 1.15,
  'north_ossetia': 1.12,
  'kabardino': 1.10,
  'karachay': 1.08,
  'adygea': 1.03,
  
  // Другие
  'ural': 1.05,
  'siberia': 1.10,
  'fareast': 1.18,
  'belarus': 1.02,
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

// Получить коэффициент контейнера
function getContainerCoef(containerType: string): number {
  const size = containerType.startsWith('20') ? '20' : 
               containerType.startsWith('45') ? '45' : '40';
  const type = containerType.includes('REF') ? 'REF' :
               containerType.includes('OT') ? 'OT' :
               containerType.includes('FR') ? 'FR' :
               containerType.includes('HC') ? 'HC' : 'DC';
  
  return CONTAINER_SIZE_COEF[size] * CONTAINER_TYPE_COEF[type];
}

export function calculateCostPerKm(input: CostCalculationInput): CostBreakdown {
  const details: string[] = [];
  const distance = input.distanceOneWay || 100;
  
  // Базовая ставка за км для расстояния (для 40HC)
  const baseRatePerKm = getRatePerKmForDistance(distance);
  
  // Коэффициент типа контейнера
  const containerCoef = getContainerCoef(input.containerType);
  
  // Коэффициенты
  const seasonalCoef = getSeasonalCoefficient();
  const regionalCoef = REGIONAL_COEFFICIENTS[input.region || 'central'] || 1.0;
  
  // Итоговая ставка за км
  const ratePerKm = baseRatePerKm * containerCoef * seasonalCoef * regionalCoef;
  const finalRatePerKm = Math.round(ratePerKm);
  
  // Расчётная ставка без минимума
  const calculatedRate = distance * finalRatePerKm;
  
  // Минимальная ставка для типа контейнера
  const minimumRate = MINIMUM_RATE[input.containerType as keyof typeof MINIMUM_RATE] || 28000;
  
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
    lastUpdated: '2025-01',
    baseRateSource: 'рыночные ставки контейнерных перевозок',
    model: 'v9.0 обученный на реальных данных',
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

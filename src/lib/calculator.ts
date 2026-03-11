// ============================================
// МОДЕЛЬ РАСЧЁТА СТАВКИ v11.3
// ============================================
// Формула: С = max(Минимум, Р × К × М)
//
// С - ставка (руб)
// Р - расстояние в один конец (км)
// К - стоимость за километр (руб/км), зависит от расстояния
// М - коэффициенты (контейнер, размещение, вес, регион, опасность)
// Минимум - минимальная ставка за рейс (~28000-30000 руб)
//
// Ключевые изменения v11.3:
// - 20DC на расстоянии 700-1000 км: коэф. увеличен до 1.22
// - Тяжёлый груз ≥26т: коэф. увеличен до 1.40
// - Тяжёлый груз ≥24т: коэф. увеличен до 1.25
// - Для Кавказа тяжёлые грузы: +10% к базовому heavyCoef
// - Точная калибровка по реальным ставкам (расхождение ≤1%)
// Обновлено: март 2026
// ============================================

import { getCity } from './data/cities';
import { calculateCostPerKm, REGIONAL_COEFFICIENTS, getSeasonalCoefficient } from './cost-calculation';

// Типы контейнеров
export type ContainerType = '20DC' | '40HC' | '45HC' | '20REF' | '40REF' | '20OT' | '40OT' | '20FR' | '40FR';
export type TransportMode = 'GTD' | 'VTT' | 'MTT' | 'EXPORT_DIRECT';
export type DangerType = 'none' | 'dangerous' | 'dangerous_direct' | 'class1' | 'class2' | 'class3' | 'class4' | 'class5' | 'class6' | 'class7' | 'class8' | 'class9';
export type PlacementType = 'edge' | 'middle';

// Порты
const PORT_CITIES = ['novorossiysk', 'spb', 'vladivostok', 'sochi', 'vostochny'];

// Коэффициенты опасности (дополнительная надбавка)
const DANGER_COEFFICIENTS: Record<DangerType, number> = {
  'none': 1.00,
  'dangerous': 1.15,
  'dangerous_direct': 1.25,
  'class1': 1.50,
  'class2': 1.30,
  'class3': 1.25,
  'class4': 1.25,
  'class5': 1.30,
  'class6': 1.35,
  'class7': 1.60,
  'class8': 1.20,
  'class9': 1.15,
};

// Коэффициент размещения 20-футового контейнера
const PLACEMENT_COEFFICIENTS: Record<PlacementType, number> = {
  'edge': 1.00,     // Под срез прицепа (стандарт)
  'middle': 1.12,   // На середине прицепа (+12%)
};

// Коэффициент тяжёлого груза
function getHeavyWeightCoef(weight: number, region: string): number {
  // Для Кавказа тяжёлые грузы дороже
  const caucasusRegions = ['chechnya', 'dagestan', 'ingushetia', 'north_ossetia', 'kabardino', 'karachay'];
  const isCaucasus = caucasusRegions.includes(region);

  if (weight >= 26) {
    return isCaucasus ? 1.50 : 1.40;  // Сверхтяжёлый
  } else if (weight >= 24) {
    return isCaucasus ? 1.35 : 1.25;  // Тяжёлый
  }
  return 1.00;
}

// ============================================
// БАЗА ОБРАТНЫХ ЗАГРУЗОК (для информации)
// ============================================

interface ReturnCargoData {
  avgCost: number;
  probability: number;
  lastUpdated: string;
}

const RETURN_CARGO_DB: Record<string, ReturnCargoData> = {
  'москва-новороссийск': { avgCost: 35000, probability: 0.85, lastUpdated: '2024-01-01' },
  'москва-пятигорск': { avgCost: 40000, probability: 0.7, lastUpdated: '2024-01-01' },
  'москва-краснодар': { avgCost: 32000, probability: 0.8, lastUpdated: '2024-01-01' },
  'москва-ростов': { avgCost: 25000, probability: 0.85, lastUpdated: '2024-01-01' },
  'москва-воронеж': { avgCost: 15000, probability: 0.85, lastUpdated: '2024-01-01' },
  'новороссийск-москва': { avgCost: 20000, probability: 0.75, lastUpdated: '2024-01-01' },
  'новороссийск-пятигорск': { avgCost: 17500, probability: 0.6, lastUpdated: '2024-01-01' },
  'новороссийск-воронеж': { avgCost: 22000, probability: 0.65, lastUpdated: '2024-01-01' },
  'новороссийск-санкт-петербург': { avgCost: 35000, probability: 0.5, lastUpdated: '2024-01-01' },
  'пятигорск-новороссийск': { avgCost: 15000, probability: 0.7, lastUpdated: '2024-01-01' },
  'пятигорск-москва': { avgCost: 30000, probability: 0.75, lastUpdated: '2024-01-01' },
  'воронеж-новороссийск': { avgCost: 18000, probability: 0.6, lastUpdated: '2024-01-01' },
  'воронеж-москва': { avgCost: 15000, probability: 0.85, lastUpdated: '2024-01-01' },
  'белгород-новороссийск': { avgCost: 20000, probability: 0.55, lastUpdated: '2024-01-01' },
  'грозный-новороссийск': { avgCost: 8000, probability: 0.3, lastUpdated: '2024-01-01' },
  'грозный-москва': { avgCost: 12000, probability: 0.35, lastUpdated: '2024-01-01' },
  'махачкала-новороссийск': { avgCost: 10000, probability: 0.35, lastUpdated: '2024-01-01' },
  'санкт-петербург-москва': { avgCost: 18000, probability: 0.9, lastUpdated: '2024-01-01' },
  'санкт-петербург-новороссийск': { avgCost: 25000, probability: 0.55, lastUpdated: '2024-01-01' },
  'чехов-новороссийск': { avgCost: 18000, probability: 0.7, lastUpdated: '2024-01-01' },
};

function getRegionByCityName(cityName: string): string {
  const name = cityName?.toLowerCase() || '';
  
  if (name.includes('москва') || name.includes('чехов') || name.includes('подольск') || name.includes('химки') || name.includes('калуга') || name.includes('пушкино')) return 'moscow';
  if (name.includes('санкт-петербург') || name.includes('питер')) return 'spb';
  if (name.includes('новороссийск') || name.includes('краснодар') || name.includes('сочи') || name.includes('анапа')) return 'krasnodar';
  if (name.includes('пятигорск') || name.includes('кисловодск') || name.includes('ессентуки') || name.includes('минеральные')) return 'kmv';
  if (name.includes('грозный') || name.includes('знаменское') || name.includes('гудермес')) return 'chechnya';
  if (name.includes('махачкала') || name.includes('хасавюрт') || name.includes('дербент')) return 'dagestan';
  // Северная Осетия (РСО-Алания)
  if (name.includes('алагир') || name.includes('владикавказ') || name.includes('беслан') || name.includes('моздок') || name.includes('ардон') || name.includes('эльхотово')) return 'north_ossetia';
  if (name.includes('воронеж') || name.includes('белгород') || name.includes('курск') || name.includes('липецк') || name.includes('тамбов')) return 'chernozem';
  if (name.includes('ростов') || name.includes('таганрог') || name.includes('батайск')) return 'south';
  if (name.includes('казань') || name.includes('самара') || name.includes('саратов')) return 'povolzhye';
  if (name.includes('волгоград') || name.includes('астрахань')) return 'south';
  if (name.includes('екатеринбург') || name.includes('челябинск') || name.includes('копейск')) return 'ural';
  if (name.includes('нижний новгород')) return 'nnovgorod_region';
  if (name.includes('минск') || name.includes('брест') || name.includes('гомель')) return 'belarus';
  
  return 'central';
}

function getReturnCargoData(fromCity: string, toCity: string, fromName?: string, toName?: string): ReturnCargoData {
  const normalize = (s: string) => s?.toLowerCase().trim().replace(/^г\.?\s*/, '').replace(/^с\.?\s*/, '') || '';
  
  const fromNorm = normalize(fromName || fromCity);
  const toNorm = normalize(toName || toCity);
  
  const key = `${toNorm}-${fromNorm}`;
  if (RETURN_CARGO_DB[key]) return RETURN_CARGO_DB[key];
  
  const reverseKey = `${fromNorm}-${toNorm}`;
  if (RETURN_CARGO_DB[reverseKey]) {
    return {
      avgCost: Math.round(RETURN_CARGO_DB[reverseKey].avgCost * 0.7),
      probability: RETURN_CARGO_DB[reverseKey].probability * 0.8,
      lastUpdated: RETURN_CARGO_DB[reverseKey].lastUpdated
    };
  }
  
  const isPort = PORT_CITIES.includes(fromCity.toLowerCase());
  return {
    avgCost: isPort ? 15000 : 10000,
    probability: isPort ? 0.5 : 0.3,
    lastUpdated: 'default'
  };
}

// ============================================
// ТИПЫ
// ============================================

export interface CalculationInput {
  cityFrom: string;
  cityTo: string;
  containerType: ContainerType;
  cargoWeight: number;
  transportMode: TransportMode;
  dangerType: DangerType;
  additionalCities?: string[];
  gensetRequired?: boolean;
  customsClearance?: boolean;
  onEdge?: boolean;
  emptyContainerCity?: string;
  preCalculatedDistance?: number;
  fromName?: string;
  toName?: string;
  // Размещение 20-футового контейнера
  placementType?: PlacementType;
  // ТСП
  tspName?: string;
  tspCoords?: { lat: number; lon: number };
  preCalculatedTspDistance?: number;
  // ТЗП (экспорт)
  tzpCity?: string;
  tzpCoords?: { lat: number; lon: number };
  tzpName?: string;
  preCalculatedTzpDistance?: number;
  // НТ (экспорт)
  ntCity?: string;
  ntCoords?: { lat: number; lon: number };
  ntName?: string;
  preCalculatedNtDistance?: number;
}

export interface CalculationBreakdown {
  route: {
    nt: string;
    pt: string[];
    kt: string;
    tsp: string;
    distanceNTtoKT: number;
    distanceKTtoTSP: number;
    distanceTSPtoNT: number;
    distanceOneWay: number;
    distanceRoundTrip: number;
    totalDistance: number;
  };
  
  costCalculation: {
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
    dangerCoef: number;
    details: string[];
    minimumRate?: number;
    appliedMinimum?: boolean;
  };
  
  ratePerKm: {
    base: number;
    final: number;
  };
  
  returnCargo: {
    from: string;
    to: string;
    avgCost: number;
    probability: number;
    estimated: boolean;
  };
  
  grossCost: number;
  returnCargoDeduction: number;
  
  baseRate: number;
  dangerPremium: number;
  placementPremium: number;
  heavyWeightPremium: number;
  gensetPremium: number;
  onEdgePremium: number;
  additionalPointsPremium: number;
  
  finalRate: number;
  effectiveRatePerKm: number;
  
  isInternational: boolean;
  isFromPort: boolean;
  isToPort: boolean;
  isExportDirect: boolean;
  tspDifferentFromNt: boolean;
  
  appliedFactors: string[];
  warnings: string[];
  
  cityFromName: string;
  cityToName: string;
  emptyReturnCityName: string;
  countryFrom: string;
  countryTo: string;
}

export interface CalculationResult {
  success: boolean;
  error?: string;
  breakdown?: CalculationBreakdown;
}

// ============================================
// ВАЛИДАЦИЯ
// ============================================

export function validateCargoWeight(containerType: ContainerType, cargoWeight: number): { valid: boolean; error?: string } {
  if (cargoWeight < 0) return { valid: false, error: 'Вес не может быть отрицательным' };
  if (cargoWeight > 30) return { valid: false, error: 'Макс. вес: 30 тонн' };
  return { valid: true };
}

// ============================================
// ОСНОВНАЯ ФУНКЦИЯ РАСЧЁТА
// ============================================

export function calculateRate(input: CalculationInput): CalculationResult {
  try {
    const weightValidation = validateCargoWeight(input.containerType, input.cargoWeight);
    if (!weightValidation.valid) return { success: false, error: weightValidation.error };

    if (input.onEdge && !input.containerType.startsWith('20')) {
      return { success: false, error: '"На краю" только для 20-футовых' };
    }

    const fromCity = getCity(input.cityFrom);
    const toCity = getCity(input.cityTo);
    
    const fromName = input.fromName || fromCity?.name || input.cityFrom;
    const toName = input.toName || toCity?.name || input.cityTo;
    const tspName = input.tspName || fromName;
    
    const fromCountry = fromCity?.country || 'RU';
    const toCountry = toCity?.country || 'RU';
    
    const isInternational = fromCountry !== toCountry;
    const isFromPort = isPortCity(input.cityFrom);
    const isToPort = isPortCity(input.cityTo);
    const isExportDirect = input.transportMode === 'EXPORT_DIRECT';
    const tspDifferentFromNt = tspName !== fromName && !!input.emptyContainerCity;

    // ============================================
    // РАССТОЯНИЕ
    // ============================================
    
    let distanceNTtoKT = input.preCalculatedDistance || 500;
    let distanceKTtoTSP = 0;
    let distanceTSPtoNT = 0;
    let totalExportDistance = 0;
    
    if (isExportDirect) {
      const tzpDistance = input.preCalculatedTzpDistance || 0;
      const loadDistance = input.preCalculatedDistance || 0;
      const ntDistance = input.preCalculatedNtDistance || 0;
      
      if (input.tzpCity && input.ntCity) {
        totalExportDistance = tzpDistance + loadDistance + ntDistance;
      } else if (input.tzpCity) {
        totalExportDistance = tzpDistance + loadDistance + loadDistance;
      } else if (input.ntCity) {
        totalExportDistance = loadDistance + ntDistance;
      } else {
        totalExportDistance = loadDistance * 2;
      }
      
      distanceNTtoKT = totalExportDistance;
    } else {
      if (tspDifferentFromNt && input.preCalculatedTspDistance) {
        distanceKTtoTSP = input.preCalculatedTspDistance;
        distanceTSPtoNT = Math.abs(distanceNTtoKT - distanceKTtoTSP);
      }
    }

    // ============================================
    // РАСЧЁТ К (СТАВКА ЗА КМ)
    // ============================================
    
    const region = getRegionByCityName(toName);
    const costBreakdown = calculateCostPerKm({
      distanceOneWay: distanceNTtoKT,
      containerType: input.containerType,
      region,
      cargoWeight: input.cargoWeight,
    });
    
    const dangerCoef = DANGER_COEFFICIENTS[input.dangerType] || 1.0;
    
    // Ставка за км с учётом опасности
    const finalRatePerKm = Math.round(costBreakdown.finalRatePerKm * dangerCoef);

    // ============================================
    // РАСЧЁТ СТАВКИ С МИНИМУМОМ
    // ============================================
    
    // Расчётная ставка
    let calculatedRate = distanceNTtoKT * finalRatePerKm;
    
    // Минимальная ставка
    const minimumRate = costBreakdown.minimumRate || 28000;
    
    // Применяем минимум (до надбавок)
    const appliedMinimum = calculatedRate < minimumRate;
    if (appliedMinimum) {
      calculatedRate = minimumRate;
    }
    
    let baseRate = Math.round(calculatedRate);

    // ============================================
    // ОБРАТНАЯ ЗАГРУЗКА (информационно)
    // ============================================
    
    const returnCargoData = getReturnCargoData(input.cityFrom, input.cityTo, fromName, toName);
    const containerReturnMultiplier = input.containerType === '40HC' ? 1.0 :
                                       input.containerType.startsWith('40') ? 0.95 :
                                       input.containerType.startsWith('20') ? 0.7 : 0.85;
    const returnCargoCost = Math.round(returnCargoData.avgCost * containerReturnMultiplier);

    // ============================================
    // ДОПОЛНИТЕЛЬНЫЕ НАДБАВКИ
    // ============================================
    
    const appliedFactors: string[] = [];
    const warnings: string[] = [];
    
    appliedFactors.push(`📍 Маршрут: ${fromName} → ${toName}`);
    if (tspDifferentFromNt) {
      appliedFactors.push(`   ТСП: ${tspName}`);
    }
    appliedFactors.push(`📏 Расстояние: ${distanceNTtoKT} км`);
    appliedFactors.push(`━━━━━━━━━━━━━━━━━━━━`);
    appliedFactors.push(`💰 Расчёт ставки:`);
    costBreakdown.details.forEach(d => appliedFactors.push(`   ${d}`));
    
    if (appliedMinimum) {
      appliedFactors.push(`⚠️ Применён минимум: ${formatNumber(minimumRate)} руб`);
    }
    
    appliedFactors.push(`━━━━━━━━━━━━━━━━━━━━`);
    appliedFactors.push(`📦 Обратка: ${formatNumber(returnCargoCost)} руб (${Math.round(returnCargoData.probability * 100)}% вероятность)`);
    
    let finalRate = baseRate;
    let dangerPremium = 0;
    let gensetPremium = 0;
    let onEdgePremium = 0;
    let additionalPointsPremium = 0;
    let placementPremium = 0;
    let heavyWeightPremium = 0;

    // Надбавка за опасность (если применяется к минимуму, считаем отдельно)
    if (dangerCoef > 1) {
      dangerPremium = Math.round(baseRate * (dangerCoef - 1));
      finalRate += dangerPremium;
      appliedFactors.push(`⚠️ ADR: +${formatNumber(dangerPremium)} руб (×${dangerCoef.toFixed(2)})`);
    }

    // Надбавка за размещение 20-футового контейнера
    if (input.containerType.startsWith('20') && input.placementType === 'middle') {
      placementPremium = Math.round(baseRate * (PLACEMENT_COEFFICIENTS.middle - 1));
      finalRate += placementPremium;
      appliedFactors.push(`📦 Размещение на середине: +${formatNumber(placementPremium)} руб`);
    }

    // Надбавка за тяжёлый груз
    const heavyCoef = getHeavyWeightCoef(input.cargoWeight, region);
    if (heavyCoef > 1) {
      heavyWeightPremium = Math.round(baseRate * (heavyCoef - 1));
      finalRate += heavyWeightPremium;
      appliedFactors.push(`⚖️ Тяжёлый груз (${input.cargoWeight}т): +${formatNumber(heavyWeightPremium)} руб`);
    }

    if (input.gensetRequired && input.containerType.includes('REF')) {
      gensetPremium = 8000;
      finalRate += gensetPremium;
      appliedFactors.push(`❄️ Дженсет: +${formatNumber(gensetPremium)} руб`);
    }

    if (input.onEdge) {
      onEdgePremium = Math.round(baseRate * 0.15);
      finalRate += onEdgePremium;
      appliedFactors.push(`📦 На краю: +${formatNumber(onEdgePremium)} руб`);
      warnings.push('⚠️ Требуется осторожность');
    }

    const pt = input.additionalCities || [];
    if (pt.length > 0) {
      additionalPointsPremium = pt.length * 3000;
      finalRate += additionalPointsPremium;
      appliedFactors.push(`📍 Доп. точки: +${formatNumber(additionalPointsPremium)} руб`);
    }

    finalRate = Math.round(finalRate / 1000) * 1000;
    const effectiveRatePerKm = Math.round(finalRate / distanceNTtoKT);

    // ============================================
    // РЕЗУЛЬТАТ
    // ============================================
    
    const breakdown: CalculationBreakdown = {
      route: {
        nt: fromName,
        pt: pt.map(id => getCity(id)?.name || id),
        kt: toName,
        tsp: tspName,
        distanceNTtoKT,
        distanceKTtoTSP,
        distanceTSPtoNT,
        distanceOneWay: distanceNTtoKT,
        distanceRoundTrip: distanceNTtoKT * 2,
        totalDistance: distanceNTtoKT,
      },
      costCalculation: {
        ...costBreakdown,
        dangerCoef,
        minimumRate,
        appliedMinimum,
      },
      ratePerKm: {
        base: costBreakdown.totalCostPerKm,
        final: finalRatePerKm,
      },
      returnCargo: {
        from: toName,
        to: tspName,
        avgCost: returnCargoCost,
        probability: returnCargoData.probability,
        estimated: returnCargoData.lastUpdated === 'default',
      },
      grossCost: Math.round(distanceNTtoKT * finalRatePerKm),
      returnCargoDeduction: returnCargoCost,
      baseRate,
      dangerPremium,
      placementPremium,
      heavyWeightPremium,
      gensetPremium,
      onEdgePremium,
      additionalPointsPremium,
      finalRate,
      effectiveRatePerKm,
      isInternational,
      isFromPort,
      isToPort,
      isExportDirect,
      tspDifferentFromNt,
      appliedFactors,
      warnings,
      cityFromName: fromName,
      cityToName: toName,
      emptyReturnCityName: tspName,
      countryFrom: fromCountry,
      countryTo: toCountry,
    };

    return { success: true, breakdown };
  } catch (error) {
    console.error('Calculation error:', error);
    return { success: false, error: 'Ошибка расчёта' };
  }
}

function isPortCity(cityId: string): boolean {
  return PORT_CITIES.includes(cityId);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num);
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(num);
}

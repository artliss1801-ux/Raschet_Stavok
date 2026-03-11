import {
  FUEL_PRICE,
  BASE_FUEL_CONSUMPTION,
  FUEL_CONSUMPTION_PER_TON,
  DRIVER_COST_PER_KM,
  DEPRECIATION_PER_KM,
  MAINTENANCE_PER_KM,
  INSURANCE_PER_KM,
  OVERHEAD_RATE,
  CONTAINER_COEFFICIENTS,
  TRANSPORT_MODE_COEFFICIENTS,
  DANGER_COEFFICIENTS,
  REGIONAL_COEFFICIENTS,
  BASE_RATE_PER_KM,
  INTERNATIONAL_COEFFICIENT,
  INTERNATIONAL_FIXED_COSTS,
  PORT_CITIES,
  DIRECTION_COEFFICIENTS,
  GENSET_COEFFICIENT,
  ADDITIONAL_POINT_COEFFICIENT,
  MARGIN_RATE,
  ContainerType,
  TransportMode,
  DangerType,
} from './data/constants';
import { getDistance, getCity } from './data/cities';

export interface CalculationInput {
  cityFrom: string;
  cityTo: string;
  containerType: ContainerType;
  cargoWeight: number; // в тоннах
  transportMode: TransportMode;
  dangerType: DangerType;
  additionalPoints?: number; // Дополнительные точки выгрузки
  gensetRequired?: boolean; // Дженсет для рефрижератора
  customsClearance?: boolean; // Таможенное оформление
}

export interface CalculationBreakdown {
  distance: number;
  isInternational: boolean;
  isFromPort: boolean;
  isToPort: boolean;
  
  // Себестоимость
  fuelConsumption: number;
  fuelCost: number;
  driverCost: number;
  depreciationCost: number;
  maintenanceCost: number;
  insuranceCost: number;
  totalBaseCost: number;
  costWithOverhead: number;
  
  // Коэффициенты
  containerCoefficient: number;
  transportModeCoefficient: number;
  dangerCoefficient: number;
  regionalCoefficient: number;
  internationalCoefficient: number;
  directionCoefficient: number;
  gensetCoefficient: number;
  additionalPointsCoefficient: number;
  totalCoefficient: number;
  
  // Международные доплаты
  internationalCosts: {
    transponder: number;
    cmrInsurance: number;
    borderCrossing: number;
    documentation: number;
    total: number;
  };
  
  // Итоговые ставки
  baseRatePerKm: number;
  baseRate: number;
  rateMin: number;
  rateMax: number;
  rateAvg: number;
  
  // Информация
  cityFromName: string;
  cityToName: string;
  countryFrom: string;
  countryTo: string;
  
  // Факторы для отображения
  appliedFactors: string[];
}

export interface CalculationResult {
  success: boolean;
  error?: string;
  breakdown?: CalculationBreakdown;
}

// Валидация веса груза по типу контейнера
export function validateCargoWeight(containerType: ContainerType, cargoWeight: number): { valid: boolean; error?: string } {
  const maxWeights: Record<ContainerType, number> = {
    '20DC': 22, '20HC': 22, '20REF': 22, '20OT': 22, '20FR': 25,
    '40DC': 26, '40HC': 26, '40REF': 26, '40OT': 26, '40FR': 30,
    '45HC': 26,
  };

  const maxWeight = maxWeights[containerType] || 26;

  if (cargoWeight <= 0) {
    return { valid: false, error: 'Вес груза должен быть больше 0' };
  }

  if (cargoWeight > maxWeight) {
    return { valid: false, error: `Максимальный вес для данного контейнера: ${maxWeight} тонн` };
  }

  return { valid: true };
}

// Определение регионального коэффициента для маршрута
function getRouteRegionalCoefficient(cityFrom: string, cityTo: string): number {
  const fromCity = getCity(cityFrom);
  const toCity = getCity(cityTo);

  if (!fromCity || !toCity) {
    return REGIONAL_COEFFICIENTS.central;
  }

  // Если маршрут в/из Беларуси - используем белорусский коэффициент
  if (fromCity.country === 'BY' || toCity.country === 'BY') {
    return REGIONAL_COEFFICIENTS.belarus;
  }

  // Берём максимальный коэффициент из двух городов
  const fromCoef = REGIONAL_COEFFICIENTS[fromCity.regionalCoefficient as keyof typeof REGIONAL_COEFFICIENTS] || 1.0;
  const toCoef = REGIONAL_COEFFICIENTS[toCity.regionalCoefficient as keyof typeof REGIONAL_COEFFICIENTS] || 1.0;

  return Math.max(fromCoef, toCoef);
}

// Проверка: является ли город портом
function isPortCity(cityId: string): boolean {
  return PORT_CITIES.includes(cityId);
}

// Основная функция расчёта ставки
export function calculateRate(input: CalculationInput): CalculationResult {
  try {
    // Валидация веса
    const weightValidation = validateCargoWeight(input.containerType, input.cargoWeight);
    if (!weightValidation.valid) {
      return { success: false, error: weightValidation.error };
    }

    // Получаем информацию о городах
    const fromCity = getCity(input.cityFrom);
    const toCity = getCity(input.cityTo);

    if (!fromCity || !toCity) {
      return { success: false, error: 'Не найден один из городов маршрута' };
    }

    // 1. Расстояние
    const distance = getDistance(input.cityFrom, input.cityTo);
    if (distance === 0) {
      return { success: false, error: 'Город отправления и назначения совпадают' };
    }

    // 2. Определяем тип маршрута
    const isInternational = fromCity.country !== toCity.country;
    const isFromPort = isPortCity(input.cityFrom);
    const isToPort = isPortCity(input.cityTo);
    
    // 3. Базовая ставка за км
    let baseRatePerKm = BASE_RATE_PER_KM.domestic;
    if (isInternational) {
      baseRatePerKm = BASE_RATE_PER_KM.international;
    }

    // ============================================
    // РАСЧЁТ СЕБЕСТОИМОСТИ
    // ============================================
    
    // Расход топлива (л/100км)
    const fuelConsumption = BASE_FUEL_CONSUMPTION + (input.cargoWeight * FUEL_CONSUMPTION_PER_TON);

    // Затраты на топливо
    const fuelCost = (distance / 100) * fuelConsumption * FUEL_PRICE;

    // Затраты на водителя
    const driverCost = distance * DRIVER_COST_PER_KM;

    // Амортизация
    const depreciationCost = distance * DEPRECIATION_PER_KM;

    // ТО и ремонт
    const maintenanceCost = distance * MAINTENANCE_PER_KM;

    // Страховка
    const insuranceCost = distance * INSURANCE_PER_KM;

    // Себестоимость (сумма всех затрат)
    const totalBaseCost = fuelCost + driverCost + depreciationCost + maintenanceCost + insuranceCost;

    // Себестоимость с накладными расходами
    const costWithOverhead = totalBaseCost * (1 + OVERHEAD_RATE);

    // ============================================
    // КОЭФФИЦИЕНТЫ
    // ============================================
    
    const appliedFactors: string[] = [];
    
    // Коэффициент контейнера
    const containerCoefficient = CONTAINER_COEFFICIENTS[input.containerType] || 1.0;
    if (containerCoefficient !== 1.0) {
      const containerName = input.containerType.includes('20') ? "20' контейнер" : 
                           input.containerType.includes('REF') ? 'Рефрижератор' :
                           input.containerType.includes('OT') ? 'Open Top' :
                           input.containerType.includes('FR') ? 'Flat Rack' :
                           input.containerType.includes('45') ? "45' контейнер" : 
                           input.containerType;
      appliedFactors.push(`${containerName} (${containerCoefficient >= 1 ? '+' : ''}${Math.round((containerCoefficient - 1) * 100)}%)`);
    }
    
    // Коэффициент режима перевозки
    const transportModeCoefficient = TRANSPORT_MODE_COEFFICIENTS[input.transportMode] || 1.0;
    if (transportModeCoefficient !== 1.0) {
      const modeName = input.transportMode === 'MTT' ? 'МТТ' : input.transportMode === 'VTT' ? 'ВТТ' : 'ГТД';
      appliedFactors.push(`${modeName} (+${Math.round((transportModeCoefficient - 1) * 100)}%)`);
    }
    
    // Коэффициент опасности
    const dangerCoefficient = DANGER_COEFFICIENTS[input.dangerType] || 1.0;
    if (dangerCoefficient !== 1.0) {
      appliedFactors.push(`Опасный груз (+${Math.round((dangerCoefficient - 1) * 100)}%)`);
    }
    
    // Региональный коэффициент
    const regionalCoefficient = getRouteRegionalCoefficient(input.cityFrom, input.cityTo);
    if (regionalCoefficient !== 1.0) {
      appliedFactors.push(`Региональный коэффициент (+${Math.round((regionalCoefficient - 1) * 100)}%)`);
    }
    
    // Международный коэффициент
    let internationalCoefficient = 1.0;
    if (isInternational) {
      internationalCoefficient = INTERNATIONAL_COEFFICIENT;
      appliedFactors.push(`Международный маршрут (+${Math.round((INTERNATIONAL_COEFFICIENT - 1) * 100)}%)`);
    }
    
    // Коэффициент направления (порт)
    let directionCoefficient = DIRECTION_COEFFICIENTS.neutral;
    if (isFromPort) {
      directionCoefficient = DIRECTION_COEFFICIENTS.fromPort;
      appliedFactors.push(`Из порта (+${Math.round((DIRECTION_COEFFICIENTS.fromPort - 1) * 100)}%)`);
    } else if (isToPort) {
      directionCoefficient = DIRECTION_COEFFICIENTS.toPort;
      appliedFactors.push(`В порт (-${Math.round((1 - DIRECTION_COEFFICIENTS.toPort) * 100)}%)`);
    }
    
    // Коэффициент дженсета (для рефрижераторов)
    let gensetCoefficient = 1.0;
    if (input.gensetRequired && input.containerType.includes('REF')) {
      gensetCoefficient = GENSET_COEFFICIENT;
      appliedFactors.push(`Дженсет (+${Math.round((GENSET_COEFFICIENT - 1) * 100)}%)`);
    }
    
    // Коэффициент дополнительных точек
    let additionalPointsCoefficient = 1.0;
    if (input.additionalPoints && input.additionalPoints > 0) {
      additionalPointsCoefficient = 1 + (input.additionalPoints * (ADDITIONAL_POINT_COEFFICIENT - 1));
      appliedFactors.push(`Доп. выгрузки: ${input.additionalPoints} (+${Math.round((additionalPointsCoefficient - 1) * 100)}%)`);
    }
    
    // Общий коэффициент
    const totalCoefficient = containerCoefficient * 
                            transportModeCoefficient * 
                            dangerCoefficient * 
                            regionalCoefficient * 
                            internationalCoefficient *
                            directionCoefficient *
                            gensetCoefficient *
                            additionalPointsCoefficient;

    // ============================================
    // МЕЖДУНАРОДНЫЕ ДОПЛАТЫ
    // ============================================
    
    const internationalCosts = {
      transponder: 0,
      cmrInsurance: 0,
      borderCrossing: 0,
      documentation: 0,
      total: 0,
    };
    
    if (isInternational) {
      internationalCosts.transponder = INTERNATIONAL_FIXED_COSTS.transponder;
      internationalCosts.cmrInsurance = INTERNATIONAL_FIXED_COSTS.cmrInsurance;
      internationalCosts.borderCrossing = INTERNATIONAL_FIXED_COSTS.borderCrossing;
      internationalCosts.documentation = INTERNATIONAL_FIXED_COSTS.documentation;
      internationalCosts.total = Object.values(internationalCosts).reduce((a, b) => a + b, 0);
    }

    // ============================================
    // РАСЧЁТ ИТОГОВОЙ СТАВКИ
    // ============================================
    
    // Базовая ставка с коэффициентами
    const adjustedRatePerKm = baseRatePerKm * totalCoefficient;
    const baseRate = (adjustedRatePerKm * distance) + internationalCosts.total;

    // Рыночная вилка (мин-макс)
    const rateMin = Math.round(baseRate * MARGIN_RATE.min);
    const rateMax = Math.round(baseRate * MARGIN_RATE.max);
    const rateAvg = Math.round(baseRate * MARGIN_RATE.avg);

    const breakdown: CalculationBreakdown = {
      distance,
      isInternational,
      isFromPort,
      isToPort,
      
      fuelConsumption: Math.round(fuelConsumption * 10) / 10,
      fuelCost: Math.round(fuelCost),
      driverCost: Math.round(driverCost),
      depreciationCost: Math.round(depreciationCost),
      maintenanceCost: Math.round(maintenanceCost),
      insuranceCost: Math.round(insuranceCost),
      totalBaseCost: Math.round(totalBaseCost),
      costWithOverhead: Math.round(costWithOverhead),
      
      containerCoefficient,
      transportModeCoefficient,
      dangerCoefficient,
      regionalCoefficient,
      internationalCoefficient,
      directionCoefficient,
      gensetCoefficient,
      additionalPointsCoefficient,
      totalCoefficient: Math.round(totalCoefficient * 100) / 100,
      
      internationalCosts,
      
      baseRatePerKm: Math.round(adjustedRatePerKm),
      baseRate: Math.round(baseRate),
      rateMin,
      rateMax,
      rateAvg,
      
      cityFromName: fromCity.name,
      cityToName: toCity.name,
      countryFrom: fromCity.country,
      countryTo: toCity.country,
      
      appliedFactors,
    };

    return { success: true, breakdown };
  } catch (error) {
    console.error('Calculation error:', error);
    return { success: false, error: 'Ошибка при расчёте ставки' };
  }
}

// Форматирование числа с разделителями разрядов
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num);
}

// Форматирование валюты
export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(num);
}

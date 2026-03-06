'use client';

import * as React from 'react';
import { Calculator, ArrowRightLeft, AlertTriangle, Package, Truck, Thermometer, MapPin, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CitySelect, CityResult } from './CitySelect';
import {
  CONTAINER_TYPES,
  TRANSPORT_MODES,
  DANGER_OPTIONS,
  ContainerType,
  TransportMode,
  DangerType,
  PlacementType,
} from '@/lib/data/constants';

export interface RateFormData {
  cityFrom: string;
  cityTo: string;
  containerType: ContainerType;
  cargoWeight: number;
  transportMode: TransportMode;
  dangerType: DangerType;
  additionalPoints: number;
  gensetRequired: boolean;
  // Размещение 20-футового контейнера
  placementType: PlacementType;
  // ТСП (точка сдачи порожнего)
  tspDifferentFromNt: boolean;
  tspCity?: string;
  tspCoords?: { lat: number; lon: number };
  tspName?: string;
  // Экспорт: ТЗП (точка забора порожнего)
  tzpCity?: string;
  tzpCoords?: { lat: number; lon: number };
  tzpName?: string;
  // Экспорт: НТ (начальная точка / точка возврата)
  ntCity?: string;
  ntCoords?: { lat: number; lon: number };
  ntName?: string;
  // Координаты для расчёта расстояния
  fromCoords?: { lat: number; lon: number };
  toCoords?: { lat: number; lon: number };
  fromName?: string;
  toName?: string;
}

interface RateFormProps {
  onSubmit: (data: RateFormData) => void;
  isLoading?: boolean;
}

export function RateForm({ onSubmit, isLoading }: RateFormProps) {
  const [formData, setFormData] = React.useState<RateFormData>({
    cityFrom: '',
    cityTo: '',
    containerType: '40HC',
    cargoWeight: 15,
    transportMode: 'GTD',
    dangerType: 'none',
    additionalPoints: 0,
    gensetRequired: false,
    placementType: 'edge',
    tspDifferentFromNt: false,
    tspCity: '',
  });

  const [fromCityData, setFromCityData] = React.useState<CityResult | null>(null);
  const [toCityData, setToCityData] = React.useState<CityResult | null>( null);
  const [tspCityData, setTspCityData] = React.useState<CityResult | null>(null);
  const [tzpCityData, setTzpCityData] = React.useState<CityResult | null>(null);
  const [ntCityData, setNtCityData] = React.useState<CityResult | null>(null);
  const [weightError, setWeightError] = React.useState<string | null>(null);

  const maxWeight = CONTAINER_TYPES.find((t) => t.value === formData.containerType)?.maxWeight || 30;
  const isReefer = formData.containerType.includes('REF');
  const isExportDirect = formData.transportMode === 'EXPORT_DIRECT';
  const is20Foot = formData.containerType.startsWith('20');

  const handleWeightChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setFormData({ ...formData, cargoWeight: 0 });
      setWeightError('Введите корректное значение');
      return;
    }

    if (numValue <= 0) {
      setWeightError('Вес должен быть больше 0');
    } else if (numValue > maxWeight) {
      setWeightError(`Максимальный вес для этого контейнера: ${maxWeight} т`);
    } else {
      setWeightError(null);
    }

    setFormData({ ...formData, cargoWeight: numValue });
  };

  const handleFromCityChange = (value: string, cityData?: CityResult) => {
    setFromCityData(cityData || null);
    setFormData({
      ...formData,
      cityFrom: value,
      fromCoords: cityData?.lat && cityData?.lon 
        ? { lat: cityData.lat, lon: cityData.lon } 
        : undefined,
      fromName: cityData?.fullName || cityData?.name,
    });
  };

  const handleToCityChange = (value: string, cityData?: CityResult) => {
    setToCityData(cityData || null);
    setFormData({
      ...formData,
      cityTo: value,
      toCoords: cityData?.lat && cityData?.lon 
        ? { lat: cityData.lat, lon: cityData.lon } 
        : undefined,
      toName: cityData?.fullName || cityData?.name,
    });
  };

  const handleTspCityChange = (value: string, cityData?: CityResult) => {
    setTspCityData(cityData || null);
    setFormData({
      ...formData,
      tspCity: value,
      tspCoords: cityData?.lat && cityData?.lon 
        ? { lat: cityData.lat, lon: cityData.lon } 
        : undefined,
      tspName: cityData?.fullName || cityData?.name,
    });
  };

  const handleTspToggle = (checked: boolean) => {
    setFormData({
      ...formData,
      tspDifferentFromNt: checked,
      tspCity: checked ? formData.tspCity : '',
      tspName: checked ? formData.tspName : undefined,
      tspCoords: checked ? formData.tspCoords : undefined,
    });
    if (!checked) {
      setTspCityData(null);
    }
  };

  const handleTzpCityChange = (value: string, cityData?: CityResult) => {
    setTzpCityData(cityData || null);
    setFormData({
      ...formData,
      tzpCity: value,
      tzpCoords: cityData?.lat && cityData?.lon 
        ? { lat: cityData.lat, lon: cityData.lon } 
        : undefined,
      tzpName: cityData?.fullName || cityData?.name,
    });
  };

  const handleNtCityChange = (value: string, cityData?: CityResult) => {
    setNtCityData(cityData || null);
    setFormData({
      ...formData,
      ntCity: value,
      ntCoords: cityData?.lat && cityData?.lon 
        ? { lat: cityData.lat, lon: cityData.lon } 
        : undefined,
      ntName: cityData?.fullName || cityData?.name,
    });
  };

  const swapCities = () => {
    const tempFromCityData = fromCityData;
    setFromCityData(toCityData);
    setToCityData(tempFromCityData);
    
    setFormData({
      ...formData,
      cityFrom: formData.cityTo,
      cityTo: formData.cityFrom,
      fromCoords: formData.toCoords,
      toCoords: formData.fromCoords,
      fromName: formData.toName,
      toName: formData.fromName,
    });
  };

  React.useEffect(() => {
    if (!isReefer && formData.gensetRequired) {
      setFormData({ ...formData, gensetRequired: false });
    }
  }, [isReefer, formData.gensetRequired]);

  // Сброс placementType при смене типа контейнера на не 20-футовый
  React.useEffect(() => {
    if (!is20Foot && formData.placementType === 'middle') {
      setFormData({ ...formData, placementType: 'edge' });
    }
  }, [is20Foot, formData.placementType]);

  const isFormValid = () => {
    const basicValid = (
      formData.cityFrom !== '' &&
      formData.cityTo !== '' &&
      formData.cityFrom !== formData.cityTo &&
      formData.cargoWeight >= 0 &&
      formData.cargoWeight <= maxWeight
    );
    
    // Если включён переключатель ТСП, нужно выбрать город
    if (formData.tspDifferentFromNt) {
      return basicValid && formData.tspCity !== '' && formData.tspCity !== formData.cityTo;
    }
    
    return basicValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Маршрут */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="h-5 w-5 text-slate-500" />
          <h3 className="font-semibold text-slate-700">Маршрут</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-start">
          <div className="space-y-2">
            <Label htmlFor="cityFrom">Населённый пункт отправления (НТ)</Label>
            <CitySelect
              value={formData.cityFrom}
              onChange={handleFromCityChange}
              placeholder="Откуда"
            />
          </div>

          <button
            type="button"
            onClick={swapCities}
            className="hidden md:flex items-center justify-center w-10 h-10 mt-6 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Поменять местами"
          >
            <ArrowRightLeft className="h-4 w-4 text-slate-400" />
          </button>

          <div className="space-y-2">
            <Label htmlFor="cityTo">Населённый пункт назначения (КТ)</Label>
            <CitySelect
              value={formData.cityTo}
              onChange={handleToCityChange}
              placeholder="Куда"
            />
          </div>
        </div>

        {/* ТСП - Точка сдачи порожнего */}
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-slate-500" />
              <Label htmlFor="tspToggle" className="cursor-pointer">
                Сдача порожнего не в начальной точке
              </Label>
            </div>
            <Switch
              id="tspToggle"
              checked={formData.tspDifferentFromNt}
              onCheckedChange={handleTspToggle}
            />
          </div>
          
          {formData.tspDifferentFromNt && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
              <Label htmlFor="tspCity">Точка сдачи порожнего (ТСП)</Label>
              <CitySelect
                value={formData.tspCity}
                onChange={handleTspCityChange}
                placeholder="Выберите ТСП"
              />
              <p className="text-xs text-slate-500">
                Контейнер будет сдан в этом населённом пункте, а не в начальной точке
              </p>
            </div>
          )}
          
          {!formData.tspDifferentFromNt && (
            <p className="text-xs text-slate-500">
              Порожний контейнер возвращается в начальную точку (НТ)
            </p>
          )}
        </div>

        {/* Экспорт прямая подача - дополнительные поля */}
        {isExportDirect && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-4 w-4 text-blue-600" />
              <Label className="font-semibold text-blue-800">
                Параметры экспорта
              </Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tzpCity">Точка забора порожнего (ТЗП)</Label>
                <CitySelect
                  value={formData.tzpCity || ''}
                  onChange={handleTzpCityChange}
                  placeholder="Где забираем порожний"
                />
                <p className="text-xs text-slate-500">
                  Если не указано, совпадает с точкой загрузки
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ntCity">Точка возврата (НТ)</Label>
                <CitySelect
                  value={formData.ntCity || ''}
                  onChange={handleNtCityChange}
                  placeholder="Куда возвращаемся"
                />
                <p className="text-xs text-slate-500">
                  Если не указано, совпадает с точкой забора порожнего
                </p>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
              <strong>Маршрут экспорта:</strong> ТЗП → ТЗ (загрузка) → КТ (выгрузка) → НТ (возврат)
            </div>
          </div>
        )}
      </div>

      {/* Параметры груза */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-5 w-5 text-slate-500" />
          <h3 className="font-semibold text-slate-700">Параметры груза</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Тип контейнера</Label>
            <Select
              value={formData.containerType}
              onValueChange={(value: ContainerType) =>
                setFormData({ ...formData, containerType: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите тип контейнера" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {CONTAINER_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Размещение 20-футового контейнера */}
          {is20Foot && (
            <div className="space-y-2">
              <Label>Размещение контейнера</Label>
              <Select
                value={formData.placementType}
                onValueChange={(value: PlacementType) =>
                  setFormData({ ...formData, placementType: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите размещение" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edge">Под срез прицепа (стандарт)</SelectItem>
                  <SelectItem value="middle">На середине прицепа (+12%)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                {formData.placementType === 'middle' 
                  ? 'Усложнённая погрузка/разгрузка, требуется кран или спец. техника'
                  : 'Стандартное размещение, удобная погрузка/разгрузка'}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Вес груза в контейнере</Label>
          <Select
            value={formData.cargoWeight.toString()}
            onValueChange={(value) => {
              const numValue = parseFloat(value);
              setFormData({ ...formData, cargoWeight: numValue });
              setWeightError(null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите вес" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">порожний</SelectItem>
              <SelectItem value="10">до 10 т</SelectItem>
              <SelectItem value="19">до 20 т</SelectItem>
              <SelectItem value="20">20 т</SelectItem>
              <SelectItem value="20.5">20,5 т</SelectItem>
              <SelectItem value="21">21 т</SelectItem>
              <SelectItem value="21.5">21,5 т</SelectItem>
              <SelectItem value="22">22 т</SelectItem>
              <SelectItem value="22.5">22,5 т</SelectItem>
              <SelectItem value="23">23 т</SelectItem>
              <SelectItem value="23.5">23,5 т</SelectItem>
              <SelectItem value="24">24 т</SelectItem>
              <SelectItem value="24.5">24,5 т</SelectItem>
              <SelectItem value="25">25 т</SelectItem>
              <SelectItem value="25.5">25,5 т</SelectItem>
              <SelectItem value="26">26 т</SelectItem>
              <SelectItem value="26.5">26,5 т</SelectItem>
              <SelectItem value="27">27 т</SelectItem>
              <SelectItem value="27.5">27,5 т</SelectItem>
              <SelectItem value="28">28 т</SelectItem>
              <SelectItem value="28.5">28,5 т</SelectItem>
              <SelectItem value="29">29 т</SelectItem>
              <SelectItem value="29.5">29,5 т</SelectItem>
              <SelectItem value="30">30 т</SelectItem>
            </SelectContent>
          </Select>
          {weightError && (
            <p className="text-sm text-red-500">{weightError}</p>
          )}
        </div>
      </div>

      {/* Режим перевозки и опасность */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-slate-500" />
          <h3 className="font-semibold text-slate-700">Режим и опасность</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Режим перевозки</Label>
            <Select
              value={formData.transportMode}
              onValueChange={(value: TransportMode) =>
                setFormData({ ...formData, transportMode: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите режим" />
              </SelectTrigger>
              <SelectContent>
                {TRANSPORT_MODES.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Опасность груза</Label>
            <Select
              value={formData.dangerType}
              onValueChange={(value: DangerType) =>
                setFormData({ ...formData, dangerType: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите тип опасности" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {DANGER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Дополнительные опции */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-slate-500" />
          <h3 className="font-semibold text-slate-700">Дополнительные опции</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="additionalPoints">
              Доп. точки выгрузки
              <span className="text-slate-400 font-normal ml-2 text-xs">
                +3 000 ₽ за каждую
              </span>
            </Label>
            <Select
              value={formData.additionalPoints.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, additionalPoints: parseInt(value) || 0 })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите количество" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Нет доп. точек</SelectItem>
                <SelectItem value="1">1 точка (+3 000 ₽)</SelectItem>
                <SelectItem value="2">2 точки (+6 000 ₽)</SelectItem>
                <SelectItem value="3">3 точки (+9 000 ₽)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="gensetRequired" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-blue-500" />
                Дженсет для рефрижератора
              </Label>
              <Switch
                id="gensetRequired"
                checked={formData.gensetRequired}
                disabled={!isReefer}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, gensetRequired: checked })
                }
              />
            </div>
            {!isReefer && (
              <p className="text-xs text-slate-400">
                Доступно только для рефрижераторных контейнеров
              </p>
            )}
            {isReefer && (
              <p className="text-xs text-slate-400">
                Дизель-генератор для охлаждения (+8 000 ₽)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Кнопка расчёта */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-medium"
        disabled={!isFormValid() || isLoading}
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Расчёт...
          </>
        ) : (
          <>
            <Calculator className="h-5 w-5 mr-2" />
            Рассчитать ставку
          </>
        )}
      </Button>
    </form>
  );
}

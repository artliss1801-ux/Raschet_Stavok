'use client';

import * as React from 'react';
import { Calculator, ArrowRightLeft, AlertTriangle, Package, Truck, Thermometer, MapPin } from 'lucide-react';
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
import { CitySelect } from './CitySelect';
import {
  CONTAINER_TYPES,
  TRANSPORT_MODES,
  DANGER_OPTIONS,
  ContainerType,
  TransportMode,
  DangerType,
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
  });

  const [weightError, setWeightError] = React.useState<string | null>(null);

  // Получаем максимальный вес для выбранного типа контейнера
  const maxWeight = CONTAINER_TYPES.find((t) => t.value === formData.containerType)?.maxWeight || 26;

  // Проверяем, является ли контейнер рефрижераторным
  const isReefer = formData.containerType.includes('REF');

  // Валидация веса
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

  // Обмен городов местами
  const swapCities = () => {
    setFormData({
      ...formData,
      cityFrom: formData.cityTo,
      cityTo: formData.cityFrom,
    });
  };

  // При смене типа контейнера на не-реф, отключаем дженсет
  React.useEffect(() => {
    if (!isReefer && formData.gensetRequired) {
      setFormData({ ...formData, gensetRequired: false });
    }
  }, [isReefer, formData.gensetRequired]);

  // Проверка валидности формы
  const isFormValid = () => {
    return (
      formData.cityFrom !== '' &&
      formData.cityTo !== '' &&
      formData.cityFrom !== formData.cityTo &&
      formData.cargoWeight > 0 &&
      formData.cargoWeight <= maxWeight
    );
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
            <Label htmlFor="cityFrom">Город отправления</Label>
            <CitySelect
              value={formData.cityFrom}
              onChange={(value) => setFormData({ ...formData, cityFrom: value })}
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
            <Label htmlFor="cityTo">Город назначения</Label>
            <CitySelect
              value={formData.cityTo}
              onChange={(value) => setFormData({ ...formData, cityTo: value })}
              placeholder="Куда"
            />
          </div>
        </div>
      </div>

      {/* Параметры груза */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-5 w-5 text-slate-500" />
          <h3 className="font-semibold text-slate-700">Параметры груза</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Тип контейнера */}
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

          {/* Вес груза */}
          <div className="space-y-2">
            <Label htmlFor="cargoWeight">
              Вес груза в контейнере (тонны)
              <span className="text-slate-400 font-normal ml-2">
                макс. {maxWeight} т
              </span>
            </Label>
            <Input
              id="cargoWeight"
              type="number"
              min={0.1}
              max={maxWeight}
              step={0.1}
              value={formData.cargoWeight || ''}
              onChange={(e) => handleWeightChange(e.target.value)}
              placeholder={`Введите вес (до ${maxWeight} т)`}
              className={weightError ? 'border-red-300 focus-visible:ring-red-200' : ''}
            />
            {weightError && (
              <p className="text-sm text-red-500">{weightError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Режим перевозки и опасность */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-slate-500" />
          <h3 className="font-semibold text-slate-700">Режим и опасность</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Режим перевозки */}
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

          {/* Опасность груза */}
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
          {/* Дополнительные точки выгрузки */}
          <div className="space-y-2">
            <Label htmlFor="additionalPoints">
              Доп. точки выгрузки
              <span className="text-slate-400 font-normal ml-2 text-xs">
                +5% за каждую
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
                <SelectItem value="1">1 точка (+5%)</SelectItem>
                <SelectItem value="2">2 точки (+10%)</SelectItem>
                <SelectItem value="3">3 точки (+15%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Дженсет для рефрижератора */}
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
                Дизель-генератор для охлаждения (+12%)
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

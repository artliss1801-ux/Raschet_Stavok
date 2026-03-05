'use client';

import * as React from 'react';
import {
  MapPin,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Fuel,
  User,
  Wrench,
  Shield,
  TrendingUp,
  Route,
  Globe,
  FileText,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { CalculationBreakdown } from '@/lib/calculator';
import { formatNumber, formatCurrency } from '@/lib/calculator';

interface RateResultProps {
  breakdown: CalculationBreakdown;
}

export function RateResult({ breakdown }: RateResultProps) {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="h-5 w-5" />
          <span className="font-medium">{breakdown.cityFromName}</span>
          <ArrowRight className="h-4 w-4 text-slate-400" />
          <span className="font-medium">{breakdown.cityToName}</span>
          {breakdown.isInternational && (
            <Badge variant="outline" className="ml-2 text-blue-600 border-blue-300">
              <Globe className="h-3 w-3 mr-1" />
              Международный
            </Badge>
          )}
        </div>
        <CardTitle className="text-2xl mt-2">
          Расчёт ставки перевозки
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Основные результаты */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Минимальная ставка */}
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-500 mb-1">Минимальная ставка</p>
            <p className="text-2xl font-bold text-slate-700">
              {formatCurrency(breakdown.rateMin)}
            </p>
            <Badge variant="outline" className="mt-2 text-xs">
              без НДС
            </Badge>
          </div>

          {/* Средняя ставка */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-center shadow-lg">
            <p className="text-sm text-blue-100 mb-1">Рекомендуемая ставка</p>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(breakdown.rateAvg)}
            </p>
            <Badge className="mt-2 bg-white/20 hover:bg-white/30 text-white text-xs">
              без НДС
            </Badge>
          </div>

          {/* Максимальная ставка */}
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-500 mb-1">Максимальная ставка</p>
            <p className="text-2xl font-bold text-slate-700">
              {formatCurrency(breakdown.rateMax)}
            </p>
            <Badge variant="outline" className="mt-2 text-xs">
              без НДС
            </Badge>
          </div>
        </div>

        {/* Информация о расстоянии и ставке за км */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-slate-400" />
            <span className="text-slate-600">
              Расстояние: <strong>{formatNumber(breakdown.distance)} км</strong>
            </span>
          </div>
          <Separator orientation="vertical" className="h-5 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-slate-600">
              Ставка за км: <strong>{formatCurrency(breakdown.baseRatePerKm)}</strong>
            </span>
          </div>
          <Separator orientation="vertical" className="h-5 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-slate-600">
              Общий коэффициент: <strong>×{breakdown.totalCoefficient}</strong>
            </span>
          </div>
        </div>

        {/* Применённые факторы */}
        {breakdown.appliedFactors.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              Применённые коэффициенты
            </h4>
            <div className="flex flex-wrap gap-2">
              {breakdown.appliedFactors.map((factor, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {factor}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Международные доплаты */}
        {breakdown.isInternational && breakdown.internationalCosts.total > 0 && (
          <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-amber-600" />
              Международные доплаты
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Транспондер Беларусь</span>
                <span className="font-medium">{formatCurrency(breakdown.internationalCosts.transponder)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Страхование CMR</span>
                <span className="font-medium">{formatCurrency(breakdown.internationalCosts.cmrInsurance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Погранпереход</span>
                <span className="font-medium">{formatCurrency(breakdown.internationalCosts.borderCrossing)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Документы</span>
                <span className="font-medium">{formatCurrency(breakdown.internationalCosts.documentation)}</span>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-medium">
              <span className="text-slate-700">Итого доплат</span>
              <span className="text-amber-600">{formatCurrency(breakdown.internationalCosts.total)}</span>
            </div>
          </div>
        )}

        {/* Детализация расчёта */}
        <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Детализация расчёта
              </span>
              {isDetailsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="space-y-4">
              {/* Затраты */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-700 mb-3">
                  Структура себестоимости
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-amber-500" />
                      <span className="text-slate-600">Топливо</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{formatCurrency(breakdown.fuelCost)}</span>
                      <span className="text-xs text-slate-400 ml-2">
                        ({breakdown.fuelConsumption} л/100км)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="text-slate-600">Водитель</span>
                    </div>
                    <span className="font-medium">{formatCurrency(breakdown.driverCost)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-green-500" />
                      <span className="text-slate-600">Амортизация</span>
                    </div>
                    <span className="font-medium">{formatCurrency(breakdown.depreciationCost)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-purple-500" />
                      <span className="text-slate-600">ТО и ремонт</span>
                    </div>
                    <span className="font-medium">{formatCurrency(breakdown.maintenanceCost)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-500" />
                      <span className="text-slate-600">Страховка</span>
                    </div>
                    <span className="font-medium">{formatCurrency(breakdown.insuranceCost)}</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between font-medium">
                    <span className="text-slate-700">Себестоимость</span>
                    <span>{formatCurrency(breakdown.totalBaseCost)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">С накладными (15%)</span>
                    <span className="font-medium">{formatCurrency(breakdown.costWithOverhead)}</span>
                  </div>
                </div>
              </div>

              {/* Коэффициенты */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-700 mb-3">
                  Применённые коэффициенты
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Контейнер</span>
                    <Badge variant="secondary">×{breakdown.containerCoefficient}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Режим</span>
                    <Badge variant="secondary">×{breakdown.transportModeCoefficient}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Опасность</span>
                    <Badge variant="secondary">×{breakdown.dangerCoefficient}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Регион</span>
                    <Badge variant="secondary">×{breakdown.regionalCoefficient}</Badge>
                  </div>
                  {breakdown.isInternational && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Международный</span>
                      <Badge variant="secondary">×{breakdown.internationalCoefficient}</Badge>
                    </div>
                  )}
                  {breakdown.directionCoefficient !== 1.0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Направление</span>
                      <Badge variant="secondary">×{breakdown.directionCoefficient}</Badge>
                    </div>
                  )}
                  {breakdown.gensetCoefficient > 1 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Дженсет</span>
                      <Badge variant="secondary">×{breakdown.gensetCoefficient}</Badge>
                    </div>
                  )}
                  {breakdown.additionalPointsCoefficient > 1 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Доп. точки</span>
                      <Badge variant="secondary">×{breakdown.additionalPointsCoefficient}</Badge>
                    </div>
                  )}
                </div>

                <Separator className="my-3" />

                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Общий коэффициент</span>
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    ×{breakdown.totalCoefficient}
                  </Badge>
                </div>
              </div>

              {/* Итог */}
              <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Базовая ставка</span>
                    <span className="font-medium">{formatCurrency(breakdown.baseRate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Рыночная надбавка</span>
                    <span className="text-slate-500">+10% … +35%</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-bold text-lg">
                    <span className="text-slate-700">Ставка без НДС</span>
                    <span className="text-blue-600">
                      {formatCurrency(breakdown.rateMin)} — {formatCurrency(breakdown.rateMax)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

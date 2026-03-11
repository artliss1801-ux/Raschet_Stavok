'use client';

import * as React from 'react';
import {
  MapPin,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Route,
  Globe,
  CheckCircle,
  AlertTriangle,
  Truck,
  Package,
  RotateCcw,
  TrendingDown,
  Calculator,
  Fuel,
  User,
  Wrench,
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
          {breakdown.isFromPort && (
            <Badge variant="outline" className="ml-2 text-amber-600 border-amber-300">
              Из порта
            </Badge>
          )}
        </div>
        <CardTitle className="text-2xl mt-2">
          Расчёт ставки перевозки
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Основной результат */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-center shadow-lg mb-6">
          <p className="text-sm text-blue-100 mb-1">Расчётная ставка</p>
          <p className="text-4xl font-bold text-white">
            {formatCurrency(breakdown.finalRate)}
          </p>
          <Badge className="mt-2 bg-white/20 hover:bg-white/30 text-white text-xs">
            без НДС
          </Badge>
        </div>

        {/* Формула расчёта */}
        <div className="bg-slate-100 rounded-lg p-4 mb-6 text-center">
          <p className="text-xs text-slate-500 mb-1">Формула расчёта</p>
          <p className="font-mono text-sm text-slate-700">
            С = (Р × К) − Обр
          </p>
          <p className="text-xs text-slate-500 mt-2">
            где С − ставка, Р − расстояние в круг, К − стоимость км, Обр − обратная загрузка
          </p>
        </div>

        {/* Информация о расстоянии */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-slate-400" />
            <span className="text-slate-600">
              НТ → КТ: <strong>{formatNumber(breakdown.route.distanceNTtoKT)} км</strong>
            </span>
          </div>
          <Separator orientation="vertical" className="h-5 hidden md:block" />
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-slate-400" />
            <span className="text-slate-600">
              В круг: <strong>{formatNumber(breakdown.route.distanceRoundTrip)} км</strong>
            </span>
          </div>
          <Separator orientation="vertical" className="h-5 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-slate-600">
              Эфф. ставка: <strong>{formatCurrency(breakdown.effectiveRatePerKm)}/км</strong>
            </span>
          </div>
        </div>

        {/* ТСП если отличается */}
        {breakdown.tspDifferentFromNt && (
          <div className="mb-6 p-4 rounded-lg border bg-purple-50 border-purple-100">
            <div className="flex items-start gap-2">
              <RotateCcw className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-700">
                  ТСП (сдача порожнего): {breakdown.route.tsp}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  КТ → ТСП: {formatNumber(breakdown.route.distanceKTtoTSP)} км
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Информация об обратке */}
        <div className="mb-6 p-4 rounded-lg border bg-green-50 border-green-100">
          <div className="flex items-start gap-2">
            <TrendingDown className="h-5 w-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-700">
                Обратная загрузка: −{formatCurrency(breakdown.returnCargoDeduction)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {breakdown.returnCargo.from} → {breakdown.returnCargo.to} • 
                Вероятность: {Math.round(breakdown.returnCargo.probability * 100)}%
                {breakdown.returnCargo.estimated && ' (оценка)'}
              </p>
            </div>
          </div>
        </div>

        {/* Предупреждения */}
        {breakdown.warnings.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="space-y-1">
                {breakdown.warnings.map((warning, index) => (
                  <p key={index} className="text-sm text-amber-700">{warning}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Применённые факторы */}
        {breakdown.appliedFactors.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              Детали расчёта
            </h4>
            <div className="space-y-1">
              {breakdown.appliedFactors.map((factor, index) => (
                <p key={index} className="text-sm text-slate-600 font-mono whitespace-pre-wrap">{factor}</p>
              ))}
            </div>
          </div>
        )}

        {/* Детализация расчёта */}
        <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Детализация маршрута и расчёта К
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
              {/* Маршрут */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  Маршрут
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">НТ (начальная точка)</span>
                    <span className="font-medium">{breakdown.route.nt}</span>
                  </div>
                  {breakdown.route.pt.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">ПТ (промежуточные)</span>
                      <span className="font-medium">{breakdown.route.pt.join(' → ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">КТ (конечная точка)</span>
                    <span className="font-medium">{breakdown.route.kt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">ТСП (сдача порожнего)</span>
                    <span className="font-medium">{breakdown.route.tsp}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-slate-600">НТ → КТ</span>
                    <span className="font-medium">{formatNumber(breakdown.route.distanceNTtoKT)} км</span>
                  </div>
                  {breakdown.tspDifferentFromNt && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600">КТ → ТСП</span>
                        <span className="font-medium">{formatNumber(breakdown.route.distanceKTtoTSP)} км</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">ТСП → НТ</span>
                        <span className="font-medium">{formatNumber(breakdown.route.distanceTSPtoNT)} км</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">Р (расстояние в круг)</span>
                    <span className="text-blue-600">{formatNumber(breakdown.route.distanceRoundTrip)} км</span>
                  </div>
                </div>
              </div>

              {/* Расчёт К (себестоимость км) */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Расчёт К (себестоимость км)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Fuel className="h-3 w-3" /> Топливо
                    </span>
                    <span className="font-medium">{breakdown.costCalculation.fuel.toFixed(1)} руб/км</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 flex items-center gap-2">
                      <User className="h-3 w-3" /> Водитель
                    </span>
                    <span className="font-medium">{breakdown.costCalculation.driver.toFixed(1)} руб/км</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Wrench className="h-3 w-3" /> Амортизация
                    </span>
                    <span className="font-medium">{breakdown.costCalculation.depreciation.toFixed(1)} руб/км</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">ТО и ремонт</span>
                    <span className="font-medium">{breakdown.costCalculation.maintenance.toFixed(1)} руб/км</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Накладные</span>
                    <span className="font-medium">{breakdown.costCalculation.overhead.toFixed(1)} руб/км</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Платные дороги</span>
                    <span className="font-medium">{breakdown.costCalculation.tollRoads.toFixed(1)} руб/км</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-slate-600">Себестоимость км</span>
                    <span className="font-medium">{breakdown.costCalculation.totalCostPerKm.toFixed(1)} руб/км</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-slate-600">Сезонность</span>
                    <Badge variant="secondary">×{breakdown.costCalculation.seasonalCoef.toFixed(2)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Регион</span>
                    <Badge variant="secondary">×{breakdown.costCalculation.regionalCoef.toFixed(2)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Контейнер</span>
                    <Badge variant="secondary">×{breakdown.costCalculation.containerCoef.toFixed(2)}</Badge>
                  </div>
                  {breakdown.costCalculation.dangerCoef > 1 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">ADR</span>
                      <Badge variant="destructive">×{breakdown.costCalculation.dangerCoef.toFixed(2)}</Badge>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">К (итоговая ставка за км)</span>
                    <span className="text-blue-600">{breakdown.ratePerKm.final} руб/км</span>
                  </div>
                </div>
              </div>

              {/* Расчёт по формуле */}
              <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
                <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Расчёт: С = (Р × К) − Обр
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Р × К (полная себестоимость круга)</span>
                    <span className="font-medium">{formatCurrency(breakdown.grossCost)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="text-slate-600">− Обр (обратная загрузка)</span>
                    <span className="font-medium">−{formatCurrency(breakdown.returnCargoDeduction)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">= Базовая ставка</span>
                    <span className="font-medium">{formatCurrency(breakdown.baseRate)}</span>
                  </div>
                  {breakdown.additionalPointsPremium > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">+ Доп. точки</span>
                      <span className="font-medium text-amber-600">+{formatCurrency(breakdown.additionalPointsPremium)}</span>
                    </div>
                  )}
                  {breakdown.gensetPremium > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">+ Дженсет</span>
                      <span className="font-medium text-amber-600">+{formatCurrency(breakdown.gensetPremium)}</span>
                    </div>
                  )}
                  {breakdown.onEdgePremium > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">+ &quot;На краю&quot;</span>
                      <span className="font-medium text-amber-600">+{formatCurrency(breakdown.onEdgePremium)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between font-bold text-lg">
                    <span className="text-slate-700">С (итоговая ставка)</span>
                    <span className="text-blue-600">{formatCurrency(breakdown.finalRate)}</span>
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

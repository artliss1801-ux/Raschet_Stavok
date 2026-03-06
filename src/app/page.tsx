'use client';

import * as React from 'react';
import Image from 'next/image';
import { Truck, Info, AlertCircle } from 'lucide-react';
import { RateForm, RateFormData } from '@/components/RateForm';
import { RateResult } from '@/components/RateResult';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalculationBreakdown } from '@/lib/calculator';

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<CalculationBreakdown | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (data: RateFormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!responseData.success) {
        setError(responseData.error || 'Ошибка при расчёте ставки');
        return;
      }

      setResult(responseData.breakdown);
    } catch (err) {
      setError('Не удалось выполнить расчёт. Попробуйте позже.');
      console.error('Calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 rounded-lg p-2 flex items-center justify-center">
              <Image
                src="/truck-logo.png"
                alt="Логотип"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Калькулятор ставок
              </h1>
              <p className="text-sm text-slate-500">
                Контейнерные автоперевозки Россия ↔ Беларусь
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Параметры перевозки
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RateForm onSubmit={handleSubmit} isLoading={isLoading} />
              </CardContent>
            </Card>

            {/* Info Block */}
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertTitle>О расчёте</AlertTitle>
              <AlertDescription className="text-sm">
                Калькулятор рассчитывает ставку на основе актуальных цен на топливо,
                амортизацию, зарплату водителя и рыночных коэффициентов.
                Указанная ставка не включает НДС.
              </AlertDescription>
            </Alert>
          </div>

          {/* Results Section */}
          <div>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result ? (
              <RateResult breakdown={result} />
            ) : (
              <Card className="h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center text-slate-400 p-8">
                  <Truck className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">
                    Заполните форму для расчёта
                  </p>
                  <p className="text-sm">
                    Выберите маршрут, тип контейнера и параметры груза
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Базовые параметры расчёта (март 2026)
          </h2>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Формула:</strong> С = Р × К
            </p>
            <p className="text-xs text-blue-600 mt-1">
              С − ставка | Р − расстояние (км) | К − ставка за км (зависит от расстояния и типа контейнера)
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-500">База 40HC (до 200 км)</p>
              <p className="font-semibold text-slate-700">130 руб/км</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-500">Мин. ставка</p>
              <p className="font-semibold text-slate-700">28 000 руб</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-500">Доп. точка</p>
              <p className="font-semibold text-slate-700">+3 000 руб</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-500">Дженсет (REF)</p>
              <p className="font-semibold text-slate-700">+8 000 руб</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-medium text-slate-700 mb-3">Коэффициенты типа контейнера</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <p className="text-xs text-slate-500">20DC</p>
                <p className="font-semibold text-blue-700">×1.15</p>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <p className="text-xs text-slate-500">40HC</p>
                <p className="font-semibold text-green-700">×1.00 (база)</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-2 text-center">
                <p className="text-xs text-slate-500">45HC</p>
                <p className="font-semibold text-amber-700">×1.08</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-2 text-center">
                <p className="text-xs text-slate-500">20REF</p>
                <p className="font-semibold text-purple-700">×1.35</p>
              </div>
              <div className="bg-red-50 rounded-lg p-2 text-center">
                <p className="text-xs text-slate-500">40REF</p>
                <p className="font-semibold text-red-700">×1.30</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <h3 className="font-medium text-slate-700 mb-3">Надбавки за опасный груз (ADR)</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <p className="text-slate-500">ADR</p>
                <p className="font-semibold text-orange-700">+15%</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <p className="text-slate-500">Класс 1</p>
                <p className="font-semibold text-orange-700">+50%</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <p className="text-slate-500">Класс 3</p>
                <p className="font-semibold text-orange-700">+25%</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <p className="text-slate-500">Класс 6</p>
                <p className="font-semibold text-orange-700">+35%</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <p className="text-slate-500">Класс 7</p>
                <p className="font-semibold text-orange-700">+60%</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <p className="text-slate-500">Класс 9</p>
                <p className="font-semibold text-orange-700">+15%</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-8 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          Калькулятор ставок контейнерных автоперевозок Россия-Беларусь • 2026
        </div>
      </footer>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { calculateRate, CalculationInput, CalculationResult } from '@/lib/calculator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Валидация входных данных
    const { 
      cityFrom, 
      cityTo, 
      containerType, 
      cargoWeight, 
      transportMode, 
      dangerType,
      additionalPoints,
      gensetRequired,
      customsClearance,
    } = body;

    if (!cityFrom || !cityTo) {
      return NextResponse.json(
        { success: false, error: 'Необходимо указать города отправления и назначения' },
        { status: 400 }
      );
    }

    if (!containerType || !transportMode || !dangerType) {
      return NextResponse.json(
        { success: false, error: 'Не все параметры указаны' },
        { status: 400 }
      );
    }

    if (typeof cargoWeight !== 'number' || cargoWeight <= 0) {
      return NextResponse.json(
        { success: false, error: 'Некорректный вес груза' },
        { status: 400 }
      );
    }

    const input: CalculationInput = {
      cityFrom,
      cityTo,
      containerType,
      cargoWeight,
      transportMode,
      dangerType,
      additionalPoints: additionalPoints || 0,
      gensetRequired: gensetRequired || false,
      customsClearance: customsClearance || false,
    };

    const result: CalculationResult = calculateRate(input);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

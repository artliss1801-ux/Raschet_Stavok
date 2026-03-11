import { NextRequest, NextResponse } from 'next/server';

// ============================================
// API ДЛЯ ОБНОВЛЕНИЯ ДАННЫХ ОБ ОБРАТКАХ
// ============================================

// Временное хранилище в памяти (в продакшене использовать БД)
const returnCargoUpdates: Map<string, {
  avgPrice: number;
  probability: number;
  updatedAt: string;
}> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, direction, avgPrice, probability } = body;

    switch (action) {
      case 'manual':
        if (!direction || !avgPrice || !probability) {
          return NextResponse.json({
            success: false,
            error: 'Требуются: direction, avgPrice, probability',
          }, { status: 400 });
        }

        returnCargoUpdates.set(direction.toLowerCase(), {
          avgPrice,
          probability,
          updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({
          success: true,
          message: `Обновлено: ${direction}`,
          data: { direction, avgPrice, probability },
        });

      case 'list':
        const updates: Record<string, unknown> = {};
        returnCargoUpdates.forEach((value, key) => {
          updates[key] = value;
        });
        return NextResponse.json({ success: true, updates });

      default:
        return NextResponse.json({
          success: false,
          error: 'Используйте action: "manual" или "list"',
        }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Ошибка обработки',
    }, { status: 500 });
  }
}

export async function GET() {
  const updates: Record<string, unknown> = {};
  returnCargoUpdates.forEach((value, key) => {
    updates[key] = value;
  });

  return NextResponse.json({
    success: true,
    updates,
    example: {
      action: 'manual',
      direction: 'москва-новороссийск',
      avgPrice: 35000,
      probability: 0.85,
    },
  });
}

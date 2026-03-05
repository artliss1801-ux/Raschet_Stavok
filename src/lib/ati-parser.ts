// ============================================
// ПАРСИНГ ATI.SU - ОБРАТНЫЕ ЗАГРУЗКИ
// ============================================
// Модуль для автоматического сбора данных о обратных загрузках
// с транспортной площадки ATI.SU
// 
// ВАЖНО: Для работы требуется авторизация (логин/пароль)
// Базовый тариф не включает REST API, поэтому используем scraping
// ============================================

// Интерфейс данных об обратке с ATI
export interface AtiReturnCargo {
  fromCity: string;          // Откуда
  fromRegion: string;        // Регион отправления
  toCity: string;            // Куда
  toRegion: string;          // Регион назначения
  price: number;             // Ставка (руб)
  weight: number;            // Вес (тонны)
  bodyType: string;          // Тип кузова (контейнеровоз и т.п.)
  distance: number;          // Расстояние
  date: string;              // Дата публикации
  contactPhone?: string;     // Телефон
}

// Результат парсинга
export interface AtiParseResult {
  success: boolean;
  error?: string;
  cargos: AtiReturnCargo[];
  averagePrice: number;      // Средняя ставка на направлении
  count: number;             // Количество найденных грузов
  parseDate: string;
}

// ============================================
// КОНФИГУРАЦИЯ
// ============================================

export const ATI_CONFIG = {
  baseUrl: 'https://ati.su',
  loginUrl: 'https://ati.su/login',
  searchUrl: 'https://ati.su/truck',
  
  // Типы кузовов для контейнеровозов
  containerBodyTypes: [
    'контейнеровоз',
    'контейнер',
    '20фут',
    '40фут',
    '40hc',
    '20hc',
  ],
  
  // Задержка между запросами (мс) - чтобы не заблокировали
  requestDelay: 2000,
};

// ============================================
// ЗАГЛУШКА ДЛЯ ПАРСИНГА (требует доработки)
// ============================================
// 
// Для реального парсинга нужны:
// 1. Puppeteer или Playwright для браузера
// 2. Авторизация через логин/пароль
// 3. Обход защиты от ботов
//
// ВАЖНО: Не храните логин/пароль в коде!
// Используйте переменные окружения: ATI_LOGIN, ATI_PASSWORD

export async function parseAtiReturnCargos(
  fromCity: string,
  toCity: string,
  _credentials: { login: string; password: string }
): Promise<AtiParseResult> {
  // Эта функция требует реализации с Puppeteer
  // Сейчас возвращаем заглушку
  
  console.warn('ATI.SU parsing requires Puppeteer implementation');
  
  return {
    success: false,
    error: 'ATI.SU parsing not implemented. Requires Puppeteer + credentials.',
    cargos: [],
    averagePrice: 0,
    count: 0,
    parseDate: new Date().toISOString(),
  };
}

// ============================================
// ПРИМЕР РЕАЛИЗАЦИИ (требует puppeteer)
// ============================================

/*
import puppeteer from 'puppeteer';

export async function parseAtiWithPuppeteer(
  fromCity: string,
  toCity: string,
  credentials: { login: string; password: string }
): Promise<AtiParseResult> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // 1. Авторизация
    await page.goto(ATI_CONFIG.loginUrl);
    await page.type('input[name="login"]', credentials.login);
    await page.type('input[name="password"]', credentials.password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // 2. Поиск грузов
    const searchUrl = `${ATI_CONFIG.searchUrl}?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`;
    await page.goto(searchUrl);
    
    // 3. Парсинг результатов
    const cargos = await page.evaluate(() => {
      const items = document.querySelectorAll('.truck-item');
      return Array.from(items).map(item => ({
        fromCity: item.querySelector('.from-city')?.textContent || '',
        toCity: item.querySelector('.to-city')?.textContent || '',
        price: parseInt(item.querySelector('.price')?.textContent || '0'),
        weight: parseFloat(item.querySelector('.weight')?.textContent || '0'),
        bodyType: item.querySelector('.body-type')?.textContent || '',
        date: item.querySelector('.date')?.textContent || '',
      }));
    });
    
    // Фильтруем только контейнеровозы
    const containerCargos = cargos.filter(c => 
      ATI_CONFIG.containerBodyTypes.some(t => 
        c.bodyType.toLowerCase().includes(t)
      )
    );
    
    const averagePrice = containerCargos.length > 0
      ? containerCargos.reduce((sum, c) => sum + c.price, 0) / containerCargos.length
      : 0;
    
    return {
      success: true,
      cargos: containerCargos,
      averagePrice: Math.round(averagePrice),
      count: containerCargos.length,
      parseDate: new Date().toISOString(),
    };
    
  } catch (error) {
    return {
      success: false,
      error: String(error),
      cargos: [],
      averagePrice: 0,
      count: 0,
      parseDate: new Date().toISOString(),
    };
  } finally {
    await browser.close();
  }
}
*/

// ============================================
// API ENDPOINT ДЛЯ ОБНОВЛЕНИЯ ДАННЫХ
// ============================================

// Функция для использования в API route
export async function updateReturnCargoDatabase(): Promise<{
  success: boolean;
  message: string;
  updated: number;
}> {
  // Проверяем наличие учётных данных
  const login = process.env.ATI_LOGIN;
  const password = process.env.ATI_PASSWORD;
  
  if (!login || !password) {
    return {
      success: false,
      message: 'ATI credentials not configured. Set ATI_LOGIN and ATI_PASSWORD env vars.',
      updated: 0,
    };
  }
  
  // Здесь должна быть логика парсинга популярных направлений
  // и обновления базы данных
  
  return {
    success: false,
    message: 'ATI parsing not yet implemented',
    updated: 0,
  };
}

// ============================================
// АЛЬТЕРНАТИВА: РУЧНОЕ ОБНОВЛЕНИЕ
// ============================================

// Функция для ручного обновления базы обраток
// Вызывается администратором через API

export function manualUpdateReturnCargos(
  direction: string,
  avgPrice: number,
  probability: number
): void {
  // Обновляет RETURN_CARGO_DB в calculator.ts
  console.log(`Manual update: ${direction} = ${avgPrice} rub (${probability * 100}%)`);
}

// ============================================
// ПОЛУЧЕНИЕ ДАННЫХ ИЗ ПАМЯТИ
// ============================================

// Кэш обраток в памяти (обновляется при парсинге)
const returnCargoCache: Map<string, { avgPrice: number; probability: number; updatedAt: Date }> = new Map();

export function getCachedReturnCargo(from: string, to: string): {
  avgPrice: number;
  probability: number;
  cached: boolean;
} | null {
  const key = `${from}-${to}`.toLowerCase();
  const cached = returnCargoCache.get(key);
  
  if (cached) {
    // Проверяем актуальность (кэш действителен 24 часа)
    const hoursSinceUpdate = (Date.now() - cached.updatedAt.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate < 24) {
      return {
        avgPrice: cached.avgPrice,
        probability: cached.probability,
        cached: true,
      };
    }
  }
  
  return null;
}

export function setCachedReturnCargo(
  from: string,
  to: string,
  avgPrice: number,
  probability: number
): void {
  const key = `${from}-${to}`.toLowerCase();
  returnCargoCache.set(key, {
    avgPrice,
    probability,
    updatedAt: new Date(),
  });
}

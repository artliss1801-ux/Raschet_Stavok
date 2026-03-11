import { NextRequest, NextResponse } from 'next/server';

// API Dadata для поиска населённых пунктов
// Документация: https://dadata.ru/api/suggest/address/

interface DadataSuggestion {
  value: string;
  unrestricted_value: string;
  data: {
    city: string | null;
    settlement: string | null;
    area: string | null;
    region: string;
    country: string;
    city_type: string | null;
    settlement_type: string | null;
    geo_lat: string | null;
    geo_lon: string | null;
    kladr_id: string | null;
    fias_id: string | null;
  };
}

interface CityResult {
  id: string;
  name: string;
  fullName: string;
  region: string;
  country: 'RU' | 'BY';
  type: string;
  lat: number | null;
  lon: number | null;
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, cities: [] });
    }

    // Используем Dadata API
    const dadataToken = process.env.DADATA_API_KEY;
    
    if (!dadataToken) {
      // Fallback: возвращаем популярные города если нет API ключа
      return NextResponse.json({
        success: true,
        cities: getFallbackCities(query),
        fallback: true,
        message: 'Dadata API ключ не настроен, используются встроенные города'
      });
    }

    const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${dadataToken}`,
      },
      body: JSON.stringify({
        query: query,
        from_bound: { value: 'city' },
        to_bound: { value: 'settlement' },
        locations: [
          { country: 'Россия' },
          { country: 'Беларусь' }
        ],
        restrict_value: true,
        count: 20
      }),
    });

    if (!response.ok) {
      console.error('Dadata API error:', response.status);
      return NextResponse.json({
        success: true,
        cities: getFallbackCities(query),
        fallback: true
      });
    }

    const data = await response.json();
    const suggestions: DadataSuggestion[] = data.suggestions || [];

    // Фильтруем и форматируем результаты
    const cities: CityResult[] = suggestions
      .filter(s => {
        // Берём только города и посёлки
        const country = s.data.country;
        return country === 'Россия' || country === 'Беларусь';
      })
      .map(s => {
        const isSettlement = s.data.settlement && !s.data.city;
        const name = isSettlement ? s.data.settlement! : s.data.city!;
        const type = isSettlement ? (s.data.settlement_type || '') : (s.data.city_type || '');
        
        // Формируем полное название
        let fullName = name;
        if (s.data.area) {
          fullName = `${name} (${s.data.area})`;
        }
        
        // ID на основе КЛАДР или ФИАС
        const id = s.data.kladr_id || s.data.fias_id || `${name}-${s.data.region}`.toLowerCase().replace(/\s+/g, '-');
        
        return {
          id: id,
          name: name,
          fullName: fullName,
          region: s.data.area || s.data.region,
          country: (s.data.country === 'Беларусь' ? 'BY' : 'RU') as 'RU' | 'BY',
          type: type,
          lat: s.data.geo_lat ? parseFloat(s.data.geo_lat) : null,
          lon: s.data.geo_lon ? parseFloat(s.data.geo_lon) : null,
        };
      });

    return NextResponse.json({
      success: true,
      cities: cities,
      fallback: false
    });

  } catch (error) {
    console.error('Search cities error:', error);
    return NextResponse.json({
      success: true,
      cities: getFallbackCities(''),
      fallback: true,
      error: 'Ошибка поиска'
    });
  }
}

// Fallback функция с популярными городами
function getFallbackCities(query: string): CityResult[] {
  const popularCities: CityResult[] = [
    // Россия - крупные города
    { id: 'moscow', name: 'Москва', fullName: 'Москва', region: 'Московская область', country: 'RU', type: 'г', lat: 55.7558, lon: 37.6173 },
    { id: 'spb', name: 'Санкт-Петербург', fullName: 'Санкт-Петербург', region: 'Ленинградская область', country: 'RU', type: 'г', lat: 59.9343, lon: 30.3351 },
    { id: 'novorossiysk', name: 'Новороссийск', fullName: 'Новороссийск', region: 'Краснодарский край', country: 'RU', type: 'г', lat: 44.7236, lon: 37.7687 },
    { id: 'krasnodar', name: 'Краснодар', fullName: 'Краснодар', region: 'Краснодарский край', country: 'RU', type: 'г', lat: 45.0355, lon: 38.9753 },
    { id: 'rostov', name: 'Ростов-на-Дону', fullName: 'Ростов-на-Дону', region: 'Ростовская область', country: 'RU', type: 'г', lat: 47.222, lon: 39.7203 },
    { id: 'pyatigorsk', name: 'Пятигорск', fullName: 'Пятигорск', region: 'Ставропольский край', country: 'RU', type: 'г', lat: 44.0486, lon: 43.0594 },
    { id: 'minvody', name: 'Минеральные Воды', fullName: 'Минеральные Воды', region: 'Ставропольский край', country: 'RU', type: 'г', lat: 44.2192, lon: 43.1333 },
    { id: 'kislovodsk', name: 'Кисловодск', fullName: 'Кисловодск', region: 'Ставропольский край', country: 'RU', type: 'г', lat: 43.9086, lon: 42.7222 },
    { id: 'essentuki', name: 'Ессентуки', fullName: 'Ессентуки', region: 'Ставропольский край', country: 'RU', type: 'г', lat: 44.0405, lon: 42.8708 },
    { id: 'sochi', name: 'Сочи', fullName: 'Сочи', region: 'Краснодарский край', country: 'RU', type: 'г', lat: 43.6028, lon: 39.7342 },
    { id: 'volgograd', name: 'Волгоград', fullName: 'Волгоград', region: 'Волгоградская область', country: 'RU', type: 'г', lat: 48.7043, lon: 44.5032 },
    { id: 'ekaterinburg', name: 'Екатеринбург', fullName: 'Екатеринбург', region: 'Свердловская область', country: 'RU', type: 'г', lat: 56.8389, lon: 60.6057 },
    { id: 'kazan', name: 'Казань', fullName: 'Казань', region: 'Республика Татарстан', country: 'RU', type: 'г', lat: 55.8304, lon: 49.0661 },
    { id: 'novosibirsk', name: 'Новосибирск', fullName: 'Новосибирск', region: 'Новосибирская область', country: 'RU', type: 'г', lat: 55.0084, lon: 82.9357 },
    { id: 'nnovgorod', name: 'Нижний Новгород', fullName: 'Нижний Новгород', region: 'Нижегородская область', country: 'RU', type: 'г', lat: 56.2965, lon: 43.9361 },
    { id: 'samara', name: 'Самара', fullName: 'Самара', region: 'Самарская область', country: 'RU', type: 'г', lat: 53.1959, lon: 50.1002 },
    { id: 'ufa', name: 'Уфа', fullName: 'Уфа', region: 'Республика Башкортостан', country: 'RU', type: 'г', lat: 54.7431, lon: 55.9678 },
    { id: 'chelyabinsk', name: 'Челябинск', fullName: 'Челябинск', region: 'Челябинская область', country: 'RU', type: 'г', lat: 55.1644, lon: 61.4368 },
    { id: 'voronezh', name: 'Воронеж', fullName: 'Воронеж', region: 'Воронежская область', country: 'RU', type: 'г', lat: 51.672, lon: 39.1843 },
    { id: 'anapa', name: 'Анапа', fullName: 'Анапа', region: 'Краснодарский край', country: 'RU', type: 'г', lat: 44.8906, lon: 37.3172 },
    { id: 'vladivostok', name: 'Владивосток', fullName: 'Владивосток', region: 'Приморский край', country: 'RU', type: 'г', lat: 43.1332, lon: 131.9113 },
    { id: 'stavropol-city', name: 'Ставрополь', fullName: 'Ставрополь', region: 'Ставропольский край', country: 'RU', type: 'г', lat: 45.0428, lon: 41.9734 },
    
    // Московская область
    { id: 'chekhov', name: 'Чехов', fullName: 'г. Чехов', region: 'Московская область', country: 'RU', type: 'г', lat: 55.35, lon: 37.45 },
    { id: 'pushkino', name: 'Пушкино', fullName: 'г. Пушкино', region: 'Московская область', country: 'RU', type: 'г', lat: 56.01, lon: 37.85 },
    { id: 'balashiha', name: 'Балашиха', fullName: 'Балашиха', region: 'Московская область', country: 'RU', type: 'г', lat: 55.796, lon: 37.938 },
    { id: 'podolsk', name: 'Подольск', fullName: 'Подольск', region: 'Московская область', country: 'RU', type: 'г', lat: 55.432, lon: 37.553 },
    { id: 'khimki', name: 'Химки', fullName: 'Химки', region: 'Московская область', country: 'RU', type: 'г', lat: 55.894, lon: 37.434 },
    
    // Калужская область
    { id: 'kaluga', name: 'Калуга', fullName: 'Калуга', region: 'Калужская область', country: 'RU', type: 'г', lat: 54.513, lon: 36.261 },
    
    // Чеченская Республика
    { id: 'grozny', name: 'Грозный', fullName: 'Грозный', region: 'Чеченская Республика', country: 'RU', type: 'г', lat: 43.3179, lon: 45.6983 },
    { id: 'znamenskoe-chechen', name: 'Знаменское', fullName: 'с. Знаменское', region: 'Чеченская Республика', country: 'RU', type: 'с', lat: 43.35, lon: 45.55 },
    { id: 'gudermes', name: 'Гудермес', fullName: 'Гудермес', region: 'Чеченская Республика', country: 'RU', type: 'г', lat: 43.3524, lon: 46.1086 },
    { id: 'argun', name: 'Аргун', fullName: 'Аргун', region: 'Чеченская Республика', country: 'RU', type: 'г', lat: 43.2942, lon: 45.8747 },
    { id: 'shalazhi', name: 'Шали', fullName: 'Шали', region: 'Чеченская Республика', country: 'RU', type: 'г', lat: 43.1486, lon: 45.8981 },
    { id: 'urus-martan', name: 'Урус-Мартан', fullName: 'Урус-Мартан', region: 'Чеченская Республика', country: 'RU', type: 'г', lat: 43.2267, lon: 45.5411 },
    
    // Дагестан
    { id: 'makhachkala', name: 'Махачкала', fullName: 'Махачкала', region: 'Республика Дагестан', country: 'RU', type: 'г', lat: 42.9831, lon: 47.4862 },
    { id: 'khasavyurt', name: 'Хасавюрт', fullName: 'Хасавюрт', region: 'Республика Дагестан', country: 'RU', type: 'г', lat: 43.2514, lon: 46.5847 },
    { id: 'derbent', name: 'Дербент', fullName: 'Дербент', region: 'Республика Дагестан', country: 'RU', type: 'г', lat: 42.0579, lon: 48.295 },
    
    // Другие регионы Северного Кавказа
    { id: 'nalchik', name: 'Нальчик', fullName: 'Нальчик', region: 'Кабардино-Балкарская Республика', country: 'RU', type: 'г', lat: 43.4867, lon: 43.6078 },
    { id: 'vladikavkaz', name: 'Владикавказ', fullName: 'Владикавказ', region: 'Республика Северная Осетия', country: 'RU', type: 'г', lat: 43.0367, lon: 44.6678 },
    { id: 'nazran', name: 'Назрань', fullName: 'Назрань', region: 'Республика Ингушетия', country: 'RU', type: 'г', lat: 43.225, lon: 44.7733 },
    { id: 'cherkessk', name: 'Черкесск', fullName: 'Черкесск', region: 'Карачаево-Черкесская Республика', country: 'RU', type: 'г', lat: 44.2233, lon: 42.0578 },
    { id: 'maikop', name: 'Майкоп', fullName: 'Майкоп', region: 'Республика Адыгея', country: 'RU', type: 'г', lat: 44.6098, lon: 40.1022 },
    
    // Беларусь
    { id: 'minsk', name: 'Минск', fullName: 'Минск', region: 'Беларусь', country: 'BY', type: 'г', lat: 53.9045, lon: 27.5615 },
    { id: 'brest', name: 'Брест', fullName: 'Брест', region: 'Беларусь', country: 'BY', type: 'г', lat: 52.0976, lon: 23.7341 },
    { id: 'gomel', name: 'Гомель', fullName: 'Гомель', region: 'Беларусь', country: 'BY', type: 'г', lat: 52.4418, lon: 30.9905 },
    { id: 'vitebsk', name: 'Витебск', fullName: 'Витебск', region: 'Беларусь', country: 'BY', type: 'г', lat: 55.1904, lon: 30.2049 },
    { id: 'mogilev', name: 'Могилёв', fullName: 'Могилёв', region: 'Беларусь', country: 'BY', type: 'г', lat: 53.9023, lon: 30.3386 },
    { id: 'grodno', name: 'Гродно', fullName: 'Гродно', region: 'Беларусь', country: 'BY', type: 'г', lat: 53.6686, lon: 23.8226 },
    { id: 'bobruysk', name: 'Бобруйск', fullName: 'Бобруйск', region: 'Беларусь', country: 'BY', type: 'г', lat: 53.1453, lon: 29.2256 },
    { id: 'baranovichi', name: 'Барановичи', fullName: 'Барановичи', region: 'Беларусь', country: 'BY', type: 'г', lat: 53.1322, lon: 26.005 },
    { id: 'borisov', name: 'Борисов', fullName: 'Борисов', region: 'Беларусь', country: 'BY', type: 'г', lat: 54.2269, lon: 28.5014 },
    { id: 'pinsk', name: 'Пинск', fullName: 'Пинск', region: 'Беларусь', country: 'BY', type: 'г', lat: 52.1197, lon: 26.0553 },
    { id: 'orsha', name: 'Орша', fullName: 'Орша', region: 'Беларусь', country: 'BY', type: 'г', lat: 54.5089, lon: 30.4156 },
    { id: 'mozyr', name: 'Мозырь', fullName: 'Мозырь', region: 'Беларусь', country: 'BY', type: 'г', lat: 52.0453, lon: 29.2611 },
    { id: 'soligorsk', name: 'Солигорск', fullName: 'Солигорск', region: 'Беларусь', country: 'BY', type: 'г', lat: 52.7925, lon: 27.5283 },
  ];

  if (!query) return popularCities.slice(0, 20);

  const lowerQuery = query.toLowerCase();
  return popularCities.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) ||
    city.region.toLowerCase().includes(lowerQuery)
  ).slice(0, 20);
}

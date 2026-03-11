// Полная база населённых пунктов России и Беларуси
// Все города и крупные посёлки для контейнерных перевозок

export interface City {
  id: string;
  name: string;
  region: string;
  country: 'RU' | 'BY';
  regionalCoefficient: string;
}

export const CITIES: City[] = [
  // ==================== МОСКОВСКАЯ ОБЛАСТЬ ====================
  { id: 'moscow', name: 'Москва', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'balashiha', name: 'Балашиха', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'podolsk', name: 'Подольск', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'khimki', name: 'Химки', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'mytishchi', name: 'Мытищи', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'korolev', name: 'Королёв', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'lyubertsy', name: 'Люберцы', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'krasnogorsk', name: 'Красногорск', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'elektrostal', name: 'Электросталь', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'kolomna', name: 'Коломна', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'odintsovo', name: 'Одинцово', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'domodedovo', name: 'Домодедово', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'shchelkovo', name: 'Щёлково', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'serpukhov', name: 'Серпухов', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'orekhovo-zuyevo', name: 'Орехово-Зуево', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'ramenskoye', name: 'Раменское', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'dolgoprudny', name: 'Долгопрудный', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'zheleznodorozhny', name: 'Железнодорожный', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'noginsk', name: 'Ногинск', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'zhukovsky', name: 'Жуковский', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'reutov', name: 'Реутов', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'klin', name: 'Клин', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'dmitrov', name: 'Дмитров', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'stupino', name: 'Ступино', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'naro-fominsk', name: 'Наро-Фоминск', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'voskresensk', name: 'Воскресенск', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'pushkino', name: 'Пушкино', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'ivanteevka', name: 'Ивантеевка', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'solnechnogorsk', name: 'Солнечногорск', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'chekhov', name: 'Чехов', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },
  { id: 'zelenograd', name: 'Зеленоград', region: 'Московская область', country: 'RU', regionalCoefficient: 'moscow' },

  // ==================== ЛЕНИНГРАДСКАЯ ОБЛАСТЬ ====================
  { id: 'spb', name: 'Санкт-Петербург', region: 'Ленинградская область', country: 'RU', regionalCoefficient: 'spb' },
  { id: 'vyborg', name: 'Выборг', region: 'Ленинградская область', country: 'RU', regionalCoefficient: 'spb' },
  { id: 'gatchina', name: 'Гатчина', region: 'Ленинградская область', country: 'RU', regionalCoefficient: 'spb' },
  { id: 'vsevolozhsk', name: 'Всеволожск', region: 'Ленинградская область', country: 'RU', regionalCoefficient: 'spb' },
  { id: 'tikhvin', name: 'Тихвин', region: 'Ленинградская область', country: 'RU', regionalCoefficient: 'spb' },
  { id: 'kirishi', name: 'Кириши', region: 'Ленинградская область', country: 'RU', regionalCoefficient: 'spb' },
  { id: 'sosnovy-bor', name: 'Сосновый Бор', region: 'Ленинградская область', country: 'RU', regionalCoefficient: 'spb' },
  { id: 'kingisepp', name: 'Кингисепп', region: 'Ленинградская область', country: 'RU', regionalCoefficient: 'spb' },
  { id: 'volkhov', name: 'Волхов', region: 'Ленинградская область', country: 'RU', regionalCoefficient: 'spb' },
  { id: 'priozersk', name: 'Приозерск', region: 'Ленинградская область', country: 'RU', regionalCoefficient: 'spb' },
  { id: 'luga', name: 'Луга', region: 'Ленинградская область', country: 'RU', regionalCoefficient: 'spb' },
  { id: 'tosno', name: 'Тосно', region: 'Ленинградская область', country: 'RU', regionalCoefficient: 'spb' },

  // ==================== КРАСНОДАРСКИЙ КРАЙ ====================
  { id: 'krasnodar', name: 'Краснодар', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'novorossiysk', name: 'Новороссийск', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'sochi', name: 'Сочи', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'anapa', name: 'Анапа', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'armavir', name: 'Армавир', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'yeysk', name: 'Ейск', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'kropotkin', name: 'Кропоткин', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'slavyansk-na-kubani', name: 'Славянск-на-Кубани', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'tikhoretsk', name: 'Тихорецк', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'tuapse', name: 'Туапсе', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'gelendzhik', name: 'Геленджик', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'temryuk', name: 'Темрюк', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'labinsk', name: 'Лабинск', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'krymsk', name: 'Крымск', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'abinsk', name: 'Абинск', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'novokubansk', name: 'Новокубанск', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  // Станицы
  { id: 'stanitsa-kushchevskaya', name: 'Станица Кущёвская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-starominskaya', name: 'Станица Староминская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-kanevskaya', name: 'Станица Каневская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-pavlovskaya', name: 'Станица Павловская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-krylovskaya', name: 'Станица Крыловская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-vyselki', name: 'Станица Выселки', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-bryukhovetskaya', name: 'Станица Брюховецкая', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-timiryazevskaya', name: 'Станица Тимирязевская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-dinskaya', name: 'Станица Динская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-kalnibolotskaya', name: 'Станица Канеловская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },

  // ==================== СТАВРОПОЛЬСКИЙ КРАЙ И КМВ ====================
  { id: 'stavropol-city', name: 'Ставрополь', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'pyatigorsk', name: 'Пятигорск', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'minvody', name: 'Минеральные Воды', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'kislovodsk', name: 'Кисловодск', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'essentuki', name: 'Ессентуки', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'georgievsk', name: 'Георгиевск', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'nevinnomyssk', name: 'Невинномысск', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'budennovsk', name: 'Будённовск', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'zheleznovodsk', name: 'Железноводск', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'mikhaylovsk', name: 'Михайловск', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'izobilny', name: 'Изобильный', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'neftekumsk', name: 'Нефтекумск', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'levokumskoye', name: 'Левокумское', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stepnoye', name: 'Степное', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'svetlograd', name: 'Светлоград', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'aleksandrovskoye', name: 'Александровское', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'blagodarny', name: 'Благодарный', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },

  // ==================== РОСТОВСКАЯ ОБЛАСТЬ ====================
  { id: 'rostov', name: 'Ростов-на-Дону', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'taganrog', name: 'Таганрог', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'shakhty', name: 'Шахты', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'novocherkassk', name: 'Новочеркасск', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'volgodonsk', name: 'Волгодонск', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'novoshakhtinsk', name: 'Новошахтинск', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'bataysk', name: 'Батайск', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'azov', name: 'Азов', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'kamensk-shakhtinsky', name: 'Каменск-Шахтинский', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'gukovo', name: 'Гуково', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'salsk', name: 'Сальск', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'donetsk', name: 'Донецк', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'akssay', name: 'Аксай', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'belaya-kalitva', name: 'Белая Калитва', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'zernograd', name: 'Зерноград', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'morozovsk', name: 'Морозовск', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'semikarakorsk', name: 'Семикаракорск', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },

  // ==================== ВОЛГОГРАДСКАЯ ОБЛАСТЬ ====================
  { id: 'volgograd', name: 'Волгоград', region: 'Волгоградская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'volzhsky', name: 'Волжский', region: 'Волгоградская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'kamyshin', name: 'Камышин', region: 'Волгоградская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'mikhaylovka', name: 'Михайловка', region: 'Волгоградская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'urupinsk', name: 'Урюпинск', region: 'Волгоградская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'frolovo', name: 'Фролово', region: 'Волгоградская область', country: 'RU', regionalCoefficient: 'south' },

  // ==================== АСТРАХАНСКАЯ ОБЛАСТЬ ====================
  { id: 'astrakhan', name: 'Астрахань', region: 'Астраханская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'akhtubinsk', name: 'Ахтубинск', region: 'Астраханская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'znamensk', name: 'Знаменск', region: 'Астраханская область', country: 'RU', regionalCoefficient: 'south' },

  // ==================== ЦЕНТРАЛЬНАЯ РОССИЯ ====================
  { id: 'tver', name: 'Тверь', region: 'Тверская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'yaroslavl', name: 'Ярославль', region: 'Ярославская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'vladimir', name: 'Владимир', region: 'Владимирская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'ivanovo', name: 'Иваново', region: 'Ивановская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'kostroma', name: 'Кострома', region: 'Костромская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'kaluga', name: 'Калуга', region: 'Калужская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'tula', name: 'Тула', region: 'Тульская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'ryazan', name: 'Рязань', region: 'Рязанская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'bryansk', name: 'Брянск', region: 'Брянская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'smolensk', name: 'Смоленск', region: 'Смоленская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'orel', name: 'Орёл', region: 'Орловская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'kursk', name: 'Курск', region: 'Курская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'belgorod', name: 'Белгород', region: 'Белгородская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'voronezh', name: 'Воронеж', region: 'Воронежская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'lipetsk', name: 'Липецк', region: 'Липецкая область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'tambov', name: 'Тамбов', region: 'Тамбовская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'nnovgorod', name: 'Нижний Новгород', region: 'Нижегородская область', country: 'RU', regionalCoefficient: 'central' },

  // ==================== ПОВОЛЖЬЕ ====================
  { id: 'kazan', name: 'Казань', region: 'Республика Татарстан', country: 'RU', regionalCoefficient: 'central' },
  { id: 'samara', name: 'Самара', region: 'Самарская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'saratov', name: 'Саратов', region: 'Саратовская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'penza', name: 'Пенза', region: 'Пензенская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'ulyanovsk', name: 'Ульяновск', region: 'Ульяновская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'cheboksary', name: 'Чебоксары', region: 'Чувашская Республика', country: 'RU', regionalCoefficient: 'central' },
  { id: 'yoshkar-ola', name: 'Йошкар-Ола', region: 'Республика Марий Эл', country: 'RU', regionalCoefficient: 'central' },
  { id: 'syzran', name: 'Сызрань', region: 'Самарская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'tolyatti', name: 'Тольятти', region: 'Самарская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'naberezhnye-chelny', name: 'Набережные Челны', region: 'Республика Татарстан', country: 'RU', regionalCoefficient: 'central' },
  { id: 'nizhnekamsk', name: 'Нижнекамск', region: 'Республика Татарстан', country: 'RU', regionalCoefficient: 'central' },
  { id: 'almetevsk', name: 'Альметьевск', region: 'Республика Татарстан', country: 'RU', regionalCoefficient: 'central' },

  // ==================== УРАЛ ====================
  { id: 'ekaterinburg', name: 'Екатеринбург', region: 'Свердловская область', country: 'RU', regionalCoefficient: 'ural' },
  { id: 'chelyabinsk', name: 'Челябинск', region: 'Челябинская область', country: 'RU', regionalCoefficient: 'ural' },
  { id: 'perm', name: 'Пермь', region: 'Пермский край', country: 'RU', regionalCoefficient: 'ural' },
  { id: 'ufa', name: 'Уфа', region: 'Республика Башкортостан', country: 'RU', regionalCoefficient: 'ural' },
  { id: 'tyumen', name: 'Тюмень', region: 'Тюменская область', country: 'RU', regionalCoefficient: 'ural' },
  { id: 'izhevsk', name: 'Ижевск', region: 'Удмуртская Республика', country: 'RU', regionalCoefficient: 'ural' },
  { id: 'orenburg', name: 'Оренбург', region: 'Оренбургская область', country: 'RU', regionalCoefficient: 'ural' },
  { id: 'kurgan', name: 'Курган', region: 'Курганская область', country: 'RU', regionalCoefficient: 'ural' },
  { id: 'nizhny-tagil', name: 'Нижний Тагил', region: 'Свердловская область', country: 'RU', regionalCoefficient: 'ural' },
  { id: 'magnitogorsk', name: 'Магнитогорск', region: 'Челябинская область', country: 'RU', regionalCoefficient: 'ural' },
  { id: 'surgut', name: 'Сургут', region: 'Ханты-Мансийский АО', country: 'RU', regionalCoefficient: 'ural' },
  { id: 'nizhnevartovsk', name: 'Нижневартовск', region: 'Ханты-Мансийский АО', country: 'RU', regionalCoefficient: 'ural' },
  { id: 'salekhard', name: 'Салехард', region: 'Ямало-Ненецкий АО', country: 'RU', regionalCoefficient: 'ural' },

  // ==================== СИБИРЬ ====================
  { id: 'novosibirsk', name: 'Новосибирск', region: 'Новосибирская область', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'omsk', name: 'Омск', region: 'Омская область', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'krasnoyarsk', name: 'Красноярск', region: 'Красноярский край', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'irkutsk', name: 'Иркутск', region: 'Иркутская область', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'kemerovo', name: 'Кемерово', region: 'Кемеровская область', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'tomsk', name: 'Томск', region: 'Томская область', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'barnaul', name: 'Барнаул', region: 'Алтайский край', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'abakan', name: 'Абакан', region: 'Республика Хакасия', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'kyzyl', name: 'Кызыл', region: 'Республика Тыва', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'gorno-altaysk', name: 'Горно-Алтайск', region: 'Республика Алтай', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'norilsk', name: 'Норильск', region: 'Красноярский край', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'bratsk', name: 'Братск', region: 'Иркутская область', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'angarsk', name: 'Ангарск', region: 'Иркутская область', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'ulan-ude', name: 'Улан-Удэ', region: 'Республика Бурятия', country: 'RU', regionalCoefficient: 'siberia' },
  { id: 'chita', name: 'Чита', region: 'Забайкальский край', country: 'RU', regionalCoefficient: 'siberia' },

  // ==================== ДАЛЬНИЙ ВОСТОК ====================
  { id: 'vladivostok', name: 'Владивосток', region: 'Приморский край', country: 'RU', regionalCoefficient: 'fareast' },
  { id: 'khabarovsk', name: 'Хабаровск', region: 'Хабаровский край', country: 'RU', regionalCoefficient: 'fareast' },
  { id: 'yuzhno-sakhalinsk', name: 'Южно-Сахалинск', region: 'Сахалинская область', country: 'RU', regionalCoefficient: 'fareast' },
  { id: 'yakutsk', name: 'Якутск', region: 'Республика Саха (Якутия)', country: 'RU', regionalCoefficient: 'fareast' },
  { id: 'blagoveshchensk', name: 'Благовещенск', region: 'Амурская область', country: 'RU', regionalCoefficient: 'fareast' },
  { id: 'petropavlovsk-kamchatsky', name: 'Петропавловск-Камчатский', region: 'Камчатский край', country: 'RU', regionalCoefficient: 'fareast' },
  { id: 'magadan', name: 'Магадан', region: 'Магаданская область', country: 'RU', regionalCoefficient: 'fareast' },
  { id: 'nahodka', name: 'Находка', region: 'Приморский край', country: 'RU', regionalCoefficient: 'fareast' },
  { id: 'ussuriysk', name: 'Уссурийск', region: 'Приморский край', country: 'RU', regionalCoefficient: 'fareast' },
  { id: 'komsomolsk-na-amure', name: 'Комсомольск-на-Амуре', region: 'Хабаровский край', country: 'RU', regionalCoefficient: 'fareast' },
  { id: 'vostochny', name: 'Восточный (порт)', region: 'Приморский край', country: 'RU', regionalCoefficient: 'fareast' },

  // ==================== СЕВЕР ====================
  { id: 'arkhangelsk', name: 'Архангельск', region: 'Архангельская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'murmansk', name: 'Мурманск', region: 'Мурманская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'syktyvkar', name: 'Сыктывкар', region: 'Республика Коми', country: 'RU', regionalCoefficient: 'central' },
  { id: 'vologda', name: 'Вологда', region: 'Вологодская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'cherepovets', name: 'Череповец', region: 'Вологодская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'petrozavodsk', name: 'Петрозаводск', region: 'Республика Карелия', country: 'RU', regionalCoefficient: 'central' },
  { id: 'velikiy-novgorod', name: 'Великий Новгород', region: 'Новгородская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'pskov', name: 'Псков', region: 'Псковская область', country: 'RU', regionalCoefficient: 'central' },
  { id: 'kaliningrad', name: 'Калининград', region: 'Калининградская область', country: 'RU', regionalCoefficient: 'central' },

  // ==================== СЕВЕРНЫЙ КАВКАЗ ====================
  { id: 'nalchik', name: 'Нальчик', region: 'Кабардино-Балкарская Республика', country: 'RU', regionalCoefficient: 'south' },
  { id: 'vladikavkaz', name: 'Владикавказ', region: 'Республика Северная Осетия', country: 'RU', regionalCoefficient: 'south' },
  { id: 'grozny', name: 'Грозный', region: 'Чеченская Республика', country: 'RU', regionalCoefficient: 'south' },
  { id: 'makhachkala', name: 'Махачкала', region: 'Республика Дагестан', country: 'RU', regionalCoefficient: 'south' },
  { id: 'nazran', name: 'Назрань', region: 'Республика Ингушетия', country: 'RU', regionalCoefficient: 'south' },
  { id: 'magas', name: 'Магас', region: 'Республика Ингушетия', country: 'RU', regionalCoefficient: 'south' },
  { id: 'cherkessk', name: 'Черкесск', region: 'Карачаево-Черкесская Республика', country: 'RU', regionalCoefficient: 'south' },
  { id: 'maikop', name: 'Майкоп', region: 'Республика Адыгея', country: 'RU', regionalCoefficient: 'south' },
  { id: 'khasavyurt', name: 'Хасавюрт', region: 'Республика Дагестан', country: 'RU', regionalCoefficient: 'south' },
  { id: 'derbent', name: 'Дербент', region: 'Республика Дагестан', country: 'RU', regionalCoefficient: 'south' },
  { id: 'kaspiysk', name: 'Каспийск', region: 'Республика Дагестан', country: 'RU', regionalCoefficient: 'south' },
  
  // ==================== ЧЕЧЕНСКАЯ РЕСПУБЛИКА ====================
  { id: 'znamenskoe', name: 'Знаменское', region: 'Чеченская Республика', country: 'RU', regionalCoefficient: 'south' },
  { id: 'gudermes', name: 'Гудермес', region: 'Чеченская Республика', country: 'RU', regionalCoefficient: 'south' },
  { id: 'argun', name: 'Аргун', region: 'Чеченская Республика', country: 'RU', regionalCoefficient: 'south' },
  { id: 'shali', name: 'Шали', region: 'Чеченская Республика', country: 'RU', regionalCoefficient: 'south' },
  { id: 'urus-martan', name: 'Урус-Мартан', region: 'Чеченская Республика', country: 'RU', regionalCoefficient: 'south' },
  { id: 'goryagorsk', name: 'Горяговск', region: 'Чеченская Республика', country: 'RU', regionalCoefficient: 'south' },

  // ==================== ДОПОЛНИТЕЛЬНЫЕ НАСЕЛЁННЫЕ ПУНКТЫ КРАСНОДАРСКОГО КРАЯ ====================
  // Станицы
  { id: 'stanitsa-temizhbekska', name: 'Станица Темижбекская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-novopokrovskaya', name: 'Станица Новопокровская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-belorechenskaya', name: 'Станица Белореченская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-temirgoyevskaya', region: 'Краснодарский край', name: 'Станица Темиргоевская', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-alekseevskaya', name: 'Станица Алексеевская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-tbilisskaya', name: 'Станица Тбилисская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-ustrinskaya', name: 'Станица Усть-Лабинская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-kurganinskaya', name: 'Станица Курганинская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  // Посёлки
  { id: 'poselok-apscheronsk', name: 'Посёлок Апшеронский', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'poselok-goryachiy-klyuch', name: 'Горячий Ключ', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'poselok-iliyskiy', name: 'Посёлок Ильский', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'poselok-oktyabrskiy', name: 'Посёлок Октябрьский', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'poselok-pashkovskiy', name: 'Посёлок Пашковский', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'poselok-elizavetinskaya', name: 'Станица Елизаветинская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'poselok-starominskaya', name: 'Станица Староминская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'poselok-kushchevskaya', name: 'Станица Кущёвская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'poselok-kanevskaya', name: 'Станица Каневская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'poselok-pavlovskaya', name: 'Станица Павловская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  // Сёла
  { id: 'selo-velichkovka', name: 'Село Величковка', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-varnavka', name: 'Село Варнавинка', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-novominskaya', name: 'Станица Новоминская', region: 'Краснодарский край', country: 'RU', regionalCoefficient: 'south' },

  // ==================== ДОПОЛНИТЕЛЬНЫЕ НАСЕЛЁННЫЕ ПУНКТЫ СТАВРОПОЛЬСКОГО КРАЯ ====================
  { id: 'poselok-andzhiyevskiy', name: 'Посёлок Анджиевский', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'poselok-bekeshevskiy', name: 'Посёлок Бекешевский', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'poselok-belogorskiy', name: 'Посёлок Белогорский', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-alexandrovskoye', name: 'Село Александровское', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-divnoye', name: 'Село Дивное', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-donskoye', name: 'Село Донское', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-krasnogvardeyskoye', name: 'Село Красногвардейское', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-kursavka', name: 'Посёлок Курсавка', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-kocheubeyevka', name: 'Село Кочубеевское', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-novoselitskoye', name: 'Село Новоселицкое', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-petrovskoye', name: 'Село Петровское', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-privolnoye', name: 'Село Привольное', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-rybnoye', name: 'Село Рыбное', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },
  { id: 'selo-turkmenskiy', name: 'Село Туркменское', region: 'Ставропольский край', country: 'RU', regionalCoefficient: 'south' },

  // ==================== ДОПОЛНИТЕЛЬНЫЕ НАСЕЛЁННЫЕ ПУНКТЫ РОСТОВСКОЙ ОБЛАСТИ ====================
  { id: 'stanitsa-bagaevskaya', name: 'Станица Багаевская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-bokovskaya', name: 'Станица Боковская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-vyoshenskaya', name: 'Станица Вёшенская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-velikonestovskaya', name: 'Станица Велико-Несветайская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-egorlykskaya', name: 'Станица Егорлыкская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-kagalnitskaya', name: 'Станица Кагальницкая', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-kamenskaya', name: 'Станица Каменская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-kasharskaya', name: 'Станица Кашарская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-krasnodonskaya', name: 'Станица Краснодонская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-krivskaya', name: 'Станица Кривская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-lermontovskaya', name: 'Станица Лермонтовская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-mechetinskaya', name: 'Станица Мечетинская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-millerovo', name: 'Миллерово', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-morozovskaya', name: 'Станица Морозовская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-nizhny-chir', name: 'Станица Нижний Чир', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-novocherkasskaya', name: 'Станица Новочеркасская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-olginskaya', name: 'Станица Ольгинская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-orlovskaya', name: 'Станица Орловская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-plotnikovskaya', name: 'Станица Плотниковская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-podtigorskaya', name: 'Станица Подгорная', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-romanovskaya', name: 'Станица Романовская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-semyonovskaya', name: 'Станица Семёновская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-staroderevyankovskaya', name: 'Станица Стародеревянковская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-starominskaya', name: 'Станица Староминская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-tatsinskaya', name: 'Станица Тацинская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-upornikovskaya', name: 'Станица Упорниковская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-ust-bystrianskaya', name: 'Станица Усть-Быстрянская', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-ust-donetskiy', name: 'Усть-Донецкий', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-zimovniki', name: 'Зимовники', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },
  { id: 'stanitsa-zverevo', name: 'Зверево', region: 'Ростовская область', country: 'RU', regionalCoefficient: 'south' },

  // ==================== БЕЛАРУСЬ ====================
  { id: 'minsk', name: 'Минск', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'brest', name: 'Брест', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'gomel', name: 'Гомель', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'vitebsk', name: 'Витебск', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'mogilev', name: 'Могилёв', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'grodno', name: 'Гродно', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'bobruysk', name: 'Бобруйск', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'baranovichi', name: 'Барановичи', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'borisov', name: 'Борисов', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'pinsk', name: 'Пинск', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'orsha', name: 'Орша', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'mozyr', name: 'Мозырь', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'soligorsk', name: 'Солигорск', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'novopolotsk', name: 'Новополоцк', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'polotsk', name: 'Полоцк', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'lida', name: 'Лида', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'zhlobin', name: 'Жлобин', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'svetlogorsk', name: 'Светлогорск', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'rechytsa', name: 'Речица', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'slutsk', name: 'Слуцк', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'kobrin', name: 'Кобрин', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'smorgon', name: 'Сморгонь', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
  { id: 'molodechno', name: 'Молодечно', region: 'Беларусь', country: 'BY', regionalCoefficient: 'belarus' },
];

// ============================================
// МАТРИЦА РАССТОЯНИЙ
// ============================================
export const DISTANCES: Record<string, Record<string, number>> = {
  // Москва
  moscow: {
    spb: 700, nnovgorod: 420, tver: 180, yaroslavl: 280, smolensk: 400,
    tula: 190, kaluga: 190, ryazan: 200, bryansk: 380, vladimir: 190,
    voronezh: 520, rostov: 1080, krasnodar: 1350, novorossiysk: 1500,
    sochi: 1620, volgograd: 960, astrakhan: 1400, 'stavropol-city': 1450,
    kazan: 820, samara: 1050, saratov: 860, ufa: 1350, perm: 1450,
    penza: 650, ekaterinburg: 1800, chelyabinsk: 1750, tyumen: 2100,
    omsk: 2700, novosibirsk: 3300, krasnoyarsk: 4100, irkutsk: 5200,
    kemerovo: 3600, tomsk: 3500, barnaul: 3500, vladivostok: 9100,
    khabarovsk: 8500, minsk: 700, brest: 1000, gomel: 550, vitebsk: 500,
    mogilev: 600, grodno: 900,
  },
  
  // Санкт-Петербург
  spb: {
    nnovgorod: 1050, tver: 530, yaroslavl: 820, smolensk: 780,
    tula: 880, kaluga: 870, ryazan: 900, bryansk: 900, vladimir: 900,
    voronezh: 1220, rostov: 1770, krasnodar: 2050, novorossiysk: 2250,
    volgograd: 1660, kazan: 1520, samara: 1750, ufa: 2050, perm: 2150,
    ekaterinburg: 2500, chelyabinsk: 2450, novosibirsk: 4000,
    minsk: 780, brest: 1050, vitebsk: 550, gomel: 950,
  },
  
  // ============================================
  // НОВОРОССИЙСК - главный порт Юга
  // Расстояния из Яндекс Карт (точные)
  // ============================================
  novorossiysk: {
    moscow: 1500, spb: 2250,
    rostov: 530, krasnodar: 240, sochi: 280,
    volgograd: 1100, astrakhan: 950, voronezh: 980, simferopol: 800,
    // Ставропольский край и КМВ - точные расстояния
    'stavropol-city': 520,
    pyatigorsk: 590,      // Яндекс Карты: 590 км!
    minvody: 600,
    kislovodsk: 620,
    essentuki: 580,
    georgievsk: 550,
    nevinnomyssk: 480,
    budennovsk: 520,
    // Московская область
    chekhov: 1470,        // Яндекс Карты: 1460-1470 км
    // Чечня
    grozny: 750,
    znamenskoe: 770,      // с. Знаменское Чеченская Республика
    // Дополнительно
    armavir: 400,
    kropotkin: 320,
    tikhoretsk: 250,
    tuapse: 110,
    gelendzhik: 45,
    anapa: 55,
    temryuk: 95,
  },
  
  // ============================================
  // ЧЕХОВ (Московская область)
  // ============================================
  chekhov: {
    moscow: 55,
    spb: 750,
    novorossiysk: 1470,
    krasnodar: 1320,
    rostov: 1100,
    tula: 120,
    kaluga: 140,
  },
  
  // ============================================
  // ЗНАМЕНСКОЕ (Чеченская Республика)
  // ============================================
  znamenskoe: {
    moscow: 1830,
    novorossiysk: 770,
    grozny: 30,
    pyatigorsk: 380,
    minvody: 350,
    krasnodar: 680,
    rostov: 780,
  },
  
  // ============================================
  // ГРОЗНЫЙ (Чеченская Республика)
  // ============================================
  grozny: {
    moscow: 1800,
    novorossiysk: 750,
    znamenskoe: 30,
    pyatigorsk: 380,
    minvody: 350,
    krasnodar: 650,
    rostov: 800,
    makhachkala: 180,
    nalchik: 250,
    vladikavkaz: 150,
  },
  
  // ============================================
  // СТАВРОПОЛЬСКИЙ КРАЙ И КМВ
  // ============================================
  'stavropol-city': {
    moscow: 1450, spb: 2150, rostov: 400, krasnodar: 350, novorossiysk: 520,
    pyatigorsk: 230, minvody: 170, kislovodsk: 220, essentuki: 200,
    georgievsk: 180, nevinnomyssk: 70,
    volgograd: 550, voronezh: 700, astrakhan: 500,
  },
  pyatigorsk: {
    moscow: 1700, spb: 2400, rostov: 500, krasnodar: 450,
    novorossiysk: 590,     // Яндекс Карты: 590 км!
    'stavropol-city': 230,
    minvody: 50,
    kislovodsk: 75,
    essentuki: 30,
    georgievsk: 40,
    volgograd: 650, voronezh: 800, astrakhan: 600,
  },
  minvody: {
    moscow: 1700, spb: 2400, rostov: 520, krasnodar: 470,
    novorossiysk: 600,
    'stavropol-city': 170,
    pyatigorsk: 50,
    kislovodsk: 45,
    essentuki: 25,
    georgievsk: 30,
  },
  kislovodsk: {
    moscow: 1750, spb: 2450,
    novorossiysk: 620,
    'stavropol-city': 220,
    pyatigorsk: 75,
    minvody: 45,
    essentuki: 50,
    georgievsk: 65,
  },
  essentuki: {
    moscow: 1680, spb: 2380,
    novorossiysk: 580,
    'stavropol-city': 200,
    pyatigorsk: 30,
    minvody: 25,
    kislovodsk: 50,
    georgievsk: 35,
  },
  georgievsk: {
    moscow: 1680, spb: 2380,
    novorossiysk: 550,
    'stavropol-city': 180,
    pyatigorsk: 40,
    minvody: 30,
    kislovodsk: 65,
    essentuki: 35,
  },
  
  // ============================================
  // КРАСНОДАР
  // ============================================
  krasnodar: {
    moscow: 1350, spb: 2050, rostov: 290, novorossiysk: 240,
    sochi: 300, 'stavropol-city': 350, pyatigorsk: 450,
    tikhoretsk: 170, armavir: 200, kropotkin: 140,
  },
  
  // ============================================
  // РОСТОВ-НА-ДОНУ
  // ============================================
  rostov: {
    moscow: 1080, spb: 1770, krasnodar: 290, novorossiysk: 530,
    volgograd: 550, voronezh: 580, 'stavropol-city': 400,
    sochi: 520, astrakhan: 500,
  },
  
  // ============================================
  // ПОВОЛЖЬЕ
  // ============================================
  kazan: {
    moscow: 820, spb: 1520, nnovgorod: 400, samara: 350, saratov: 500,
    ufa: 450, perm: 600, penza: 500, ekaterinburg: 820,
  },
  samara: {
    moscow: 1050, spb: 1750, kazan: 350, saratov: 420, ufa: 480,
    penza: 380, ekaterinburg: 1050,
  },
  saratov: {
    moscow: 860, spb: 1560, kazan: 500, samara: 420, volgograd: 400,
    voronezh: 450,
  },
  volgograd: {
    moscow: 960, spb: 1660, rostov: 550, saratov: 400, astrakhan: 450,
    voronezh: 550, 'stavropol-city': 550,
  },
  astrakhan: {
    moscow: 1400, spb: 2100, volgograd: 450, rostov: 500,
  },
  
  // ============================================
  // ЦЕНТРАЛЬНАЯ РОССИЯ
  // ============================================
  voronezh: {
    moscow: 520, spb: 1220, rostov: 580, volgograd: 550,
    belgorod: 250, kursk: 280, lipetsk: 260, saratov: 450,
  },
  belgorod: {
    moscow: 680, spb: 1380, voronezh: 250, kursk: 180, kharkiv: 80,
  },
  kursk: {
    moscow: 540, spb: 1240, voronezh: 280, belgorod: 180, orel: 180,
  },
  lipetsk: {
    moscow: 450, spb: 1150, voronezh: 260, tambov: 180,
  },
  tambov: {
    moscow: 480, spb: 1180, voronezh: 300, lipetsk: 180, penza: 280,
  },
  orel: {
    moscow: 360, spb: 1060, kursk: 180, bryansk: 160, tula: 210,
  },
  bryansk: {
    moscow: 380, spb: 980, minsk: 400, smolensk: 220, orel: 160, tula: 200,
  },
  tula: {
    moscow: 190, spb: 890, novorossiysk: 1350, rostov: 1000, krasnodar: 1280,
    voronezh: 550, bryansk: 200, kaluga: 190, ryazan: 200, orel: 210,
  },
  kaluga: {
    moscow: 190, spb: 890, tula: 110, bryansk: 260, smolensk: 240,
  },
  ryazan: {
    moscow: 200, spb: 900, tula: 180, voronezh: 380, kazan: 620,
  },
  smolensk: {
    moscow: 400, spb: 680, minsk: 350, vitebsk: 150, bryansk: 220, kaluga: 240,
  },
  
  // ============================================
  // МОСКОВСКАЯ ОБЛАСТЬ (города-спутники)
  // ============================================
  chekhov: {
    moscow: 70, spb: 770, podolsk: 25, tula: 120, kaluga: 140,
  },
  podolsk: {
    moscow: 45, spb: 745, chekhov: 25, tula: 150, kaluga: 150,
  },
  khimki: {
    moscow: 30, spb: 680,
  },
  mytishchi: {
    moscow: 25, spb: 675,
  },
  balashiha: {
    moscow: 35, spb: 685,
  },
  korolev: {
    moscow: 30, spb: 680,
  },
  lyubertsy: {
    moscow: 35, spb: 685,
  },
  krasnogorsk: {
    moscow: 25, spb: 675,
  },
  odintsovo: {
    moscow: 40, spb: 690,
  },
  
  // ============================================
  // СЕВЕР
  // ============================================
  arkhangelsk: {
    moscow: 1200, spb: 900, murmansk: 1400, vologda: 700, syktyvkar: 800,
  },
  murmansk: {
    moscow: 1900, spb: 1400, arkhangelsk: 1400, petrozavodsk: 1000,
  },
  petrozavodsk: {
    moscow: 1000, spb: 450, murmansk: 1000,
  },
  syktyvkar: {
    moscow: 1300, spb: 1000, arkhangelsk: 800, vologda: 600,
  },
  vologda: {
    moscow: 500, spb: 550, arkhangelsk: 700, syktyvkar: 600, cherepovets: 120,
  },
  cherepovets: {
    moscow: 450, spb: 480, vologda: 120,
  },
  kaliningrad: {
    moscow: 1250, spb: 1050, minsk: 550, vilnius: 350,
  },
  
  // ============================================
  // УРАЛ
  // ============================================
  ekaterinburg: {
    moscow: 1800, spb: 2500, chelyabinsk: 230, tyumen: 330, perm: 300, ufa: 450,
    kazan: 1000, samara: 1150, novosibirsk: 1550, krasnoyarsk: 2350,
    omsk: 900, kemerovo: 1800, tomsk: 1700, barnaul: 1900,
  },
  chelyabinsk: {
    moscow: 1750, spb: 2450, ekaterinburg: 230, tyumen: 400, ufa: 400, perm: 500,
    kazan: 950, samara: 1100, novosibirsk: 1450, omsk: 800, krasnoyarsk: 2250,
  },
  ufa: {
    moscow: 1350, spb: 2050, ekaterinburg: 450, chelyabinsk: 400, perm: 350,
    kazan: 450, samara: 500, novosibirsk: 1900,
  },
  perm: {
    moscow: 1450, spb: 2150, ekaterinburg: 300, chelyabinsk: 500, ufa: 350,
    kazan: 600, novosibirsk: 1900,
  },
  tyumen: {
    moscow: 2100, spb: 2800, ekaterinburg: 330, chelyabinsk: 400,
    omsk: 600, novosibirsk: 1200,
  },
  
  // ============================================
  // СИБИРЬ
  // ============================================
  novosibirsk: {
    moscow: 3300, spb: 4000, krasnoyarsk: 800, omsk: 650, kemerovo: 270, tomsk: 260,
    barnaul: 230, irkutsk: 1850, ekaterinburg: 1550, chelyabinsk: 1450,
    vladivostok: 5800,
  },
  krasnoyarsk: {
    moscow: 4100, spb: 4800, novosibirsk: 800, irkutsk: 1050, kemerovo: 550, tomsk: 600,
    ekaterinburg: 2350, vladivostok: 5000,
  },
  omsk: {
    moscow: 2700, spb: 3400, novosibirsk: 650, ekaterinburg: 900, chelyabinsk: 800,
  },
  irkutsk: {
    moscow: 5200, spb: 5900, krasnoyarsk: 1050, novosibirsk: 1850, vladivostok: 3900,
    khabarovsk: 3200,
  },
  khabarovsk: {
    moscow: 8500, spb: 9200, vladivostok: 760, irkutsk: 3200, novosibirsk: 5100,
  },
  vladivostok: {
    moscow: 9100, spb: 9800, khabarovsk: 760, novosibirsk: 5800, irkutsk: 3900,
  },
  
  // ============================================
  // БЕЛАРУСЬ
  // ============================================
  minsk: {
    moscow: 700, spb: 800, brest: 350, gomel: 300, vitebsk: 280,
    mogilev: 200, grodno: 270, smolensk: 350, bryansk: 400,
  },
  brest: {
    moscow: 1000, spb: 1050, minsk: 350, grodno: 190, vitebsk: 550,
  },
  gomel: {
    moscow: 550, spb: 950, minsk: 300, mogilev: 170, bryansk: 280,
  },
  vitebsk: {
    moscow: 500, spb: 550, minsk: 280, smolensk: 150, mogilev: 150,
  },
  mogilev: {
    moscow: 600, spb: 800, minsk: 200, gomel: 170, vitebsk: 150,
  },
  grodno: {
    moscow: 900, spb: 900, minsk: 300, brest: 210,
  },
};

// Функция для получения расстояния между двумя городами
export function getDistance(cityFrom: string, cityTo: string): number {
  if (cityFrom === cityTo) return 0;

  // Проверяем прямое направление
  if (DISTANCES[cityFrom]?.[cityTo]) {
    return DISTANCES[cityFrom][cityTo];
  }

  // Проверяем обратное направление
  if (DISTANCES[cityTo]?.[cityFrom]) {
    return DISTANCES[cityTo][cityFrom];
  }

  // Вычисляем через хабы
  const fromCity = CITIES.find(c => c.id === cityFrom);
  const toCity = CITIES.find(c => c.id === cityTo);

  if (!fromCity || !toCity) {
    return 500; // Дефолтное расстояние
  }

  // Через Москву
  const viaMoscow = (DISTANCES[cityFrom]?.moscow || 0) + (DISTANCES[cityTo]?.moscow || 0);
  if (viaMoscow > 0) {
    return Math.round(viaMoscow * 0.9);
  }

  // По регионам
  const regionalDistances: Record<string, Record<string, number>> = {
    'Московская область': { 'Ленинградская область': 700, 'Краснодарский край': 1400, 'Свердловская область': 1800, 'Республика Башкортостан': 1350, 'Беларусь': 700 },
    'Ленинградская область': { 'Московская область': 700, 'Краснодарский край': 2100, 'Беларусь': 800 },
    'Краснодарский край': { 'Московская область': 1400, 'Свердловская область': 2600, 'Ростовская область': 350 },
    'Свердловская область': { 'Московская область': 1800, 'Новосибирская область': 1550, 'Челябинская область': 230 },
    'Беларусь': { 'Московская область': 700, 'Ленинградская область': 800 },
  };

  const estimated = regionalDistances[fromCity.region]?.[toCity.region];
  if (estimated) return estimated;

  const reverse = regionalDistances[toCity.region]?.[fromCity.region];
  if (reverse) return reverse;

  // Если города в одном регионе
  if (fromCity.region === toCity.region) {
    return 150;
  }

  return 800;
}

// Получить информацию о городе
export function getCity(cityId: string): City | undefined {
  return CITIES.find(c => c.id === cityId);
}

// Получить города сгруппированные по регионам
export function getCitiesByRegion(): Record<string, City[]> {
  const result: Record<string, City[]> = {};

  CITIES.forEach(city => {
    if (!result[city.region]) {
      result[city.region] = [];
    }
    result[city.region].push(city);
  });

  // Сортируем города в каждом регионе
  Object.keys(result).forEach(region => {
    result[region].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  });

  return result;
}

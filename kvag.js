// ============================================
// QI-Plan Редактор - Основной файл
// Версия: 1.2 (исправленный, без дублирования)
// ============================================

// Данные зданий
const buildingData = [
  {
    "category": "Жилые",
    "name": "Многоэтажный дом 2x2",
    "display_name": "Мн-эт",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 70,
      "coin_cost": 10000,
      "hammer_cost": 0,
      "chrono_cost": 0,
      "coin_production": 12500,
      "chrono_production": 10,
      "coin_acceleration": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Жилые",
    "name": "Каркасный дом 2x2",
    "display_name": "Карк",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 110,
      "coin_cost": 10000,
      "hammer_cost": 50000,
      "chrono_cost": 200,
      "coin_production": 25000,
      "chrono_production": 75,
      "coin_acceleration": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Жилые",
    "name": "Дом с гонтовой кр. 2x2",
    "display_name": "Гонт",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 150,
      "coin_cost": 210000,
      "hammer_cost": 200000,
      "chrono_cost": 1000,
      "coin_production": 130000,
      "chrono_production": 250,
      "coin_acceleration": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Жилые",
    "name": "Особняк 2x2",
    "display_name": "Особн",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 60,
      "coin_cost": 14000,
      "hammer_cost": 0,
      "chrono_cost": 0,
      "coin_production": 7500,
      "chrono_production": 10,
      "coin_acceleration": 10
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Жилые",
    "name": "Дом из песчаника 2x2",
    "display_name": "Песч",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 90,
      "coin_cost": 42000,
      "hammer_cost": 60000,
      "chrono_cost": 200,
      "coin_production": 15000,
      "chrono_production": 75,
      "coin_acceleration": 10
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Жилые",
    "name": "Городской особняк 2x2",
    "display_name": "Гор-ос",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 130,
      "coin_cost": 294000,
      "hammer_cost": 240000,
      "chrono_cost": 1000,
      "coin_production": 78000,
      "chrono_production": 250,
      "coin_acceleration": 10
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Жилые",
    "name": "Усадьба 2x2",
    "display_name": "Усадьба",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 50,
      "coin_cost": 16000,
      "hammer_cost": 0,
      "chrono_cost": 0,
      "coin_production": 3750,
      "chrono_production": 10,
      "coin_acceleration": 20
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Жилые",
    "name": "Многоквартирный дом 2x2",
    "display_name": "Мн-квар",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 80,
      "coin_cost": 48000,
      "hammer_cost": 70000,
      "chrono_cost": 200,
      "coin_production": 7500,
      "chrono_production": 75,
      "coin_acceleration": 20
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Жилые",
    "name": "Манор 2x2",
    "display_name": "Манор",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 110,
      "coin_cost": 336000,
      "hammer_cost": 280000,
      "chrono_cost": 1000,
      "coin_production": 39000,
      "chrono_production": 250,
      "coin_acceleration": 20
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Молотки",
    "name": "Кожевня 3x3",
    "display_name": "Кожевня",
    "size": "3x3",
    "color": "plum",
    "bonuses": {
      "coin_cost": 12000,
      "hammer_cost": 0,
      "population_cost": 30,
      "chrono_cost": 0,
      "hammer_production": 12000,
      "chrono_production": 10,
      "hammer_acceleration": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Молотки",
    "name": "Обувная мастерская 3x3",
    "display_name": "Обувная",
    "size": "3x3",
    "color": "plum",
    "bonuses": {
      "coin_cost": 36000,
      "hammer_cost": 50000,
      "population_cost": 60,
      "chrono_cost": 200,
      "hammer_production": 24000,
      "chrono_production": 75,
      "hammer_acceleration": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Молотки",
    "name": "Пекарня 4x3",
    "display_name": "Пекарня",
    "size": "4x3",
    "color": "plum",
    "bonuses": {
      "coin_cost": 84000,
      "hammer_cost": 100000,
      "population_cost": 120,
      "chrono_cost": 1000,
      "hammer_production": 60000,
      "chrono_production": 250,
      "hammer_acceleration": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Молотки",
    "name": "Ферма 4x5",
    "display_name": "Ферма",
    "size": "4x5",
    "color": "plum",
    "bonuses": {
      "coin_cost": 16800,
      "hammer_cost": 0,
      "population_cost": 30,
      "chrono_cost": 0,
      "hammer_production": 7200,
      "chrono_production": 10,
      "hammer_acceleration": 10
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Молотки",
    "name": "Лаборатория алхимика 3x2",
    "display_name": "Алхимик",
    "size": "3x2",
    "color": "plum",
    "bonuses": {
      "coin_cost": 50400,
      "hammer_cost": 60000,
      "population_cost": 60,
      "chrono_cost": 200,
      "hammer_production": 14400,
      "chrono_production": 75,
      "hammer_acceleration": 10
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Молотки",
    "name": "Ветряная мельница 3x4",
    "display_name": "Ветряная",
    "size": "3x4",
    "color": "plum",
    "bonuses": {
      "coin_cost": 117600,
      "hammer_cost": 120000,
      "population_cost": 120,
      "chrono_cost": 1000,
      "hammer_production": 36000,
      "chrono_production": 250,
      "hammer_acceleration": 10
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Молотки",
    "name": "Пивоварня 3x3",
    "display_name": "Пивоварня",
    "size": "3x3",
    "color": "plum",
    "bonuses": {
      "coin_cost": 19200,
      "hammer_cost": 0,
      "population_cost": 30,
      "chrono_cost": 0,
      "hammer_production": 4800,
      "chrono_production": 10,
      "hammer_acceleration": 20
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Молотки",
    "name": "Лавка специй 3x3",
    "display_name": "Лавка спец.",
    "size": "3x3",
    "color": "plum",
    "bonuses": {
      "coin_cost": 57600,
      "hammer_cost": 70000,
      "population_cost": 60,
      "chrono_cost": 200,
      "hammer_production": 9600,
      "chrono_production": 75,
      "hammer_acceleration": 20
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Молотки",
    "name": "Бондарня 3x4",
    "display_name": "Бондарня",
    "size": "3x4",
    "color": "plum",
    "bonuses": {
      "coin_cost": 134400,
      "hammer_cost": 140000,
      "population_cost": 120,
      "chrono_cost": 1000,
      "hammer_production": 24000,
      "chrono_production": 250,
      "hammer_acceleration": 20
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Товар",
    "name": "Пасека 3x3",
    "display_name": "Пасека",
    "size": "3x3",
    "color": "pink",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 7500,
      "population_cost": 100,
      "chrono_cost": 200
    },
    "symbol": "●",
    "symbol_color": ""
  },
  {
    "category": "Товар",
    "name": "Медь 4x3",
    "display_name": "Медь",
    "size": "4x3",
    "color": "pink",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 7500,
      "population_cost": 100,
      "chrono_cost": 200
    },
    "symbol": "●",
    "symbol_color": ""
  },
  {
    "category": "Товар",
    "name": "Кирпичный цех 4x3",
    "display_name": "Кирпичный цех",
    "size": "4x3",
    "color": "pink",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 7500,
      "population_cost": 100,
      "chrono_cost": 200
    },
    "symbol": "●",
    "symbol_color": ""
  },
  {
    "category": "Товар",
    "name": "Канатная мастерская 3x2",
    "display_name": "Канатная",
    "size": "3x2",
    "color": "pink",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 7500,
      "population_cost": 100,
      "chrono_cost": 200
    },
    "symbol": "●",
    "symbol_color": ""
  },
  {
    "category": "Товар",
    "name": "Порох 3x3",
    "display_name": "Порох",
    "size": "3x3",
    "color": "pink",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 7500,
      "population_cost": 100,
      "chrono_cost": 200
    },
    "symbol": "●",
    "symbol_color": ""
  },
  {
    "category": "Общест.",
    "name": "Торговая площадь 3x3",
    "display_name": "Торговая пл",
    "size": "3x3",
    "color": "blue",
    "bonuses": {
      "coin_cost": 12000,
      "hammer_cost": 0,
      "chrono_cost": 0,
      "happiness_production": 125,
      "od_production": 0,
      "od_chas": 50
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Общест.",
    "name": "Виселица 2x2",
    "display_name": "Висел.",
    "size": "2x2",
    "color": "blue",
    "bonuses": {
      "coin_cost": 36000,
      "hammer_cost": 36000,
      "chrono_cost": 100,
      "happiness_production": 250,
      "od_production": 0,
      "od_chas": 60
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Общест.",
    "name": "Позорный столб 2x2",
    "display_name": "П. столб",
    "size": "2x2",
    "color": "blue",
    "bonuses": {
      "coin_cost": 120000,
      "hammer_cost": 120000,
      "chrono_cost": 500,
      "happiness_production": 750,
      "od_production": 0,
      "od_chas": 120
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Общест.",
    "name": "Церковь 3x3",
    "display_name": "Церковь",
    "size": "3x3",
    "color": "blue",
    "bonuses": {
      "coin_cost": 16800,
      "hammer_cost": 0,
      "chrono_cost": 0,
      "happiness_production": 160,
      "od_production": 500,
      "od_chas": 50
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Общест.",
    "name": "Типография 3x3",
    "display_name": "Типография",
    "size": "3x3",
    "color": "blue",
    "bonuses": {
      "coin_cost": 50400,
      "hammer_cost": 43200,
      "chrono_cost": 100,
      "happiness_production": 375,
      "od_production": 500,
      "od_chas": 130
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Общест.",
    "name": "Дом лекаря 3x3",
    "display_name": "Дом лекаря",
    "size": "3x3",
    "color": "blue",
    "bonuses": {
      "coin_cost": 168000,
      "hammer_cost": 144000,
      "chrono_cost": 500,
      "happiness_production": 1125,
      "od_production": 1000,
      "od_chas": 260
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Общест.",
    "name": "Дворец 4x4",
    "display_name": "Дворец",
    "size": "4x4",
    "color": "blue",
    "bonuses": {
      "coin_cost": 19200,
      "hammer_cost": 0,
      "chrono_cost": 0,
      "happiness_production": 225,
      "od_production": 1250,
      "od_chas": 90
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Общест.",
    "name": "Библиотека 4x4",
    "display_name": "Библиотека",
    "size": "4x4",
    "color": "blue",
    "bonuses": {
      "coin_cost": 57600,
      "hammer_cost": 50400,
      "chrono_cost": 100,
      "happiness_production": 500,
      "od_production": 2500,
      "od_chas": 200
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Общест.",
    "name": "Дом картографа 3x2",
    "display_name": "Дом картог",
    "size": "3x2",
    "color": "blue",
    "bonuses": {
      "coin_cost": 192000,
      "hammer_cost": 168000,
      "chrono_cost": 500,
      "happiness_production": 900,
      "od_production": 750,
      "od_chas": 180
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Декор",
    "name": "Кипарис 1x1",
    "display_name": "Кип",
    "size": "1x1",
    "color": "blue",
    "bonuses": {
      "coin_cost": 50000,
      "hammer_cost": 50000,
      "chrono_cost": 200,
      "happiness_cost": 25,
      "red_stats": 10,
      "blue_stats": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Декор",
    "name": "Цветочная изгородь 1x1",
    "display_name": "Ц и",
    "size": "1x1",
    "color": "blue",
    "bonuses": {
      "coin_cost": 50000,
      "hammer_cost": 50000,
      "chrono_cost": 200,
      "happiness_cost": 25,
      "red_stats": 0,
      "blue_stats": 10
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Декор",
    "name": "Пруд 2x2",
    "display_name": "Пруд",
    "size": "2x2",
    "color": "blue",
    "bonuses": {
      "coin_cost": 200000,
      "hammer_cost": 200000,
      "chrono_cost": 750,
      "happiness_cost": 75,
      "red_stats": 25,
      "blue_stats": 25
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Декор",
    "name": "Указательный столб 1x1",
    "display_name": "У с",
    "size": "1x1",
    "color": "blue",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 62500,
      "chrono_cost": 200,
      "happiness_cost": 25,
      "red_stats": 15,
      "blue_stats": 0
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Декор",
    "name": "Горгулья 1x1",
    "display_name": "Гор",
    "size": "1x1",
    "color": "blue",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 62500,
      "chrono_cost": 200,
      "happiness_cost": 25,
      "red_stats": 0,
      "blue_stats": 15
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Декор",
    "name": "Флаг 1x1",
    "display_name": "Фла",
    "size": "1x1",
    "color": "blue",
    "bonuses": {
      "coin_cost": 300000,
      "hammer_cost": 250000,
      "chrono_cost": 750,
      "happiness_cost": 75,
      "red_stats": 20,
      "blue_stats": 20
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Декор",
    "name": "Разрушенная башня 2x2",
    "display_name": "Разр. б",
    "size": "2x2",
    "color": "blue",
    "bonuses": {
      "coin_cost": 100000,
      "hammer_cost": 75000,
      "chrono_cost": 200,
      "happiness_cost": 25,
      "red_stats": 45,
      "blue_stats": 0
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Декор",
    "name": "Группа деревьев 2x2",
    "display_name": "Гр. дер",
    "size": "2x2",
    "color": "blue",
    "bonuses": {
      "coin_cost": 100000,
      "hammer_cost": 75000,
      "chrono_cost": 200,
      "happiness_cost": 25,
      "red_stats": 0,
      "blue_stats": 45
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Декор",
    "name": "Морская скульптура 1x1",
    "display_name": "М.с",
    "size": "1x1",
    "color": "blue",
    "bonuses": {
      "coin_cost": 400000,
      "hammer_cost": 300000,
      "chrono_cost": 750,
      "happiness_cost": 75,
      "red_stats": 30,
      "blue_stats": 30
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Воен.",
    "name": "Конный лучник 3x4",
    "display_name": "Конный лучн",
    "size": "3x4",
    "color": "red",
    "bonuses": {
      "coin_cost": 15000,
      "hammer_cost": 7500,
      "chrono_cost": 0,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Воен.",
    "name": "Бронированная пехота 3x3",
    "display_name": "Брон. пех",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 15000,
      "hammer_cost": 7500,
      "chrono_cost": 0,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Воен.",
    "name": "Мастерская катапульт 3x3",
    "display_name": "Катапульта",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 15000,
      "hammer_cost": 7500,
      "chrono_cost": 0,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Воен.",
    "name": "Казармы наёмников 3x3",
    "display_name": "Наёмники",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 15000,
      "hammer_cost": 7500,
      "chrono_cost": 0,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Воен.",
    "name": "Тяжелая кавалерия 3x4",
    "display_name": "Тяж. кавал",
    "size": "3x4",
    "color": "red",
    "bonuses": {
      "coin_cost": 15000,
      "hammer_cost": 7500,
      "chrono_cost": 0,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Воен.",
    "name": "Арбалетчик 3x3",
    "display_name": "Арбалетчик",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 22500,
      "chrono_cost": 200,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Воен.",
    "name": "Тяжёлая пехота 3x3",
    "display_name": "Тяж. пехота",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 22500,
      "chrono_cost": 200,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Воен.",
    "name": "Требушеты 3x3",
    "display_name": "Требушеты",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 22500,
      "chrono_cost": 200,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Воен.",
    "name": "Берсерки 3x3",
    "display_name": "Берсерки",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 22500,
      "chrono_cost": 200,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Воен.",
    "name": "Конюшня рыцарей 3x4",
    "display_name": "Конюшня рыц.",
    "size": "3x4",
    "color": "red",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 22500,
      "chrono_cost": 200,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Воен.",
    "name": "Длиннолучник 3x3",
    "display_name": "Дл-лучник",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 37500,
      "chrono_cost": 1000,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Воен.",
    "name": "Королевский стражник 3x4",
    "display_name": "Кор. страж",
    "size": "3x4",
    "color": "red",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 37500,
      "chrono_cost": 1000,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Воен.",
    "name": "Пушка 3x4",
    "display_name": "Пушка",
    "size": "3x4",
    "color": "red",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 37500,
      "chrono_cost": 1000,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Воен.",
    "name": "Двуручный меч 3x3",
    "display_name": "Двуруч. меч",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 37500,
      "chrono_cost": 1000,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Воен.",
    "name": "Конюшня тяж рыцаря 4x4",
    "display_name": "Конюшня тяж рыц",
    "size": "4x4",
    "color": "red",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 37500,
      "chrono_cost": 1000,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Расширения",
    "name": "Расш",
    "display_name": "Расш",
    "size": "4x4",
    "color": "white",
    "bonuses": {},
    "symbol": "",
    "symbol_color": ""
  },
  {
    "category": "Системные",
    "name": "Ратуша",
    "display_name": "Ратуша",
    "size": "7x6",
    "color": "yellow",
    "bonuses": {
      "coin_production": 50000,
      "chrono_production": 15,
      "hammer_production": 50000
    },
    "symbol": "",
    "symbol_color": ""
  }
];

const bonusTranslations = {
  population: 'Население',
  coin_cost: 'Затр. монет',
  hammer_cost: 'Затр. молотков',
  chrono_cost: 'Затр. хроно',
  coin_production: 'Произв. монет',
  chrono_production: 'Произв. хроно',
  coin_acceleration: 'Ускор. монет',
  hammer_production: 'Произв. молотков',
  hammer_acceleration: 'Ускор. молотков',
  population_cost: 'Затр. населения',
  happiness_production: 'Произв. счастья',
  happiness_cost: 'Затр. счастья',
  od_production: 'Ёмкость КД',
  blue_stats: 'Син. статы',
  red_stats: 'Красн. статы',
  od_chas: 'Пр-во ОД/ 1 ч.'
};

// Глобальные переменные
const grid = document.getElementById('grid');
const tabContentContainer = document.getElementById('tab-content-container');
const tooltip = document.getElementById('tooltip');
const totalCells = 28 * 28;
const areas = [
  { colStart: 1, colEnd: 4, rowStart: 1, rowEnd: 16, color: '#ccc' },
  { colStart: 5, colEnd: 8, rowStart: 1, rowEnd: 4, color: '#ccc' },
  { colStart: 25, colEnd: 28, rowStart: 1, rowEnd: 4, color: '#ccc' },
  { colStart: 25, colEnd: 28, rowStart: 21, rowEnd: 28, color: '#ccc' }
];

let deleteMode = false;
let whiteCellsCount = 192;
let initialCellStates = new Array(totalCells).fill('');
let townHallBonuses = {
  od: 0,
  coin_acceleration: 0,
  hammer_acceleration: 0,
  coin_initial: 0,
  hammer_initial: 0,
  kd_capacity: 200000
};
let hideModeActive = false;
let selectedBuilding = null;
let selectedLiElement = null;
let ghostFigure = null;
let clearedCellsHistory = [];
let clickTimer = null;

// ============================================
// ОБРАБОТЧИК ДВОЙНОГО КЛИКА
// ============================================
function handleFigureClick(figure, e) {
    // Принудительно останавливаем распространение события в режиме удаления
    if (deleteMode) {
        e.stopPropagation();  // Останавливаем всплытие
        return;  // Выходим, не обрабатывая клик
    }
    
    if (figure.dataset.name === 'Ратуша') {
        tooltip.textContent = 'Ратуша';
        tooltip.style.display = 'block';
        tooltip.style.left = `${e.clientX + 15}px`;
        tooltip.style.top = `${e.clientY + 15}px`;
        return;
    }
    
    if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
        showBuildingInfo(figure);
    } else {
        clickTimer = setTimeout(() => {
            clickTimer = null;
        }, 300);
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ СЕТКИ
// ============================================
function initGrid() {
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const row = Math.floor(i / 28) + 1;
    const col = (i % 28) + 1;
    cell.style.backgroundColor = '#fff';
    
    let isGray = false;
    areas.forEach(area => {
      if (col >= area.colStart && col <= area.colEnd && row >= area.rowStart && row <= area.rowEnd) {
        cell.style.backgroundColor = area.color;
        isGray = true;
      }
    });
    
    if (!isGray && !(
      (row >= 9 && row <= 20 && col >= 9 && col <= 20) ||
      (row >= 21 && row <= 24 && col >= 9 && col <= 20) ||
      (row >= 5 && row <= 8 && col >= 9 && col <= 24) ||
      (row >= 9 && row <= 16 && col >= 21 && col <= 24)
    ) || (row >= 17 && row <= 24 && col >= 9 && col <= 20)) {
      cell.textContent = 'X';
      initialCellStates[i] = 'X';
    }
    
    if (row >= 21 && row <= 28 && col >= 1 && col <= 8 && !isGray) {
      cell.textContent = 'X';
      initialCellStates[i] = 'X';
    }
    
    grid.appendChild(cell);
  }
}

// ============================================
// СОЗДАНИЕ РАТУШИ
// ============================================
function createTownHall() {
  const townHall = document.createElement('div');
  townHall.classList.add('figure', 'townhall');
  townHall.style.width = `${7 * 30}px`;
  townHall.style.height = `${6 * 30}px`;
  townHall.style.left = `${(18 - 1) * 30}px`;
  townHall.style.top = `${(5 - 1) * 30}px`;
  townHall.dataset.name = 'Ратуша';
  townHall.style.color = 'black';
  
  const text = document.createElement('div');
  const maxChars = Math.floor((6 * 30) / 8);
  text.textContent = 'Ратуша'.substring(0, maxChars);
  townHall.appendChild(text);
  
  townHall.addEventListener('click', (e) => {
    e.stopPropagation();
    handleFigureClick(townHall, e);
  });
  
  townHall.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
  
  grid.appendChild(townHall);
  addDragHandlers(townHall);
  return townHall;
}

// ============================================
// СОЗДАНИЕ МЕНЮ С ЗДАНИЯМИ
// ============================================
function createMenu() {
  const categories = [...new Set(buildingData.map(b => b.category))];
  
  categories.forEach((category, index) => {
    const tabContent = document.createElement('div');
    tabContent.id = `tab${index + 1}`;
    tabContent.classList.add('tab-content');
    if (index === 0) tabContent.classList.add('active');
    
    const ul = document.createElement('ul');
    ul.classList.add('building-list');
    
    buildingData.filter(b => b.category === category).forEach(building => {
      const li = document.createElement('li');
      const symbol = building.symbol || '';
      const symbol_color = building.symbol_color || '';
      
      li.innerHTML = `<span class="symbol ${symbol_color}">${symbol}</span><span class="name-size">${building.name}</span>`;
      
      li.onclick = (e) => {
        e.stopPropagation();
        
        if (selectedBuilding === building) {
          selectedBuilding = null;
          if (selectedLiElement) {
            selectedLiElement.classList.remove('active');
            selectedLiElement = null;
          }
          if (ghostFigure) {
            ghostFigure.remove();
            ghostFigure = null;
          }
          grid.removeEventListener('mousemove', handleGhostMove);
        } else {
          if (selectedLiElement) {
            selectedLiElement.classList.remove('active');
          }
          if (ghostFigure) {
            ghostFigure.remove();
            ghostFigure = null;
          }
          grid.removeEventListener('mousemove', handleGhostMove);
          
          selectedBuilding = building;
          selectedLiElement = li;
          li.classList.add('active');
          createGhostFigure();
          grid.addEventListener('mousemove', handleGhostMove);
        }
      };
      
      if (building.name !== 'Расш') {
        const submenu = document.createElement('div');
        submenu.classList.add('submenu');
        let bonusesHtml = '';
        for (let key in building.bonuses) {
          const translatedKey = bonusTranslations[key] || key;
          bonusesHtml += `<div>${translatedKey}: ${building.bonuses[key]}</div>`;
        }
        submenu.innerHTML = bonusesHtml;
        li.appendChild(submenu);
      }
      
      ul.appendChild(li);
    });
    
    if (category === "Расширения") {
      const li = document.createElement('li');
      li.innerHTML = `<span class="symbol"></span><span class="name-size">Все расш.</span>`;
      li.onclick = clearAllXCells;
      ul.appendChild(li);
    }
    
    tabContent.appendChild(ul);
    tabContentContainer.appendChild(tabContent);
  });
}

// ============================================
// ПРИЗРАЧНАЯ ФИГУРА
// ============================================
function createGhostFigure() {
  if (!selectedBuilding || ghostFigure) return;
  
  const [widthCells, heightCells] = selectedBuilding.size.split('x').map(Number);
  ghostFigure = document.createElement('div');
  ghostFigure.classList.add('ghost-figure');
  
  let baseColor = '';
  switch(selectedBuilding.category) {
    case "Жилые": baseColor = 'yellow'; break;
    case "Молотки": baseColor = 'brown'; break;
    case "Товар": baseColor = 'plum'; break;
    case "Общест.": baseColor = 'pink'; break;
    case "Декор": baseColor = 'lightblue'; break;
    case "Воен.": baseColor = 'blue'; break;
    case "Расширения": baseColor = 'white'; break;
    default: baseColor = 'yellow';
  }
  
  const symbolColor = selectedBuilding.symbol_color || 'yellow';
  let ghostColor = '';
  if (symbolColor === 'yellow') {
    ghostColor = baseColor + '-light';
  } else if (symbolColor === 'green') {
    ghostColor = baseColor + '-medium';
  } else if (symbolColor === 'red') {
    ghostColor = baseColor + '-dark';
  } else {
    ghostColor = baseColor + '-light';
  }
  
  ghostFigure.classList.add(ghostColor);
  ghostFigure.style.width = `${widthCells * 30}px`;
  ghostFigure.style.height = `${heightCells * 30}px`;
  ghostFigure.style.opacity = '0.5';
  
  const text = document.createElement('div');
  const maxChars = Math.floor((widthCells * 30) / 8);
  const displayName = selectedBuilding.display_name || selectedBuilding.name;
  text.textContent = displayName.substring(0, maxChars);
  ghostFigure.appendChild(text);
  
  grid.appendChild(ghostFigure);
}

function handleGhostMove(e) {
  if (!ghostFigure || !selectedBuilding) return;
  
  const rect = grid.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const col = Math.floor(x / 30);
  const row = Math.floor(y / 30);
  
  if (col < 0 || col >= 28 || row < 0 || row >= 28) {
    ghostFigure.style.display = 'none';
    return;
  }
  
  ghostFigure.style.display = 'flex';
  
  const [widthCells, heightCells] = selectedBuilding.size.split('x').map(Number);
  if (col + widthCells > 28 || row + heightCells > 28) {
    ghostFigure.style.opacity = '0.2';
    return;
  } else {
    ghostFigure.style.opacity = '0.5';
  }
  
  ghostFigure.style.left = `${col * 30}px`;
  ghostFigure.style.top = `${row * 30}px`;
}

// ============================================
// СОЗДАНИЕ ФИГУРЫ
// ============================================
function createFigure(name, widthPx, heightPx, left, top, isLoad = false) {
  if (name === 'Расш') {
    const figure = document.createElement('div');
    figure.classList.add('figure', 'white-light');
    figure.style.width = `${widthPx}px`;
    figure.style.height = `${heightPx}px`;
    figure.style.left = `${left}px`;
    figure.style.top = `${top}px`;
    figure.dataset.name = 'Расш';
    figure.style.color = 'black';
    
    const text = document.createElement('div');
    const maxChars = Math.floor((widthPx / 30) * 30 / 8);
    text.textContent = 'Расш'.substring(0, maxChars);
    figure.appendChild(text);
    
    figure.addEventListener('click', (e) => {
      e.stopPropagation();
      handleFigureClick(figure, e);
    });
    
    figure.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
    
    grid.appendChild(figure);
    addDragHandlers(figure);
    calculateBonuses();
    return figure;
  }
  
  const selectedBuildingData = buildingData.find(building => building.name === name);
  if (!selectedBuildingData) {
    console.error(`Здание с именем "${name}" не найдено в buildingData`);
    return;
  }
  
  const [heightCells, widthCells] = selectedBuildingData.size.split('x').map(Number);
  const finalName = selectedBuildingData.name;
  const finalWidthPx = widthPx || widthCells * 30;
  const finalHeightPx = heightPx || heightCells * 30;
  const finalLeft = left !== undefined ? left : 30;
  const finalTop = top !== undefined ? top : 30;
  
  let baseColor = '';
  let categoryPrefix = '';
  switch(selectedBuildingData.category) {
    case "Жилые": baseColor = 'yellow'; categoryPrefix = 'yellow'; break;
    case "Молотки": baseColor = 'brown'; categoryPrefix = 'brown'; break;
    case "Товар": baseColor = 'plum'; categoryPrefix = 'plum'; break;
    case "Общест.": baseColor = 'blue'; categoryPrefix = 'pink'; break;
    case "Декор": baseColor = 'lightblue'; categoryPrefix = 'lightblue'; break;
    case "Воен.": baseColor = 'red'; categoryPrefix = 'blue'; break;
    case "Расширения": baseColor = 'white'; categoryPrefix = 'white'; break;
    default: baseColor = selectedBuildingData.color || 'yellow'; categoryPrefix = 'yellow';
  }
  
  const symbolColor = selectedBuildingData.symbol_color || 'yellow';
  let colorClass = '';
  if (symbolColor === 'yellow') {
    colorClass = categoryPrefix + '-light';
  } else if (symbolColor === 'green') {
    colorClass = categoryPrefix + '-medium';
  } else if (symbolColor === 'red') {
    colorClass = categoryPrefix + '-dark';
  } else {
    colorClass = categoryPrefix + '-light';
  }
  
  const figure = document.createElement('div');
  figure.classList.add('figure', colorClass);
  figure.style.width = `${finalWidthPx}px`;
  figure.style.height = `${finalHeightPx}px`;
  figure.style.left = `${finalLeft}px`;
  figure.style.top = `${finalTop}px`;
  figure.dataset.name = finalName;
  
  const text = document.createElement('div');
  const maxChars = Math.floor((finalWidthPx / 30) * 30 / 8);
  const displayName = selectedBuildingData.display_name || finalName;
  text.textContent = displayName.substring(0, maxChars);
  figure.appendChild(text);
  
  figure.addEventListener('click', (e) => {
    e.stopPropagation();
    handleFigureClick(figure, e);
  });
  
  figure.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
  
  if (['Ратуша', 'Многоэтажный дом', 'Каркасный дом', 'Дом с гонтовой кр.', 'Особняк', 'Дом из песчаника', 'Городской особняк', 'Усадьба', 'Многоквартирный дом', 'Манор'].includes(finalName)) {
    figure.style.color = 'black';
  }
  
  grid.appendChild(figure);
  addDragHandlers(figure);
  
  if (!isLoad && finalName === 'Расш') {
    const isOverGray = isInGrayArea(finalLeft, finalTop, widthCells, heightCells);
    if (!isOverGray) {
      clearXUnderFigure(figure);
      figure.remove();
      whiteCellsCount = countWhiteCells();
      for (let y = finalTop / 30; y < finalTop / 30 + heightCells; y++) {
        for (let x = finalLeft / 30; x < finalLeft / 30 + widthCells; x++) {
          const cellIndex = y * 28 + x;
          if (cellIndex >= 0 && cellIndex < totalCells && !isInGrayArea(x * 30, y * 30, 1, 1)) {
            initialCellStates[cellIndex] = '';
          }
        }
      }
    }
  }
  
  calculateBonuses();
  return figure;
}

// ============================================
// ПЕРЕТАСКИВАНИЕ ФИГУР
// ============================================
function addDragHandlers(figure) {
  let isDragging = false;
  let offsetX, offsetY;
  
  function handleStart(clientX, clientY) {
    isDragging = true;
    offsetX = clientX - figure.offsetLeft;
    offsetY = clientY - figure.offsetTop;
    figure.style.cursor = 'grabbing';
    figure.style.zIndex = '20';
  }
  
  function handleMove(clientX, clientY) {
    if (!isDragging) return;
    const newX = clientX - offsetX;
    const newY = clientY - offsetY;
    figure.style.left = `${newX}px`;
    figure.style.top = `${newY}px`;
    checkOverlap();
  }
  
  function handleEnd() {
    if (!isDragging) return;
    
    const gridRect = grid.getBoundingClientRect();
    const figureRect = figure.getBoundingClientRect();
    const isOutsideGrid = (
      figureRect.right < gridRect.left ||
      figureRect.left > gridRect.right ||
      figureRect.bottom < gridRect.top ||
      figureRect.top > gridRect.bottom
    );
    
    if (isOutsideGrid && figure.dataset.name !== 'Ратуша') {
      if (figure.dataset.blinkInterval) {
        clearInterval(figure.dataset.blinkInterval);
      }
      figure.remove();
      calculateBonuses();
      isDragging = false;
      return;
    }
    
    const snappedX = Math.round(figure.offsetLeft / 30) * 30;
    const snappedY = Math.round(figure.offsetTop / 30) * 30;
    figure.style.left = `${snappedX}px`;
    figure.style.top = `${snappedY}px`;
    figure.style.zIndex = '10';
    checkOverlap();
    
    if (figure.dataset.name === 'Расш') {
      const left = parseInt(figure.style.left) / 30;
      const top = parseInt(figure.style.top) / 30;
      const width = parseInt(figure.style.width) / 30;
      const height = parseInt(figure.style.height) / 30;
      const isOverGray = isInGrayArea(left * 30, top * 30, width, height);
      if (!isOverGray) {
        clearXUnderFigure(figure);
        figure.remove();
        whiteCellsCount = countWhiteCells();
        for (let y = top; y < top + height; y++) {
          for (let x = left; x < left + width; x++) {
            const cellIndex = y * 28 + x;
            if (cellIndex >= 0 && cellIndex < totalCells && !isInGrayArea(x * 30, y * 30, 1, 1)) {
              initialCellStates[cellIndex] = '';
            }
          }
        }
      }
    }
    
    calculateBonuses();
    isDragging = false;
    figure.style.cursor = 'grab';
  }
  
  function checkOverlap() {
    const figures = document.querySelectorAll('.figure');
    figures.forEach(fig => {
      const rect1 = fig.getBoundingClientRect();
      const left = parseInt(fig.style.left);
      const top = parseInt(fig.style.top);
      const width = parseInt(fig.style.width) / 30;
      const height = parseInt(fig.style.height) / 30;
      let blinkInterval = fig.dataset.blinkInterval;
      let hasOverlap = false;
      let hasXOverlap = false;
      let isInGray = isInGrayArea(left, top, width, height);
      
      figures.forEach(otherFig => {
        if (otherFig !== fig) {
          const rect2 = otherFig.getBoundingClientRect();
          const innerRect1 = {
            left: rect1.left + 1,
            right: rect1.right - 1,
            top: rect1.top + 1,
            bottom: rect1.bottom - 1
          };
          const innerRect2 = {
            left: rect2.left + 1,
            right: rect2.right - 1,
            top: rect2.top + 1,
            bottom: rect2.bottom - 1
          };
          if (!(innerRect1.right <= innerRect2.left || innerRect1.left >= innerRect2.right ||
                innerRect1.bottom <= innerRect2.top || innerRect1.top >= innerRect2.bottom)) {
            const overlapX = Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left);
            const overlapY = Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top);
            const overlapCells = Math.ceil(overlapX / 30) * Math.ceil(overlapY / 30);
            if (overlapCells >= 1 && !isInGrayArea(left, top, width, height) &&
                !isInGrayArea(parseInt(otherFig.style.left), parseInt(otherFig.style.top),
                parseInt(otherFig.style.width) / 30, parseInt(otherFig.style.height) / 30)) {
              hasOverlap = true;
            }
          }
        }
      });
      
      for (let y = top / 30; y < top / 30 + height; y++) {
        for (let x = left / 30; x < left / 30 + width; x++) {
          const cellIndex = y * 28 + x;
          if (cellIndex >= 0 && cellIndex < totalCells) {
            const cell = grid.children[cellIndex];
            if (cell && cell.textContent === 'X' && !isInGrayArea(left, top, width, height)) {
              hasXOverlap = true;
              break;
            }
          }
        }
        if (hasXOverlap) break;
      }
      
      if (hasOverlap || hasXOverlap || isInGray) {
        if (!blinkInterval) {
          let isVisible = true;
          blinkInterval = setInterval(() => {
            fig.style.opacity = isVisible ? '0.3' : '1';
            isVisible = !isVisible;
          }, 500);
          fig.dataset.blinkInterval = blinkInterval;
        }
      } else if (blinkInterval) {
        clearInterval(blinkInterval);
        fig.style.opacity = '1';
        delete fig.dataset.blinkInterval;
      }
    });
  }
  
  figure.addEventListener('mousedown', (e) => {
    handleStart(e.clientX, e.clientY);
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
  document.addEventListener('mouseup', handleEnd);
  
  figure.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
    e.preventDefault();
  });
  
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
      e.preventDefault();
    }
  });
  
  document.addEventListener('touchend', handleEnd);
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================
function isInGrayArea(x, y, width, height) {
  const colStart = Math.max(1, Math.floor(x / 30) + 1);
  const rowStart = Math.max(1, Math.floor(y / 30) + 1);
  const colEnd = Math.min(28, colStart + width - 1);
  const rowEnd = Math.min(28, rowStart + height - 1);
  
  for (let area of areas) {
    if (colEnd >= area.colStart && colStart <= area.colEnd && rowEnd >= area.rowStart && rowStart <= area.rowEnd) {
      return true;
    }
  }
  return false;
}

function countWhiteCells() {
  let count = 0;
  for (let i = 0; i < totalCells; i++) {
    const cell = grid.children[i];
    const row = Math.floor(i / 28) + 1;
    const col = (i % 28) + 1;
    
    let isGray = false;
    areas.forEach(area => {
      if (col >= area.colStart && col <= area.colEnd && row >= area.rowStart && row <= area.rowEnd) {
        isGray = true;
      }
    });
    
    if (!isGray && cell && cell.textContent !== 'X') {
      count++;
    }
  }
  return count;
}

function clearXUnderFigure(figure) {
  if (figure.dataset.name !== 'Расш') return;
  
  const left = parseInt(figure.style.left) / 30;
  const top = parseInt(figure.style.top) / 30;
  const width = parseInt(figure.style.width) / 30;
  const height = parseInt(figure.style.height) / 30;
  
  const clearedCells = [];
  for (let y = top; y < top + height; y++) {
    for (let x = left; x < left + width; x++) {
      const cellIndex = y * 28 + x;
      if (cellIndex >= 0 && cellIndex < totalCells && !isInGrayArea(x * 30, y * 30, 1, 1)) {
        const cell = grid.children[cellIndex];
        if (cell && cell.textContent === 'X') {
          clearedCells.push({index: cellIndex, x: x, y: y});
        }
      }
    }
  }
  
  for (let y = top; y < top + height; y++) {
    for (let x = left; x < left + width; x++) {
      const cellIndex = y * 28 + x;
      if (cellIndex >= 0 && cellIndex < totalCells && !isInGrayArea(x * 30, y * 30, 1, 1)) {
        const cell = grid.children[cellIndex];
        if (cell) cell.textContent = '';
      }
    }
  }
  
  if (clearedCells.length > 0) {
    clearedCellsHistory.push({
      left: left,
      top: top,
      width: width,
      height: height,
      cells: clearedCells
    });
  }
  
  calculateBonuses();
}

function clearAllXCells() {
  for (let i = 0; i < totalCells; i++) {
    const cell = grid.children[i];
    const row = Math.floor(i / 28) + 1;
    const col = (i % 28) + 1;
    let isGray = false;
    areas.forEach(area => {
      if (col >= area.colStart && col <= area.colEnd && row >= area.rowStart && row <= area.rowEnd) {
        isGray = true;
      }
    });
    if (!isGray && cell && !cell.classList.contains('road') && !cell.classList.contains('boundary')) {
      cell.textContent = '';
      initialCellStates[i] = '';
    }
  }
  whiteCellsCount = countWhiteCells();
  calculateBonuses();
}

function restoreExpansionZones() {
  let restoredCount = 0;
  
  clearedCellsHistory.forEach(item => {
    item.cells.forEach(cellInfo => {
      const cell = grid.children[cellInfo.index];
      if (cell && cell.textContent === '') {
        cell.textContent = 'X';
        initialCellStates[cellInfo.index] = 'X';
        restoredCount++;
      }
    });
  });
  
  document.querySelectorAll('.figure[data-name="Расш"]').forEach(fig => {
    if (fig.dataset.blinkInterval) clearInterval(fig.dataset.blinkInterval);
    fig.remove();
  });
  
  clearedCellsHistory = [];
  calculateBonuses();
  return restoredCount;
}

// ============================================
// РАСЧЁТ БОНУСОВ
// ============================================
function calculateGlobalStatsWithValues(housingPopulation, totalHappiness, coinAcceleration, hammerAcceleration) {
  let happinessPercent = 0;
  let happinessCoef;
  
  if (housingPopulation > 0) {
    happinessPercent = (totalHappiness / housingPopulation) * 100;
    
    if (happinessPercent < 21) {
      happinessCoef = 0.2;
    } else if (happinessPercent < 61) {
      happinessCoef = 0.6;
    } else if (happinessPercent < 81) {
      happinessCoef = 0.8;
    } else if (happinessPercent < 121) {
      happinessCoef = 1.0;
    } else if (happinessPercent < 141) {
      happinessCoef = 1.1;
    } else if (happinessPercent < 200) {
      happinessCoef = 1.2;
    } else {
      happinessCoef = 1.5;
    }
  } else {
    happinessPercent = 100;
    happinessCoef = 1.0;
  }
  
  return {
    housingPopulation,
    totalHappiness,
    happinessPercent,
    happinessCoef,
    coin_acceleration: coinAcceleration,
    hammer_acceleration: hammerAcceleration
  };
}

function calculateBonuses() {
  const stats = {
    population: 0,
    housingPopulation: 0,
    coins: 0,
    hammers: 0,
    chrono: 0,
    happiness: 0,
    od: 0,
    blue: 0,
    red: 0,
    coin_acceleration: Number(townHallBonuses.coin_acceleration) || 0,
    hammer_acceleration: Number(townHallBonuses.hammer_acceleration) || 0,
    coin_cost: 0,
    hammer_cost: 0,
    chrono_cost: 0,
    kd_capacity: Number(townHallBonuses.kd_capacity) || 200000
  };
  
  stats.coin_cost += Number(townHallBonuses.coin_initial) || 0;
  stats.hammer_cost += Number(townHallBonuses.hammer_initial) || 0;
  stats.od += Number(townHallBonuses.od) || 0;
  
  document.querySelectorAll('.figure').forEach(figure => {
    const left = parseInt(figure.style.left);
    const top = parseInt(figure.style.top);
    const width = parseInt(figure.style.width) / 30;
    const height = parseInt(figure.style.height) / 30;
    
    if (isInGrayArea(left, top, width, height)) return;
    
    const building = buildingData.find(b => b.name === figure.dataset.name);
    if (!building) return;
    if (building.name === 'Ратуша') return;
    
    if (building.category === "Жилые") {
      const pop = Number(building.bonuses.population) || 0;
      stats.housingPopulation += pop;
      stats.population += pop;
    }
    
    if (building.bonuses.population_cost) {
      stats.population -= Number(building.bonuses.population_cost);
    }
    
    stats.happiness += (Number(building.bonuses.happiness_production) || 0);
    stats.happiness -= (Number(building.bonuses.happiness_cost) || 0);
    
    stats.coin_acceleration += Number(building.bonuses.coin_acceleration) || 0;
    stats.hammer_acceleration += Number(building.bonuses.hammer_acceleration) || 0;
    
    stats.kd_capacity += Number(building.bonuses.od_production) || 0;
    stats.od += Number(building.bonuses.od_chas) || 0;
    
    stats.blue += Number(building.bonuses.blue_stats) || 0;
    stats.red += Number(building.bonuses.red_stats) || 0;
    
    stats.coin_cost -= Number(building.bonuses.coin_cost) || 0;
    stats.hammer_cost -= Number(building.bonuses.hammer_cost) || 0;
    stats.chrono_cost -= Number(building.bonuses.chrono_cost) || 0;
  });
  
  const globalStats = calculateGlobalStatsWithValues(
    stats.housingPopulation,
    stats.happiness,
    stats.coin_acceleration,
    stats.hammer_acceleration
  );
  
  document.querySelectorAll('.figure').forEach(figure => {
    const left = parseInt(figure.style.left);
    const top = parseInt(figure.style.top);
    const width = parseInt(figure.style.width) / 30;
    const height = parseInt(figure.style.height) / 30;
    
    if (isInGrayArea(left, top, width, height)) return;
    
    const building = buildingData.find(b => b.name === figure.dataset.name);
    if (!building) return;
    if (building.name === 'Ратуша') return;
    
    for (let key in building.bonuses) {
      const baseValue = building.bonuses[key];
      
      if (key === 'coin_production') {
        const value = baseValue * (globalStats.happinessCoef + globalStats.coin_acceleration / 100);
        stats.coins += value;
      } else if (key === 'hammer_production') {
        const value = baseValue * (globalStats.happinessCoef + globalStats.hammer_acceleration / 100);
        stats.hammers += value;
      } else if (key === 'chrono_production') {
        const value = baseValue * globalStats.happinessCoef;
        stats.chrono += value;
      }
    }
  });
  
  const townHallFigure = document.querySelector('.figure[data-name="Ратуша"]');
  if (townHallFigure) {
    const thLeft = parseInt(townHallFigure.style.left);
    const thTop = parseInt(townHallFigure.style.top);
    const thWidth = parseInt(townHallFigure.style.width) / 30;
    const thHeight = parseInt(townHallFigure.style.height) / 30;
    
    if (!isInGrayArea(thLeft, thTop, thWidth, thHeight)) {
      const townhallData = buildingData.find(b => b.name === 'Ратуша');
      if (townhallData) {
        stats.coins += Number(townhallData.bonuses.coin_production) || 0;
        stats.hammers += Number(townhallData.bonuses.hammer_production) || 0;
        stats.chrono += Number(townhallData.bonuses.chrono_production) || 0;
      }
    }
  }
  
  displayStats(stats, globalStats);
}

function displayStats(stats, globalStats) {
  const statElements = {
    population: document.getElementById('stat-population'),
    coins: document.getElementById('stat-coins'),
    hammers: document.getElementById('stat-hammers'),
    chrono: document.getElementById('stat-chrono'),
    happiness: document.getElementById('stat-happiness'),
    od: document.getElementById('stat-od'),
    blue: document.getElementById('stat-blue'),
    red: document.getElementById('stat-red'),
    coin_acceleration: document.getElementById('stat-coin-acceleration'),
    hammer_acceleration: document.getElementById('stat-hammer-acceleration'),
    happiness_coef: document.getElementById('stat-happiness-coef'),
    coin_cost: document.getElementById('stat-coin-cost'),
    hammer_cost: document.getElementById('stat-hammer-cost'),
    chrono_cost: document.getElementById('stat-chrono-cost'),
    kd_capacity: document.getElementById('stat-kd-capacity')
  };
  
  for (let [key, element] of Object.entries(statElements)) {
    if (!element) continue;
    
    if (key === 'population') {
      const total = Math.round(stats.population).toLocaleString('ru-RU');
      const housing = Math.round(stats.housingPopulation).toLocaleString('ru-RU');
      element.textContent = `${housing}/${total}`;
    } else if (key === 'happiness') {
      const happinessValue = Math.round(stats.happiness).toLocaleString('ru-RU');
      element.textContent = `${happinessValue} (${Math.round(globalStats.happinessPercent)}%)`;
    } else if (key === 'happiness_coef') {
      element.textContent = Math.round(globalStats.happinessCoef * 100).toLocaleString('ru-RU');
    } else {
      const value = Math.round(stats[key]).toLocaleString('ru-RU');
      element.textContent = value;
    }
  }
}

// ============================================
// ИНФОРМАЦИЯ О ЗДАНИИ
// ============================================
function showBuildingInfo(figure) {
  const buildingName = figure.dataset.name;
  const building = buildingData.find(b => b.name === buildingName);
  if (!building) return;
  
  let housingPop = 0, totalHappiness = 0, coinAcc = 0, hammerAcc = 0;
  document.querySelectorAll('.figure').forEach(f => {
    const left = parseInt(f.style.left);
    const top = parseInt(f.style.top);
    const width = parseInt(f.style.width) / 30;
    const height = parseInt(f.style.height) / 30;
    if (isInGrayArea(left, top, width, height)) return;
    const b = buildingData.find(bd => bd.name === f.dataset.name);
    if (b && b.name !== 'Ратуша') {
      if (b.category === "Жилые") housingPop += Number(b.bonuses.population) || 0;
      totalHappiness += (Number(b.bonuses.happiness_production) || 0) - (Number(b.bonuses.happiness_cost) || 0);
      coinAcc += Number(b.bonuses.coin_acceleration) || 0;
      hammerAcc += Number(b.bonuses.hammer_acceleration) || 0;
    }
  });
  const realGlobalStats = calculateGlobalStatsWithValues(housingPop, totalHappiness, coinAcc, hammerAcc);
  
  let content = `<h3 style="margin:0 0 15px 0; text-align:center;">${buildingName}</h3>`;
  content += `<table class="building-info-table">`;
  
  for (let key in building.bonuses) {
    const baseValue = building.bonuses[key];
    const translatedKey = bonusTranslations[key] || key;
    let finalValue = baseValue;
    let showCalculation = false;
    let calculationText = '';
    
    if (key === 'coin_production') {
      finalValue = baseValue * (realGlobalStats.happinessCoef + realGlobalStats.coin_acceleration / 100);
      showCalculation = true;
      calculationText = `${baseValue} × (${realGlobalStats.happinessCoef.toFixed(2)} + ${realGlobalStats.coin_acceleration}%)`;
    } else if (key === 'hammer_production') {
      finalValue = baseValue * (realGlobalStats.happinessCoef + realGlobalStats.hammer_acceleration / 100);
      showCalculation = true;
      calculationText = `${baseValue} × (${realGlobalStats.happinessCoef.toFixed(2)} + ${realGlobalStats.hammer_acceleration}%)`;
    } else if (key === 'chrono_production') {
      finalValue = baseValue * realGlobalStats.happinessCoef;
      showCalculation = true;
      calculationText = `${baseValue} × ${realGlobalStats.happinessCoef.toFixed(2)}`;
    }
    
    let displayValue = '';
    if (typeof finalValue === 'number') {
      displayValue = finalValue % 1 !== 0 ? finalValue.toFixed(1) : finalValue.toLocaleString('ru-RU');
    } else {
      displayValue = finalValue;
    }
    
    content += `<tr><th>${translatedKey}</th><td class="${showCalculation ? 'highlight' : ''}">${displayValue}`;
    if (showCalculation && baseValue !== finalValue) {
      content += `<br><span class="base-value">(${calculationText})</span>`;
    }
    content += `</td></tr>`;
  }
  
  content += `</table>`;
  content += `<div style="margin-top:15px; padding-top:10px; border-top:1px solid #ccc;">`;
  content += `<strong>Глобальные бонусы:</strong><br>`;
  content += `Коэффициент счастья: ${realGlobalStats.happinessCoef.toFixed(2)} (${Math.round(realGlobalStats.happinessPercent)}%)<br>`;
  content += `Суммарное ускорение монет: +${realGlobalStats.coin_acceleration}%<br>`;
  content += `Суммарное ускорение молотков: +${realGlobalStats.hammer_acceleration}%`;
  content += `</div>`;
  
  const infoContent = document.getElementById('buildingInfoContent');
  if (infoContent) infoContent.innerHTML = content;
  
  const modal = document.getElementById('buildingInfoModal');
  if (modal) {
    modal.style.display = 'block';
    modal.style.left = `${(window.innerWidth - modal.offsetWidth) / 2}px`;
    modal.style.top = `${(window.innerHeight - modal.offsetHeight) / 2}px`;
    makeDraggable(modal);
  }
}

function closeBuildingInfoModal() {
  const modal = document.getElementById('buildingInfoModal');
  if (modal) modal.style.display = 'none';
}

// ============================================
// РАБОТА С ФАЙЛАМИ
// ============================================
function getSaveData() {
  const figuresData = [];
  
  document.querySelectorAll('.figure').forEach(figure => {
    figuresData.push({
      name: figure.dataset.name || "",
      width: parseInt(figure.style.width),
      height: parseInt(figure.style.height),
      left: parseInt(figure.style.left),
      top: parseInt(figure.style.top)
    });
  });
  
  const cellsData = [];
  for (let i = 0; i < totalCells; i++) {
    const cell = grid.children[i];
    cellsData.push({
      textContent: cell.textContent || '',
      isRoad: cell.classList.contains('road')
    });
  }
  
  return {
    figures: figuresData,
    cells: cellsData,
    initialCellStates: initialCellStates,
    townHallBonuses: townHallBonuses,
    timestamp: Date.now(),
    version: "1.0",
    app: "kvant"
  };
}

function saveToFile() {
  const saveData = getSaveData();
  const jsonString = JSON.stringify(saveData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kvaplan-g.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function triggerFileInput() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt,.json';
  input.onchange = loadFromFile;
  input.click();
}

function loadFromFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      
      document.querySelectorAll('.figure:not([data-name="Ратуша"])').forEach(fig => {
        if (fig.dataset.blinkInterval) clearInterval(fig.dataset.blinkInterval);
        fig.remove();
      });
      
      initialCellStates = data.initialCellStates || new Array(totalCells).fill('');
      for (let i = 0; i < totalCells; i++) {
        const cell = grid.children[i];
        cell.textContent = data.cells?.[i]?.textContent || '';
        if (data.cells?.[i]?.isRoad) {
          cell.classList.add('road');
          cell.classList.remove('boundary');
        } else {
          cell.classList.remove('road');
        }
      }
      
      townHallBonuses = data.townHallBonuses || {
        od: 0, coin_acceleration: 0, hammer_acceleration: 0,
        coin_initial: 0, hammer_initial: 0, kd_capacity: 200000
      };
      
      const odInput = document.getElementById('townHall-od');
      if (odInput) odInput.value = townHallBonuses.od;
      const coinAccInput = document.getElementById('townHall-coin-acceleration');
      if (coinAccInput) coinAccInput.value = townHallBonuses.coin_acceleration;
      const hammerAccInput = document.getElementById('townHall-hammer-acceleration');
      if (hammerAccInput) hammerAccInput.value = townHallBonuses.hammer_acceleration;
      const coinInitInput = document.getElementById('townHall-coin-initial');
      if (coinInitInput) coinInitInput.value = townHallBonuses.coin_initial;
      const hammerInitInput = document.getElementById('townHall-hammer-initial');
      if (hammerInitInput) hammerInitInput.value = townHallBonuses.hammer_initial;
      
      const savedTownHall = data.figures?.find(fig => fig.name === "Ратуша");
      if (savedTownHall) {
        const townHallFigure = document.querySelector('.figure[data-name="Ратуша"]');
        if (townHallFigure) {
          let left = Number(savedTownHall.left);
          let top = Number(savedTownHall.top);
          if (!isNaN(left) && !isNaN(top)) {
            left = Math.round(left / 30) * 30;
            top = Math.round(top / 30) * 30;
            townHallFigure.style.left = left + 'px';
            townHallFigure.style.top = top + 'px';
          }
        }
      }
      
      if (Array.isArray(data.figures)) {
        data.figures.forEach(fig => {
          if (fig.name !== 'Ратуша') {
            createFigure(fig.name, fig.width, fig.height, fig.left, fig.top, true);
          }
        });
      }
      
      whiteCellsCount = countWhiteCells();
      document.querySelectorAll('.figure').forEach(figure => {
        addDragHandlers(figure);
      });
      calculateBonuses();
      clearedCellsHistory = [];
      
      const bldModal = document.getElementById('bldCountModal');
      if (bldModal && bldModal.style.display !== 'none') {
        updateBldCount();
      }
    } catch (err) {
      console.error("Ошибка при загрузке из файла:", err);
    }
  };
  reader.readAsText(file);
}

// ============================================
// МОДАЛЬНЫЕ ОКНА
// ============================================
function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;
  const header = element.querySelector('.modal-header');
  if (!header) return;
  
  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function openTownHallModal() {
  const modal = document.getElementById('townHallModal');
  if (!modal) return;
  const bonusesButton = document.getElementById('bonusesBtn');
  if (!bonusesButton) return;
  
  modal.style.display = 'block';
  const rect = bonusesButton.getBoundingClientRect();
  const offsetX = 15;
  const offsetY = 0;
  let modalLeft = rect.right + offsetX;
  let modalTop = rect.top + offsetY;
  const modalWidth = 300;
  const modalHeight = modal.offsetHeight || 200;
  
  if (modalLeft + modalWidth > window.innerWidth) {
    modalLeft = window.innerWidth - modalWidth - 10;
  }
  if (modalTop + modalHeight > window.innerHeight) {
    modalTop = window.innerHeight - modalHeight - 10;
  }
  if (modalLeft < 0) modalLeft = 10;
  if (modalTop < 0) modalTop = 10;
  
  modal.style.left = `${modalLeft}px`;
  modal.style.top = `${modalTop}px`;
  
  const odInput = document.getElementById('townHall-od');
  if (odInput) odInput.value = townHallBonuses.od;
  const coinAccInput = document.getElementById('townHall-coin-acceleration');
  if (coinAccInput) coinAccInput.value = townHallBonuses.coin_acceleration;
  const hammerAccInput = document.getElementById('townHall-hammer-acceleration');
  if (hammerAccInput) hammerAccInput.value = townHallBonuses.hammer_acceleration;
  const coinInitInput = document.getElementById('townHall-coin-initial');
  if (coinInitInput) coinInitInput.value = townHallBonuses.coin_initial;
  const hammerInitInput = document.getElementById('townHall-hammer-initial');
  if (hammerInitInput) hammerInitInput.value = townHallBonuses.hammer_initial;
  const kdInput = document.getElementById('townHall-kd-capacity');
  if (kdInput) kdInput.value = townHallBonuses.kd_capacity;
}

function closeTownHallModal() {
  const modal = document.getElementById('townHallModal');
  if (modal) modal.style.display = 'none';
}

function saveTownHallBonuses() {
  const odInput = document.getElementById('townHall-od');
  if (odInput) townHallBonuses.od = Number(odInput.value) || 0;
  const coinAccInput = document.getElementById('townHall-coin-acceleration');
  if (coinAccInput) townHallBonuses.coin_acceleration = Number(coinAccInput.value) || 0;
  const hammerAccInput = document.getElementById('townHall-hammer-acceleration');
  if (hammerAccInput) townHallBonuses.hammer_acceleration = Number(hammerAccInput.value) || 0;
  const coinInitInput = document.getElementById('townHall-coin-initial');
  if (coinInitInput) townHallBonuses.coin_initial = Number(coinInitInput.value) || 0;
  const hammerInitInput = document.getElementById('townHall-hammer-initial');
  if (hammerInitInput) townHallBonuses.hammer_initial = Number(hammerInitInput.value) || 0;
  const kdInput = document.getElementById('townHall-kd-capacity');
  if (kdInput) townHallBonuses.kd_capacity = Number(kdInput.value) || 200000;
  
  closeTownHallModal();
  calculateBonuses();
}

function openStatisticsModal() {
  const modal = document.getElementById('statisticsModal');
  if (!modal) return;
  modal.style.display = 'block';
  const modalWidth = modal.offsetWidth || 400;
  modal.style.left = `${window.innerWidth - modalWidth - 30}px`;
  modal.style.top = '50px';
  if (parseInt(modal.style.top) < 20) modal.style.top = '20px';
  makeDraggable(modal);
  calculateBonuses();
}

function closeStatisticsModal() {
  const modal = document.getElementById('statisticsModal');
  if (modal) modal.style.display = 'none';
}

function openBldCountModal() {
  updateBldCount();
  const modal = document.getElementById('bldCountModal');
  if (!modal) return;
  modal.style.display = 'block';
  modal.style.left = `${window.innerWidth - modal.offsetWidth - 330}px`;
  modal.style.top = `${(window.innerHeight - modal.offsetHeight) / 2}px`;
}

function updateBldCount() {
  const map = {};
  let totalExpansionsPlaced = 0;
  
  document.querySelectorAll('.figure').forEach(fig => {
    const name = fig.dataset.name;
    if (name === 'Расш') {
      totalExpansionsPlaced++;
    } else if (name !== 'Ратуша') {
      map[name] = (map[name] || 0) + 1;
    }
  });
  
  let openCellsCount = 0;
  for (let i = 0; i < totalCells; i++) {
    const cell = grid.children[i];
    const row = Math.floor(i / 28) + 1;
    const col = (i % 28) + 1;
    let isGray = false;
    areas.forEach(area => {
      if (col >= area.colStart && col <= area.colEnd && row >= area.rowStart && row <= area.rowEnd) {
        isGray = true;
      }
    });
    if (!isGray && cell && cell.textContent !== 'X') {
      openCellsCount++;
    }
  }
  
  const BASE_AREA = 192;
  const EXPANSION_SIZE = 16;
  const extraCells = openCellsCount - BASE_AREA;
  let placedExpansions = extraCells > 0 ? Math.round(extraCells / EXPANSION_SIZE) : 0;
  const totalOpen = 12 + placedExpansions;
  
  const content = document.getElementById('bldCountContent');
  if (!content) return;
  
  let html = `
    <div class="expansions-section">
      <strong>📐 Расширения</strong>
      <div class="expansions-stats">
        <div>📦 Поставлено: <span>${placedExpansions}</span></div>
        <div>🏠 Базовых: <span>12</span></div>
        <div>🔓 Всего открыто: <span>${totalOpen}</span></div>
        <div style="font-size:12px; color:#666; margin-top:5px;">📊 Открыто клеток: ${openCellsCount} (база: ${BASE_AREA})</div>
      </div>
      <button id="restoreZonesBtn" ${placedExpansions > 0 ? '' : 'disabled'}>
        ↩️ Вернуть зоны расширений
      </button>
    </div>
    <div style="margin-top: 10px;">
      <strong>🏗️ Здания (${Object.keys(map).length} типов)</strong>
    </div>
    <div class="buildings-list">
  `;
  
  if (Object.keys(map).length === 0) {
    html += `<div class="empty-message">Нет зданий на поле</div>`;
  } else {
    const sortedBuildings = Object.entries(map).sort((a, b) => b[1] - a[1]);
    for (const [name, count] of sortedBuildings) {
      html += `
        <div class="building-item">
          <span class="building-name">${name}</span>
          <span class="building-count">${count} шт.</span>
        </div>
      `;
    }
  }
  
  html += `</div>`;
  content.innerHTML = html;
  
  const restoreBtn = document.getElementById('restoreZonesBtn');
  if (restoreBtn) {
    restoreBtn.onclick = function() {
      if (confirm('⚠️ Вернуть все зоны расширений?\nЭто удалит все расширения и вернёт символ "X" в ранее открытые клетки.')) {
        const restored = restoreExpansionZones();
        alert(`✅ Восстановлено ${restored} клеток!`);
        updateBldCount();
        calculateBonuses();
      }
    };
  }
}

function openFeedbackLink() {
  window.open("https://t.me/foehelp", '_blank');
}

// ============================================
// РЕЖИМЫ
// ============================================
function toggleDeleteMode() {
  const deleteButton = document.getElementById('deleteButton');
  if (!deleteButton) return;
  
  deleteMode = !deleteMode;
  
  if (deleteMode) {
    deleteButton.textContent = 'Отмена удаления';
    deleteButton.style.backgroundColor = '#ff4444';
    deleteButton.style.color = 'white';
    grid.classList.add('delete-mode');
    grid.style.cursor = 'crosshair';
    // Используем захват события (третий параметр true)
    grid.addEventListener('click', handleDeleteClick, true);
  } else {
    deleteButton.textContent = 'Удалить здание';
    deleteButton.style.backgroundColor = '';
    deleteButton.style.color = 'black';
    grid.classList.remove('delete-mode');
    grid.style.cursor = '';
    grid.removeEventListener('click', handleDeleteClick, true);
  }
}


function handleDeleteClick(event) {
  const figure = event.target.closest('.figure');
  if (figure && figure.dataset.name !== 'Ратуша') {
    event.stopPropagation();
    if (figure.dataset.blinkInterval) clearInterval(figure.dataset.blinkInterval);
    figure.remove();
    calculateBonuses();
  }
}

function resetFigures() {
  // Удаляем все здания кроме ратуши
  document.querySelectorAll('.figure').forEach(figure => {
    if (figure.dataset.name !== 'Ратуша') {
      if (figure.dataset.blinkInterval) clearInterval(figure.dataset.blinkInterval);
      figure.remove();
    }
  });
  
  // Сбрасываем выбранное здание
  if (selectedLiElement) {
    selectedLiElement.classList.remove('active');
  }
  selectedBuilding = null;
  selectedLiElement = null;
  
  // Удаляем призрачную фигуру
  if (ghostFigure) {
    ghostFigure.remove();
    ghostFigure = null;
  }
  grid.removeEventListener('mousemove', handleGhostMove);
  
  // Сбрасываем режим удаления, если он был активен
  if (deleteMode) {
    deleteMode = false;
    const deleteButton = document.getElementById('deleteButton');
    if (deleteButton) {
      deleteButton.textContent = 'Удалить здание';
      deleteButton.style.backgroundColor = '';
      deleteButton.style.color = 'black';
    }
    grid.classList.remove('delete-mode');
    grid.style.cursor = '';
  }
  
  // Восстанавливаем клетки в исходное состояние
  for (let i = 0; i < totalCells; i++) {
    const cell = grid.children[i];
    const row = Math.floor(i / 28) + 1;
    const col = (i % 28) + 1;
    
    let isGray = false;
    areas.forEach(area => {
      if (col >= area.colStart && col <= area.colEnd && row >= area.rowStart && row <= area.rowEnd) {
        isGray = true;
      }
    });
    
    // Определяем, должна ли клетка быть заблокирована (X)
    let shouldBeX = false;
    
    if (!isGray && !(
      (row >= 9 && row <= 20 && col >= 9 && col <= 20) ||
      (row >= 21 && row <= 24 && col >= 9 && col <= 20) ||
      (row >= 5 && row <= 8 && col >= 9 && col <= 24) ||
      (row >= 9 && row <= 16 && col >= 21 && col <= 24)
    ) || (row >= 17 && row <= 24 && col >= 9 && col <= 20)) {
      shouldBeX = true;
    }
    
    if (row >= 21 && row <= 28 && col >= 1 && col <= 8 && !isGray) {
      shouldBeX = true;
    }
    
    if (shouldBeX) {
      if (cell && !cell.classList.contains('road') && !cell.classList.contains('boundary')) {
        cell.textContent = initialCellStates[i] || 'X';
      }
    } else {
      if (cell) cell.textContent = '';
      initialCellStates[i] = '';
    }
  }
  
  // Сбрасываем бонусы ратуши на стандартные
  townHallBonuses = {
    od: 0,
    coin_acceleration: 0,
    hammer_acceleration: 0,
    coin_initial: 0,
    hammer_initial: 0,
    kd_capacity: 200000
  };
  
  // Обновляем поля в модальном окне, если они существуют
  const odInput = document.getElementById('townHall-od');
  if (odInput) odInput.value = 0;
  const coinAccInput = document.getElementById('townHall-coin-acceleration');
  if (coinAccInput) coinAccInput.value = 0;
  const hammerAccInput = document.getElementById('townHall-hammer-acceleration');
  if (hammerAccInput) hammerAccInput.value = 0;
  const coinInitInput = document.getElementById('townHall-coin-initial');
  if (coinInitInput) coinInitInput.value = 0;
  const hammerInitInput = document.getElementById('townHall-hammer-initial');
  if (hammerInitInput) hammerInitInput.value = 0;
  const kdInput = document.getElementById('townHall-kd-capacity');
  if (kdInput) kdInput.value = 200000;
  
  // Пересчитываем количество белых клеток
  whiteCellsCount = countWhiteCells();
  
  // Пересчитываем бонусы
  calculateBonuses();
  
  // Очищаем историю расширений
  clearedCellsHistory = [];
  
  // Если окно количества зданий открыто - обновляем его
  const bldModal = document.getElementById('bldCountModal');
  if (bldModal && bldModal.style.display !== 'none') {
    updateBldCount();
  }
}

function resetToInitialState() {
  if (confirm("Вернуть редактор в исходное состояние? Страница будет перезагружена.")) {
    location.reload();
  }
}

function toggleHideMode() {
  const button = document.getElementById('hideRowBtn');
  if (!button) return;
  hideModeActive = !hideModeActive;
  if (hideModeActive) {
    button.style.backgroundColor = 'red';
    button.style.color = 'white';
  } else {
    button.style.backgroundColor = '';
    button.style.color = '';
  }
}

function showAllRows() {
  const rows = document.querySelectorAll('#statistics-table tbody tr');
  rows.forEach(row => {
    row.style.display = '';
  });
  hideModeActive = false;
  const button = document.getElementById('hideRowBtn');
  if (button) {
    button.style.backgroundColor = '';
    button.style.color = '';
  }
}

function toggleStatisticsMinimize() {
  const modal = document.getElementById('statisticsModal');
  if (!modal) return;
  const btn = document.getElementById('minimizeStatsBtn');
  if (!btn) return;
  
  if (modal.classList.contains('minimized')) {
    modal.classList.remove('minimized');
    btn.textContent = '−';
    btn.title = 'Свернуть';
  } else {
    modal.classList.add('minimized');
    btn.textContent = '+';
    btn.title = 'Развернуть';
  }
}

function toggleTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  const tab = document.getElementById(`${tabId}Btn`);
  if (tab) tab.classList.add('active');
  
  const content = document.getElementById(tabId);
  if (content) content.classList.add('active');
}

// ============================================
// ЗАПУСК - ТОЛЬКО ОДИН DOMContentLoaded
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  
  if (!grid || !tabContentContainer) {
    console.error('Критические элементы не найдены!');
    return;
  }
  
  initGrid();
  createTownHall();
  createMenu();
  calculateBonuses();
  
  const resetFiguresBtn = document.getElementById('resetFiguresBtn');
  if (resetFiguresBtn) resetFiguresBtn.addEventListener('click', resetFigures);
  
  const resetToInitialBtn = document.getElementById('resetToInitialBtn');
  if (resetToInitialBtn) resetToInitialBtn.addEventListener('click', resetToInitialState);
  
  const deleteBtn = document.getElementById('deleteButton');
  if (deleteBtn) deleteBtn.addEventListener('click', toggleDeleteMode);
  
  const saveBtn = document.getElementById('saveButton');
  if (saveBtn) saveBtn.addEventListener('click', saveToFile);
  
  const loadBtn = document.getElementById('loadFileBtn');
  if (loadBtn) loadBtn.addEventListener('click', triggerFileInput);
  
  const tabs = ['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7'];
  tabs.forEach((tab) => {
    const btn = document.getElementById(`${tab}Btn`);
    if (btn) {
      btn.addEventListener('click', () => toggleTab(tab));
    }
  });
  
  const bonusesBtn = document.getElementById('bonusesBtn');
  if (bonusesBtn) bonusesBtn.addEventListener('click', openTownHallModal);
  
  const saveBonusesBtn = document.getElementById('saveBonusesBtn');
  if (saveBonusesBtn) saveBonusesBtn.addEventListener('click', saveTownHallBonuses);
  
  const closeBonusesBtn = document.getElementById('closeBonusesBtn');
  if (closeBonusesBtn) closeBonusesBtn.addEventListener('click', closeTownHallModal);
  
  const statisticsBtn = document.getElementById('statisticsBtn');
  if (statisticsBtn) statisticsBtn.addEventListener('click', openStatisticsModal);
  
  const closeStatisticsBtn = document.getElementById('closeStatisticsBtn');
  if (closeStatisticsBtn) closeStatisticsBtn.addEventListener('click', closeStatisticsModal);
  
  const hideRowBtn = document.getElementById('hideRowBtn');
  if (hideRowBtn) hideRowBtn.addEventListener('click', toggleHideMode);
  
  const showAllRowsBtn = document.getElementById('showAllRowsBtn');
  if (showAllRowsBtn) showAllRowsBtn.addEventListener('click', showAllRows);
  
  const bldCountBtn = document.getElementById('bldCountBtn');
  if (bldCountBtn) bldCountBtn.addEventListener('click', openBldCountModal);
  
  const closeBldCountBtn = document.getElementById('closeBldCountBtn');
  if (closeBldCountBtn) {
    closeBldCountBtn.addEventListener('click', () => {
      const modal = document.getElementById('bldCountModal');
      if (modal) modal.style.display = 'none';
    });
  }
  
  const feedbackBtn = document.getElementById('feedbackBtn');
  if (feedbackBtn) feedbackBtn.addEventListener('click', openFeedbackLink);
  
  const closeBuildingInfoBtn = document.getElementById('closeBuildingInfoBtn');
  if (closeBuildingInfoBtn) closeBuildingInfoBtn.addEventListener('click', closeBuildingInfoModal);
  
  const minimizeStatsBtn = document.getElementById('minimizeStatsBtn');
  if (minimizeStatsBtn) minimizeStatsBtn.addEventListener('click', toggleStatisticsMinimize);
  
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('townHallModal');
    const bonusesButton = document.getElementById('bonusesBtn');
    if (modal && modal.style.display === 'block' && !modal.contains(e.target) && bonusesButton && !bonusesButton.contains(e.target)) {
      closeTownHallModal();
    }
  });
  
  const statsTable = document.getElementById('statistics-table');
  if (statsTable) {
    statsTable.addEventListener('click', (e) => {
      if (!hideModeActive) return;
      const row = e.target.closest('tr');
      if (row) row.style.display = 'none';
    });
  }
  
  // Обработчик кликов по сетке для расстановки зданий
// Обработчик кликов по сетке для расстановки зданий
grid.addEventListener('click', (e) => {
  // Если включен режим удаления - ничего не делаем
  if (deleteMode) {
    return;
  }
  
  if (!selectedBuilding) return;
  
  const cell = e.target.closest('.cell');
  if (!cell) return;
  
  const rect = grid.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const col = Math.floor(x / 30);
  const row = Math.floor(y / 30);
  
  if (col < 0 || col >= 28 || row < 0 || row >= 28) return;
  
  const [widthCells, heightCells] = selectedBuilding.size.split('x').map(Number);
  if (col + widthCells > 28 || row + heightCells > 28) {
    alert(`Фигура не помещается на поле!`);
    return;
  }
  
  createFigure(
    selectedBuilding.name,
    widthCells * 30,
    heightCells * 30,
    col * 30,
    row * 30
  );
});
  

});

// КОНЕЦ ФАЙЛА
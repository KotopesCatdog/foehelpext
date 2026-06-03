# FOEhelp Browser Extension

Мощное расширение для Forge of Empires с множеством полезных инструментов.

## 📁 Структура проекта

```
foehelpext/
├── manifest.json                 # Конфиг расширения Chrome
├── background.js                 # Фоновый скрипт
├── popup.html / popup.js         # Главное меню расширения
│
├── src/
│   ├── modules/
│   │   ├── bubble/               # 🎮 Bubble Shooter игра
│   │   │   ├── bubble.html
│   │   │   └── bubble.js
│   │   │
│   │   ├── selection-kits/       # 🎁 Просмотр наборов выбора
│   │   │   ├── kits.html
│   │   │   └── kits.js
│   │   │
│   │   ├── qi-plan/              # 🏛️ Редактор QI-План
│   │   │   ├── kvag.html
│   │   │   └── kvag.js
│   │   │
│   │   ├── city-planner/         # 🏗️ Планировщик города
│   │   │   ├── cityplan.html
│   │   │   └── cityplan.js
│   │   │
│   │   ├── telegram/             # 📱 Telegram/Discord интеграция
│   │   │   ├── telegram.js
│   │   │   └── telegram.css
│   │   │
│   │   └── common/               # 🔧 Общие утилиты
│   │       ├── locales.js        # Локализация
│   │       └── stars.js          # Анимация фона
│   │
│   ├── assets/
│   │   └── kvaimg/               # Изображения для QI-Plan
│   │
│   └── content-scripts/          # Content scripts для игры
│       ├── wells_content.js
│       ├── planner_content.js
│       ├── medal_content.js
│       └── telegram_content.js
│
└── _locales/                     # Файлы локализации Chrome i18n
    ├── en/
    └── ru/
```

## 🎯 Модули

### Bubble Shooter (`src/modules/bubble/`)
Полнофункциональная игра "Шарики" с таблицей рекордов и сложностью.

### Selection Kits (`src/modules/selection-kits/`)
Просмотр и поиск наборов выбора из игры.

### QI-Plan Editor (`src/modules/qi-plan/`)
Редактор плана города с расчётом бонусов и статистики.

### City Planner (`src/modules/city-planner/`)
Планировщик расположения зданий в городе.

### Telegram Integration (`src/modules/telegram/`)
Отправка сообщений в Telegram/Discord из игры.

## 🚀 Установка

1. Клонируй репозиторий
2. Открой `chrome://extensions/`
3. Включи "Режим разработчика"
4. Нажми "Загрузить распакованное расширение"
5. Выбери папку проекта

## 📝 Разработка

Каждый модуль независим и может быть разработан отдельно. Для добавления нового модуля:

1. Создай папку в `src/modules/my-feature/`
2. Добавь необходимые HTML/JS/CSS файлы
3. Обнови `manifest.json` если нужны новые permissions или web_accessible_resources
4. Если модуль требует content script - добавь в manifest

## 🔗 Ссылки

- [Официальный сайт](https://www.foehelp.ru/)
- [Telegram](https://t.me/foehelp)
- [Discord](https://discord.gg/ZVSf4ZM34a)
- [Boosty (Поддержка)](https://boosty.to/foehelp/donate)

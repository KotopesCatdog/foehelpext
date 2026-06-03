# Структура проекта FOEhelp

## 📁 Организация файлов

### Корневая директория
- `manifest.json` - Конфигурация расширения Chrome
- `background.js` - Service Worker для фоновых операций
- `popup.html` / `popup.js` - Главное меню расширения
- `README.md` - Основная документация
- `STRUCTURE.md` - Этот файл

### src/modules/ - Основные модули функциональности

#### `bubble/` - Bubble Shooter игра
```
src/modules/bubble/
├── bubble.html       # UI игры
└── bubble.js         # Логика игры
```
**Описание**: Полнофункциональная игра в шарики с таблицей рекордов, уровнями сложности и сохранением прогресса.

#### `selection-kits/` - Просмотр наборов выбора
```
src/modules/selection-kits/
├── kits.html         # UI для просмотра наборов
└── kits.js           # Логика поиска и фильтрации
```
**Описание**: Позволяет просматривать и искать наборы выбора из игры FoE.

#### `qi-plan/` - Редактор QI-План
```
src/modules/qi-plan/
├── kvag.html         # UI редактора
└── kvag.js           # Логика редактирования, расчет бонусов
```
**Описание**: Редактор плана города с расчётом бонусов, статистикой и поддержкой save/load.

#### `city-planner/` - Планировщик города
```
src/modules/city-planner/
├── cityplan.html     # UI планировщика
└── cityplan.js       # Логика планирования
```
**Описание**: Инструмент для планирования расположения зданий в городе.

#### `telegram/` - Telegram/Discord интеграция
```
src/modules/telegram/
├── telegram.js       # Логика отправки сообщений
└── telegram.css      # Стили для панели настроек
```
**Описание**: Интеграция с Telegram и Discord для получения уведомлений из игры.

#### `common/` - Общие утилиты
```
src/modules/common/
├── locales.js        # Система локализации
└── stars.js          # Анимация звёздного фона
```
**Описание**: Переиспользуемые компоненты и утилиты.

### src/assets/
```
src/assets/
└── kvaimg/           # Изображения для модуля QI-Plan
```

### src/content-scripts/
```
src/content-scripts/
├── wells_content.js
├── planner_content.js
├── medal_content.js
└── telegram_content.js
```
**Описание**: Content scripts, внедряемые в страницу игры для извлечения данных.

### _locales/
```
_locales/
├── en/
│   └── messages.json    # Английские переводы
└── ru/
    └── messages.json    # Русские переводы
```

## 🔄 Зависимости между модулями

```
popup.js
  ├── → bubble/bubble.html
  ├── → selection-kits/kits.html
  ├── → qi-plan/kvag.html
  ├── → city-planner/cityplan.html
  └── → common/locales.js

kits.html
  └── → kits.js
       └── → chrome.storage.session

kvag.html
  └── → kvag.js
       ├── → chrome.storage.local
       └── → FileReader API

telegram_content.js
  └── → telegram.js
       ├── → localStorage
       └── → Telegram Bot API
```

## 📋 Правила добавления нового модуля

1. **Создайте папку** в `src/modules/your-feature/`
2. **Добавьте файлы**:
   - `your-feature.html` - UI
   - `your-feature.js` - Логика
   - `your-feature.css` - Стили (опционально)
3. **Обновите `popup.js`** для добавления кнопки открытия модуля
4. **Обновите `manifest.json`** если требуются новые permissions
5. **Добавьте в `web_accessible_resources`** если нужен доступ из popup

## 🚀 Запуск и разработка

### Локальная установка
```bash
# 1. Откройте chrome://extensions/
# 2. Включите "Режим разработчика"
# 3. Нажмите "Загрузить распакованное расширение"
# 4. Выберите папку проекта
```

### Разработка модуля
```bash
# Отредактируйте файлы в src/modules/your-module/
# Обновления применяются автоматически при перезагрузке расширения
```

## 📝 Лучшие практики

1. **Изолируйте логику** - каждый модуль должен быть независим
2. **Используйте chrome.storage** - для сохранения данных
3. **Документируйте код** - особенно сложную логику
4. **Добавляйте переводы** - в `_locales/en/messages.json` и `_locales/ru/messages.json`
5. **Тестируйте** - убедитесь, что модуль работает перед commit

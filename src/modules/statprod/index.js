// statprod/index.js
// Загружает данные из chrome.storage.session и запускает рендер таблиц

// =========================================================
// ── Локализация (глобальный скоуп — нужна до DOMContentLoaded) ──
// =========================================================

const LANG_RU = {
    statprod_title:                  'Forge of Empires – Рейтинг зданий игрока',
    statprod_subtitle:               'Идея — papachina',
    statprod_helper_note:            'Откройте "Рейтинг эфф." в хелпере и нажмите кнопку 📊',
    statprod_helper_note2:           'Оранжевый шрифт — средние значения в сутки с учётом рандома.',
    statprod_tab_production:         'Производство',
    statprod_tab_items:              'Фрагменты',
    statprod_tab_quanta:             'Кванты',
    statprod_btn_favorites:          '★ Избранные: все',
    statprod_btn_favorites_only:     '★ Избранные: только',
    statprod_btn_per_tile_off:       'На клетку: выкл',
    statprod_btn_per_tile_on:        'На клетку: вкл',
    statprod_btn_inventory:          'Инвентарь: все',
    statprod_inv_only:               'Инвентарь: только',
    statprod_inv_none:               'Инвентарь: нет',
    statprod_search_placeholder:     '🔍 Поиск по названию здания...',
    statprod_item_search_placeholder:'🔍 Поиск по предмету...',
    statprod_no_data:                '⚠ Данные не найдены. Откройте "Рейтинг эфф." в хелпере и нажмите кнопку 📊 Рейтинг зданий.',
};

const LANG_EN = {
    statprod_title:                  'Forge of Empires – Player Building Rating',
    statprod_subtitle:               'Idea — papachina',
    statprod_helper_note:            'Open "Productions Rating" in helper and click 📊',
    statprod_helper_note2:           'Orange text — average daily values including random drops.',
    statprod_tab_production:         'Production',
    statprod_tab_items:              'Fragments',
    statprod_tab_quanta:             'Quanta',
    statprod_btn_favorites:          '★ Favorites: all',
    statprod_btn_favorites_only:     '★ Favorites: only',
    statprod_btn_per_tile_off:       'Per tile: off',
    statprod_btn_per_tile_on:        'Per tile: on',
    statprod_btn_inventory:          'Inventory: all',
    statprod_inv_only:               'Inventory: only',
    statprod_inv_none:               'Inventory: none',
    statprod_search_placeholder:     '🔍 Search by building name...',
    statprod_item_search_placeholder:'🔍 Search by item...',
    statprod_no_data:                '⚠ No data found. Open "Productions Rating" in helper and click 📊 Building Rating.',
};

// Текущий язык — глобальная переменная
let currentLang = localStorage.getItem('statprod_lang') ||
    ((navigator.language || '').startsWith('ru') ? 'ru' : 'en');

// Словарь для foe_analyzer.js
window._i18nT = currentLang === 'ru' ? LANG_RU : LANG_EN;

function _t(key) {
    const dict = currentLang === 'ru' ? LANG_RU : LANG_EN;
    return dict[key] || key;
}

function applyLang() {
    window._i18nT = currentLang === 'ru' ? LANG_RU : LANG_EN;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const text = _t(el.dataset.i18n);
        if (text) el.textContent = text;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const text = _t(el.dataset.i18nPlaceholder);
        if (text) el.placeholder = text;
    });

    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.langBtn === currentLang);
    });

    // Динамические кнопки — читаем состояние из foe_analyzer (могут быть undefined до загрузки)
    const perTileBtn = document.getElementById('togglePerTile');
    if (perTileBtn) perTileBtn.textContent = _t(
        typeof perTileMode !== 'undefined' && perTileMode
            ? 'statprod_btn_per_tile_on'
            : 'statprod_btn_per_tile_off'
    );

    const invBtn = document.getElementById('toggleInventory');
    if (invBtn) {
        const idx = typeof inventoryMode !== 'undefined' ? inventoryMode : 0;
        invBtn.textContent = [
            _t('statprod_btn_inventory'),
            _t('statprod_inv_only'),
            _t('statprod_inv_none')
        ][idx];
    }

    const favBtn = document.getElementById('favToggle');
    if (favBtn) favBtn.textContent = _t(
        typeof showFav !== 'undefined' && showFav
            ? 'statprod_btn_favorites_only'
            : 'statprod_btn_favorites'
    );
}

// Глобальная функция — вызывается из addEventListener
window.i18nSwitchTo = function(lang) {
    currentLang = lang;
    localStorage.setItem('statprod_lang', lang);
    applyLang();
    // Перестраиваем таблицы чтобы обновились названия эпох
    if (typeof rebuildAllTables === 'function' && typeof lastGrouped !== 'undefined' && lastGrouped.length) {
        rebuildAllTables();
    }
};

// =========================================================
// ── Загрузка данных ──
// =========================================================

document.addEventListener('DOMContentLoaded', async () => {

    // Применяем язык к DOM
    applyLang();

    // Кнопки переключения языка
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
        btn.addEventListener('click', () => i18nSwitchTo(btn.dataset.langBtn));
    });

    // Загружаем данные из session storage
    let rawData = null;
    try {
        const result = await chrome.storage.session.get('statProdData');
        rawData = result.statProdData || null;
        if (rawData) chrome.storage.session.remove('statProdData');
    } catch(e) {
        console.error('[StatProd] storage.session error:', e);
    }

    if (!rawData || !rawData.buildings || !Array.isArray(rawData.buildings)) {
        const wrapper = document.querySelector('.content-wrapper');
        if (wrapper) {
            wrapper.innerHTML = `<div style="text-align:center;padding:60px;font-size:18px;color:#aaa;">${_t('statprod_no_data')}</div>`;
        }
        return;
    }

    loadBuildings(rawData.buildings);
});

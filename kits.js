// ============================================================
// kits.js — логика страницы наборов выбора (расширение FoEhelp)
// Данные получаются из sessionStorage, переданные popup.js
// ============================================================

// ---------- Переводы ----------
const TRANSLATIONS = {
    ru: {
        title:            '🎁 FoE: Наборы выбора (Selection Kits)',
        subtitle:         'Поиск по названиям наборов и предметам, которые в них входят',
        search_placeholder:'🔍 Поиск... (например: лучезарных, дендрарий, октосфера)',
        filter_label:     '📋 Тип набора:',
        filter_all:       'Все',
        filter_building:  '🏠 Здания',
        filter_upgrade:   '🔧 Апгрейды',
        filter_mixed:     '🔄 Смешанные',
        btn_expand:       '📂 Развернуть все',
        btn_collapse:     '📁 Свернуть все',
        stats_total:      '📊 Всего наборов:',
        stats_shown:      '🔍 Показано:',
        stats_building:   '🏠 Здания:',
        stats_upgrade:    '🔧 Апгрейды:',
        stats_nested:     '🎁 Вложенные:',
        stats_mixed:      '🔄 Смешанные:',
        type_building:    '🏠 Здания',
        type_upgrade:     '🔧 Апгрейды',
        type_nested:      '🎁 Вложенные наборы',
        type_mixed:       '🔄 Смешанный',
        type_other:       '📦 Другое',
        choice_building:  '🏠 Здание',
        choice_upgrade:   '🔧 Апгрейд',
        choice_selection: '🎁 Набор выбора',
        choices_title:    'Варианты выбора',
        empty:            '🔍 Ничего не найдено.',
        loading:          '⏳ Загрузка данных...',
        error_title:      '❌ Нет данных',
        error_text:       'Откройте страницу через кнопку в расширении FOEhelp, находясь в игре.',
        error_hint:       'Данные извлекаются автоматически из открытой вкладки Forge of Empires.',
    },
    en: {
        title:            '🎁 FoE: Selection Kits',
        subtitle:         'Search by kit names and included items',
        search_placeholder:'🔍 Search... (e.g. cherry blossom, observatory, octasphere)',
        filter_label:     '📋 Kit type:',
        filter_all:       'All',
        filter_building:  '🏠 Buildings',
        filter_upgrade:   '🔧 Upgrades',
        filter_mixed:     '🔄 Mixed',
        btn_expand:       '📂 Expand all',
        btn_collapse:     '📁 Collapse all',
        stats_total:      '📊 Total kits:',
        stats_shown:      '🔍 Shown:',
        stats_building:   '🏠 Buildings:',
        stats_upgrade:    '🔧 Upgrades:',
        stats_nested:     '🎁 Nested:',
        stats_mixed:      '🔄 Mixed:',
        type_building:    '🏠 Buildings',
        type_upgrade:     '🔧 Upgrades',
        type_nested:      '🎁 Nested kits',
        type_mixed:       '🔄 Mixed',
        type_other:       '📦 Other',
        choice_building:  '🏠 Building',
        choice_upgrade:   '🔧 Upgrade',
        choice_selection: '🎁 Selection kit',
        choices_title:    'Choices',
        empty:            '🔍 Nothing found.',
        loading:          '⏳ Loading data...',
        error_title:      '❌ No data',
        error_text:       'Please open this page via the FOEhelp extension button while in the game.',
        error_hint:       'Data is extracted automatically from the open Forge of Empires tab.',
    }
};

// ---------- Состояние ----------
let kitsData     = null;
let currentFilter = 'all';
let currentLang  = 'ru';

// ---------- Язык ----------
function detectLang() {
    // 1. Сохранённый выбор пользователя
    const saved = sessionStorage.getItem('kits_lang');
    if (saved) return saved;
    // 2. Язык расширения/браузера
    const uiLang = (navigator.language || 'ru').toLowerCase();
    return uiLang.startsWith('ru') ? 'ru' : 'en';
}

function setLang(lang) {
    currentLang = lang;
    sessionStorage.setItem('kits_lang', lang);
    applyTranslations();
    render();
}

function t(key) {
    return (TRANSLATIONS[currentLang] || TRANSLATIONS.ru)[key] || key;
}

function applyTranslations() {
    // Статические тексты
    document.getElementById('kits-title').textContent        = t('title');
    document.getElementById('kits-subtitle').textContent     = t('subtitle');
    document.getElementById('search').placeholder            = t('search_placeholder');
    document.getElementById('kits-filter-label').textContent = t('filter_label');
    document.getElementById('filter-all').textContent        = t('filter_all');
    document.getElementById('filter-building').textContent   = t('filter_building');
    document.getElementById('filter-upgrade').textContent    = t('filter_upgrade');
    document.getElementById('filter-mixed').textContent      = t('filter_mixed');

    const toggleBtn = document.getElementById('toggle-all-btn');
    const anyOpen = document.querySelectorAll('.kit-card.open').length > 0;
    toggleBtn.textContent = anyOpen ? t('btn_collapse') : t('btn_expand');

    // Активная кнопка языка
    document.getElementById('lang-ru').classList.toggle('active', currentLang === 'ru');
    document.getElementById('lang-en').classList.toggle('active', currentLang === 'en');
}

// ---------- Типы наборов ----------
function getKitType(kit) {
    const types = kit.choices.map(c => c.type);
    const hasBuilding  = types.includes('building');
    const hasUpgrade   = types.includes('upgrade_kit');
    const hasSelection = types.includes('selection_kit');
    if (hasBuilding && !hasUpgrade && !hasSelection &&
        kit.choices.length === types.filter(t => t === 'building').length) return 'building';
    if (hasUpgrade && !hasBuilding && !hasSelection &&
        kit.choices.length === types.filter(t => t === 'upgrade_kit').length) return 'upgrade';
    if (hasSelection) return 'selection';
    if ((hasBuilding && hasUpgrade) || kit.choices.length > 1) return 'mixed';
    return 'other';
}

// ---------- Фильтрация ----------
function filterKits(kits, query, filterType) {
    const q = query.toLowerCase().trim();
    return Object.entries(kits).filter(([id, kit]) => {
        const kitType = getKitType(kit);
        if (filterType !== 'all' && kitType !== filterType) return false;
        if (!q) return true;
        if (kit.name?.toLowerCase().includes(q))        return true;
        if (id.toLowerCase().includes(q))               return true;
        if (kit.description?.toLowerCase().includes(q)) return true;
        for (const choice of kit.choices) {
            if (choice.name?.toLowerCase().includes(q)) return true;
            if (choice.id?.toLowerCase().includes(q))   return true;
        }
        return false;
    });
}

// ---------- Подсветка ----------
function highlight(text, query) {
    if (!query || !text) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return String(text).replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

// ---------- Рендер ----------
function render() {
    if (!kitsData) return;

    const query      = document.getElementById('search')?.value || '';
    const statsDiv   = document.getElementById('stats');
    const resultsDiv = document.getElementById('results');
    const data       = kitsData.selectionKits || kitsData;
    const filtered   = filterKits(data, query, currentFilter);
    const total      = Object.keys(data).length;
    const shown      = filtered.length;

    const counts = { building: 0, upgrade: 0, selection: 0, mixed: 0, other: 0 };
    for (const kit of Object.values(data)) counts[getKitType(kit)]++;

    statsDiv.innerHTML = `
        <span>${t('stats_total')} ${total}</span>
        <span>${t('stats_shown')} ${shown}</span>
        <span>${t('stats_building')} ${counts.building}</span>
        <span>${t('stats_upgrade')} ${counts.upgrade}</span>
        <span>${t('stats_nested')} ${counts.selection}</span>
        <span>${t('stats_mixed')} ${counts.mixed}</span>
    `;

    if (shown === 0) {
        resultsDiv.innerHTML = `<div class="empty-state">${t('empty')}</div>`;
        return;
    }

    const typeLabels = {
        building:  t('type_building'),
        upgrade:   t('type_upgrade'),
        selection: t('type_nested'),
        mixed:     t('type_mixed'),
        other:     t('type_other')
    };
    const choiceLabels = {
        building:      t('choice_building'),
        upgrade_kit:   t('choice_upgrade'),
        selection_kit: t('choice_selection')
    };

    let html = '';
    for (const [kitId, kit] of filtered) {
        const kitType = getKitType(kit);
        html += `<div class="kit-card" data-kit-id="${kitId}">`;
        html += `<div class="kit-header">`;
        html += `<span class="kit-name">${highlight(kit.name, query)}</span>`;
        html += `<span class="kit-id">${kitId}</span>`;
        html += `<span class="kit-badge ${kitType}">${typeLabels[kitType]}</span>`;
        html += `</div><div class="kit-content">`;
        if (kit.description) {
            html += `<div class="description">📝 ${highlight(kit.description, query)}</div>`;
        }
        html += `<div class="choices-title">📋 ${t('choices_title')} (${kit.choices.length}):</div>`;
        html += `<div class="choices-grid">`;
        for (const choice of kit.choices) {
            const choiceLabel = choiceLabels[choice.type] || choice.type;
            html += `<div class="choice-item ${choice.type}">`;
            html += `<div class="choice-name">${highlight(choice.name, query)}</div>`;
            html += `<div class="choice-type">${choiceLabel}${choice.amount > 1 ? ` ×${choice.amount}` : ''}</div>`;
            html += `<div class="choice-id">${choice.id}</div>`;
            html += `</div>`;
        }
        html += `</div></div></div>`;
    }

    resultsDiv.innerHTML = html;

    document.querySelectorAll('.kit-card').forEach(card => {
        card.querySelector('.kit-header').addEventListener('click', () => {
            card.classList.toggle('open');
            // Обновляем текст кнопки
            const cards   = document.querySelectorAll('.kit-card');
            const anyOpen = Array.from(cards).some(c => c.classList.contains('open'));
            document.getElementById('toggle-all-btn').textContent =
                anyOpen ? t('btn_collapse') : t('btn_expand');
        });
    });
}

// ---------- Показать ошибку «нет данных» ----------
function showError() {
    document.getElementById('stats').innerHTML = '';
    document.getElementById('results').innerHTML = `
        <div class="error-state">
            <h3>${t('error_title')}</h3>
            <p>${t('error_text')}</p>
            <p style="margin-top:10px; font-size:13px; color:#666;">${t('error_hint')}</p>
        </div>`;
}

// ---------- Инициализация ----------
document.addEventListener('DOMContentLoaded', () => {
    currentLang = detectLang();
    applyTranslations();

    // --- Получаем данные из chrome.storage.session ---
    chrome.storage.session.get(['kitsData'], (result) => {
        if (result.kitsData) {
            kitsData = result.kitsData;
            chrome.storage.session.remove('kitsData');
            render();
        } else {
            showError();
        }
    });

    document.getElementById('lang-ru').addEventListener('click', () => setLang('ru'));
    document.getElementById('lang-en').addEventListener('click', () => setLang('en'));

    // --- Поиск ---
    document.getElementById('search').addEventListener('input', render);

    // --- Фильтры ---
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    // --- Развернуть / Свернуть все ---
    document.getElementById('toggle-all-btn').addEventListener('click', () => {
        const cards     = document.querySelectorAll('.kit-card');
        const anyCollapsed = Array.from(cards).some(c => !c.classList.contains('open'));
        if (anyCollapsed) {
            cards.forEach(c => c.classList.add('open'));
            document.getElementById('toggle-all-btn').textContent = t('btn_collapse');
        } else {
            cards.forEach(c => c.classList.remove('open'));
            document.getElementById('toggle-all-btn').textContent = t('btn_expand');
        }
    });
});

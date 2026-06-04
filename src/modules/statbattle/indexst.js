// statbattle/indexst.js
// Загружает данные из chrome.storage.session и запускает рендер таблиц боевых статов

// =========================================================
// ── Локализация (глобальный скоуп) ──
// =========================================================

const LANG_RU_ST = {
    plstat_title:                 'Forge of Empires – Статы зданий игрока',
    plstat_subtitle:              'Идея — papachina',
    plstat_helper_note:           'Откройте "Рейтинг эфф." в хелпере и нажмите кнопку ⚔️',
    plstat_search_placeholder:    '🔍 Поиск по названию...',
    plstat_btn_per_tile_off:      'На клетку: выкл',
    plstat_btn_per_tile_on:       'На клетку: вкл',
    plstat_btn_inventory:         'Инвентарь: все',
    plstat_inv_only:              'Инвентарь: только',
    plstat_inv_none:              'Инвентарь: нет',
    plstat_btn_average_off:       'Среднее: выкл',
    plstat_btn_average_on:        'Среднее: вкл',
    plstat_btn_favorites:         '★ Только избранные',
    plstat_btn_stats:             '📊 Общие статы',
    plstat_modal_title:           '📊 Общие статы',
    plstat_col_mode:              'Режим',
    plstat_row_total:             'Итого (все)',
    plstat_row_fields:            'Поля (общ.+поля)',
    plstat_row_quants:            'Кванты',
    plstat_row_expd:              'Экспедиция (общ.+эксп.)',
    plstat_no_data:               '⚠ Данные не найдены. Откройте "Рейтинг эфф." в хелпере и нажмите кнопку ⚔️ Статы игрока.',
};

const LANG_EN_ST = {
    plstat_title:                 'Forge of Empires – Player Building Stats',
    plstat_subtitle:              'Idea — papachina',
    plstat_helper_note:           'Open "Productions Rating" in helper and click ⚔️',
    plstat_search_placeholder:    '🔍 Search by building name...',
    plstat_btn_per_tile_off:      'Per tile: off',
    plstat_btn_per_tile_on:       'Per tile: on',
    plstat_btn_inventory:         'Inventory: all',
    plstat_inv_only:              'Inventory: only',
    plstat_inv_none:              'Inventory: none',
    plstat_btn_average_off:       'Average: off',
    plstat_btn_average_on:        'Average: on',
    plstat_btn_favorites:         '★ Favorites only',
    plstat_btn_stats:             '📊 Total stats',
    plstat_modal_title:           '📊 Total stats',
    plstat_col_mode:              'Mode',
    plstat_row_total:             'Total (all)',
    plstat_row_fields:            'Fields (total+fields)',
    plstat_row_quants:            'Quanta',
    plstat_row_expd:              'Expedition (total+expd.)',
    plstat_no_data:               '⚠ No data found. Open "Productions Rating" in helper and click ⚔️ Player Stats.',
};

let currentLangSt = localStorage.getItem('statbattle_lang') ||
    ((navigator.language || '').startsWith('ru') ? 'ru' : 'en');

window._i18nT = currentLangSt === 'ru' ? LANG_RU_ST : LANG_EN_ST;

function _tSt(key) {
    const dict = currentLangSt === 'ru' ? LANG_RU_ST : LANG_EN_ST;
    return dict[key] || key;
}

function applyLangSt() {
    window._i18nT = currentLangSt === 'ru' ? LANG_RU_ST : LANG_EN_ST;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const text = _tSt(el.dataset.i18n);
        if (text) el.textContent = text;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const text = _tSt(el.dataset.i18nPlaceholder);
        if (text) el.placeholder = text;
    });
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.langBtn === currentLangSt);
    });

    // Динамические кнопки
    const perTileBtn = document.getElementById('togglePerTile');
    if (perTileBtn) perTileBtn.textContent = _tSt(
        typeof perTileMode !== 'undefined' && perTileMode
            ? 'plstat_btn_per_tile_on' : 'plstat_btn_per_tile_off'
    );
    const invBtn = document.getElementById('toggleInventory');
    if (invBtn) {
        const idx = typeof inventoryMode !== 'undefined' ? inventoryMode : 0;
        invBtn.textContent = [
            _tSt('plstat_btn_inventory'),
            _tSt('plstat_inv_only'),
            _tSt('plstat_inv_none')
        ][idx];
    }
    const avgBtn = document.getElementById('toggleAverage');
    if (avgBtn) avgBtn.textContent = _tSt(
        typeof averageMode !== 'undefined' && averageMode
            ? 'plstat_btn_average_on' : 'plstat_btn_average_off'
    );
}

window.i18nSwitchTo = function(lang) {
    currentLangSt = lang;
    localStorage.setItem('statbattle_lang', lang);
    applyLangSt();
    // Перестраиваем таблицы чтобы обновились названия эпох
    if (typeof rebuildAllTables === 'function' && typeof lastList !== 'undefined' && lastList.length) {
        rebuildAllTables();
    }
    // Сообщаем модальному окну
    document.dispatchEvent(new Event('i18nApplied'));
};

// =========================================================
// ── Загрузка данных ──
// =========================================================

document.addEventListener('DOMContentLoaded', async () => {

    applyLangSt();

    // Кнопки языка
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
        btn.addEventListener('click', () => i18nSwitchTo(btn.dataset.langBtn));
    });

    // Модальное окно статов
    const statsBtn   = document.getElementById('toggleStatsBtn');
    const statsModal = document.getElementById('statsModal');
    const statsClose = document.getElementById('statsModalClose');

    const COL_BASE = 4, N_COLS = 16;
    const G_TOTAL  = [0,1,2,3];
    const G_FIELDS = [4,5,6,7];
    const G_QUANTS = [8,9,10,11];
    const G_EXPD   = [12,13,14,15];

    function calcColumnSums() {
        const tbody = document.querySelector('#battleTable tbody');
        if (!tbody) return new Array(N_COLS).fill(0);
        const sums = new Array(N_COLS).fill(0);
        [...tbody.querySelectorAll('tr')].forEach(row => {
            if (row.style.display === 'none') return;
            const cells = [...row.querySelectorAll('td')];
            const count = parseFloat(cells[3]?.textContent.replace(',', '.')) || 1;
            for (let i = 0; i < N_COLS; i++) {
                const val = parseFloat(cells[COL_BASE + i]?.textContent.replace(',', '.'));
                if (!isNaN(val)) sums[i] += val * count;
            }
        });
        return sums;
    }

    function fmt(v) {
        if (v === null || v === undefined) return '—';
        if (typeof v === 'string') return v;
        return Number.isInteger(v) ? v.toString() : v.toFixed(2);
    }

    function buildRow(label, values, rowClass) {
        const tr = document.createElement('tr');
        tr.className = rowClass;
        const tdLabel = document.createElement('td');
        tdLabel.textContent = label;
        tr.appendChild(tdLabel);
        values.forEach(v => {
            const td = document.createElement('td');
            td.textContent = fmt(v);
            tr.appendChild(td);
        });
        return tr;
    }

    function buildStatsTable() {
        const sums = calcColumnSums();
        const tbody = document.getElementById('statsTableBody');
        tbody.innerHTML = '';
        tbody.appendChild(buildRow(_tSt('plstat_row_total'),  sums.slice(), 'stats-row-total'));
        const fieldsVals = new Array(N_COLS).fill('—');
        for (let i = 0; i < 4; i++) fieldsVals[i] = sums[G_TOTAL[i]] + sums[G_FIELDS[i]];
        tbody.appendChild(buildRow(_tSt('plstat_row_fields'), fieldsVals, 'stats-row-fields'));
        const quantsVals = new Array(N_COLS).fill('—');
        for (let i = 0; i < 4; i++) quantsVals[i] = sums[G_QUANTS[i]];
        tbody.appendChild(buildRow(_tSt('plstat_row_quants'), quantsVals, 'stats-row-quants'));
        const expdVals = new Array(N_COLS).fill('—');
        for (let i = 0; i < 4; i++) expdVals[i] = sums[G_TOTAL[i]] + sums[G_EXPD[i]];
        tbody.appendChild(buildRow(_tSt('plstat_row_expd'),   expdVals,   'stats-row-expd'));
    }

    if (statsBtn && statsModal && statsClose) {
        statsBtn.addEventListener('click', () => { buildStatsTable(); statsModal.classList.add('open'); });
        statsClose.addEventListener('click', () => statsModal.classList.remove('open'));
        statsModal.addEventListener('click', e => { if (e.target === statsModal) statsModal.classList.remove('open'); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') statsModal.classList.remove('open'); });
        document.addEventListener('i18nApplied', () => { if (statsModal.classList.contains('open')) buildStatsTable(); });
    }

    // Загружаем данные
    let rawData = null;
    try {
        const result = await chrome.storage.session.get('statBattleData');
        rawData = result.statBattleData || null;
        if (rawData) chrome.storage.session.remove('statBattleData');
    } catch(e) {
        console.error('[StatBattle] storage.session error:', e);
    }

    if (!rawData || !rawData.buildings || !Array.isArray(rawData.buildings)) {
        document.querySelector('.content-wrapper').innerHTML =
            `<div style="text-align:center;padding:60px;font-size:18px;color:#aaa;">${_tSt('plstat_no_data')}</div>`;
        return;
    }

    setTimeout(() => {
        loadBuildings(rawData.buildings);
    }, 100);
});
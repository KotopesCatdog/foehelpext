// FoE Wells Highlighter — page script (world: MAIN)

(function() {
  'use strict';

  if (window._foeWellsLoaded) return;
  window._foeWellsLoaded = true;

  // Определяем язык браузера
  const getLanguage = () => {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('ru') ? 'ru' : 'en';
  };

  // Тексты для разных языков
  const texts = {
    ru: {
      buttonText: '💎 На карте',
      buttonTitle: 'Показать все колодцы/фонтаны на карте'
    },
    en: {
      buttonText: '💎 On Map',
      buttonTitle: 'Show all wells/fountains on the map'
    }
  };

  const currentLang = getLanguage();
  const t = texts[currentLang];

  // Названия объектов на русском и английском
  const TARGET_NAMES = new Set([
    // Русские названия
    'фонтан молодости',
    'маленький фонтан молодости',
    'колодец желаний',
    'маленький колодец желаний',
    // Английские названия
    'fountain of youth',
    'small fountain of youth',
    'wishing well',
    'small wishing well'
  ]);

  function isTarget(name) {
    return name && TARGET_NAMES.has(name.trim().toLowerCase());
  }

  function getActiveTab() {
    const tabs = document.querySelectorAll('#Productions .production-tabs > div[id]');
    for (const tab of tabs) {
      const display = tab.style.display;
      // Активная: display: block или style пустой/отсутствует (первая вкладка)
      if (display === 'block' || display === '') return tab;
    }
    return null;
  }

  function collectTargetIds(tab) {
    const ids = [];
    tab.querySelectorAll('tr').forEach(row => {
      const nameCell = row.querySelector('td:nth-child(2)');
      if (!nameCell) return;
      const name = (nameCell.getAttribute('exportvalue') || nameCell.textContent || '').trim();
      if (!isTarget(name)) return;
      const showEntity = row.querySelector('.show-entity[data-id]');
      if (showEntity) ids.push(parseInt(showEntity.dataset.id));
    });
    return ids;
  }

  function onBtnClick() {
    const tab = getActiveTab();
    if (!tab) return;
    const ids = collectTargetIds(tab);
    if (!ids.length) return;
    Productions.ShowOnMap(ids);
  }

  function addButton() {
    if (document.getElementById('foe-wells-map-btn')) return;
    const header = document.querySelector('#ProductionsButtons');
    if (!header) return;

    const btn = document.createElement('button');
    btn.id = 'foe-wells-map-btn';
    btn.textContent = t.buttonText;
    btn.title = t.buttonTitle;
    btn.style.cssText = `
      margin-right: 6px;
      padding: 2px 8px;
      background: #2a1e40;
      border: 1px solid #b4befe;
      border-radius: 4px;
      color: #b4befe;
      font-size: 12px;
      cursor: pointer;
      vertical-align: middle;
    `;
    btn.addEventListener('click', onBtnClick);
    header.insertBefore(btn, header.firstChild);
  }

  const observer = new MutationObserver(() => {
    if (document.getElementById('ProductionsButtons')) addButton();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  if (document.getElementById('ProductionsButtons')) addButton();

})();
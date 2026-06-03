// Medal Calculator — page script (fully localized)
// Вставляет кнопку в заголовок окна GexStat (FoE Helper)
// и создаёт модальный калькулятор стоимости ходов в экспедиции

(function () {
  'use strict';

  if (window._foeMedalPageLoaded) return;
  window._foeMedalPageLoaded = true;

  /* ── Определение языка ── */
  const getLanguage = () => {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('ru') ? 'ru' : 'en';
  };

  const currentLang = getLanguage();

  /* ── Тексты интерфейса (переводимые) ── */
  const uiTexts = {
    ru: {
      buttonText: '🏅 Стоимость медалей',
      buttonTitle: 'Калькулятор стоимости медалей в экспедиции',
      modalTitle: 'Стоимость медалей в экспедиции',
      closeTitle: 'Закрыть',
      labelFirstPurchase: 'Стоимость первой покупки:',
      labelCurrentCost: '… или текущая стоимость покупки:',
      labelCurrentPoint: 'Текущая точка:',
      btnTo64: 'До 64 точки',
      btnTo80: 'До 80 точки',
      resultPlaceholder: 'Результат',
      resetButton: 'Сброс',
      errorNoData: 'Введите данные',
      errorTargetExceeded: 'Точка превышает цель',
      selectPlaceholder: 'Выберите эпоху'
    },
    en: {
      buttonText: '🏅 Medal cost',
      buttonTitle: 'Expedition Medal Value Calculator',
      modalTitle: 'Expedition Medal Value Calculator',
      closeTitle: 'Close',
      labelFirstPurchase: 'Cost of the first purchase:',
      labelCurrentCost: '… or current purchase cost:',
      labelCurrentPoint: 'Current checkpoint:',
      btnTo64: 'To checkpoint 64',
      btnTo80: 'To checkpoint 80',
      resultPlaceholder: 'Result',
      resetButton: 'Reset',
      errorNoData: 'Enter the data',
      errorTargetExceeded: 'Checkpoint exceeds target',
      selectPlaceholder: 'Select an age'
    }
  };

  const t = uiTexts[currentLang];

  /* ── Стили ── */
  const css = `
    #GexStat-medal-btn {
      background: #c8860a;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 2px 8px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      white-space: nowrap;
      margin-right: 4px;
      line-height: 20px;
      vertical-align: middle;
    }
    #GexStat-medal-btn:hover { background: #e09a12; }

    #medal-modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      z-index: 99999;
      align-items: center;
      justify-content: center;
    }
    #medal-modal-overlay.active { display: flex; }

    #medal-modal-box {
      background: #333;
      border-radius: 10px;
      width: 380px;
      max-width: 95vw;
      box-shadow: 0 8px 40px rgba(0,0,0,0.85);
      overflow: hidden;
      color: #eee;
      font-family: Arial, sans-serif;
    }
    #medal-modal-box .medal-mh {
      background: #1a1a2e;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #444;
    }
    #medal-modal-box .medal-mh span {
      font-size: 14px;
      font-weight: bold;
      color: #ddd;
    }
    #medal-modal-box .medal-mh button {
      background: #943;
      border: none;
      color: #fff;
      border-radius: 3px;
      width: 22px;
      height: 22px;
      cursor: pointer;
      font-size: 15px;
      line-height: 1;
    }
    #medal-modal-box .medal-mh button:hover { background: #b33; }
    #medal-modal-box .medal-mc { padding: 14px 18px 20px; }
    #medal-modal-box .medal-mc label {
      display: block;
      font-size: 13px;
      color: #bbb;
      margin: 14px 0 5px;
    }
    #medal-modal-box .medal-mc label:first-child { margin-top: 0; }
    #medal-modal-box .medal-mc select,
    #medal-modal-box .medal-mc input[type="number"] {
      width: 100%;
      padding: 9px 10px;
      font-size: 14px;
      background: #444;
      color: #eee;
      border: 1px solid #555;
      border-radius: 5px;
      box-sizing: border-box;
      outline: none;
    }
    #medal-modal-box .medal-mc select:focus,
    #medal-modal-box .medal-mc input[type="number"]:focus { border-color: #0066cc; }
    #medal-modal-box .medal-btns {
      display: flex;
      gap: 10px;
      margin: 16px 0 12px;
    }
    #medal-modal-box .medal-btns button {
      flex: 1;
      padding: 10px;
      background: #0066cc;
      color: #fff;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      font-weight: bold;
    }
    #medal-modal-box .medal-btns button:hover { background: #0055aa; }
    #medal-modal-box .medal-result {
      background: #444;
      border-radius: 5px;
      text-align: center;
      padding: 12px;
      color: #00ff00;
      font-size: 24px;
      font-weight: bold;
      min-height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #medal-modal-box .medal-reset {
      width: 100%;
      margin-top: 12px;
      padding: 9px;
      background: #dc3545;
      color: #fff;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      font-weight: bold;
    }
    #medal-modal-box .medal-reset:hover { background: #c82333; }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = 'medal-modal-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── Данные эпох (ТОЧНЫЕ соответствия, не переводить!) ── */
  const EPOCHS = [
    ['',    'Выберите эпоху',           'Select an age'],
    ['1',   'Железный Век',             'Iron Age'],
    ['2',   'Раннее Средневековье',     'Early Middle Ages'],
    ['3',   'Высокое Средневековье',    'High Middle Ages'],
    ['6',   'Позднее Средневековье',    'Late Middle Ages'],
    ['10',  'Колониальная Эпоха',       'Colonial Age'],
    ['17',  'Индустриальная Эпоха',     'Industrial Age'],
    ['25',  'Эпоха Прогресса',          'Progressive Era'],
    ['37',  'Эпоха Модерна',            'Modern Era'],
    ['50',  'Эпоха Постмодерна',        'Postmodern Era'],
    ['67',  'Новейшее Время',           'Contemporary Era'],
    ['92',  'Завтра',                   'Tomorrow Era'],
    ['120', 'Будущее',                  'Future'],
    ['150', 'Арктическое Будущее',      'Arctic Future'],
    ['150', 'Океаническое Будущее',     'Oceanic Future'],
    ['180', 'Виртуальное Будущее',      'Virtual Future'],
    ['210', 'Космическая эра Марса',    'Space Age Mars'],
    ['300', 'Пояс астероидов',          'Space Age Asteroid Belt'],
    ['390', 'Космическая эра Венеры',   'Space Age Venus'],
    ['480', 'Спутник Юпитера',          'Space Age Jupiter Moon'],
    ['570', 'Титан',                    'Space Age Titan'],
    ['660', 'Космический хаб',          'Space Age Hub'],
  ];

  // Выбираем нужную колонку названий в зависимости от языка
  const epochNames = EPOCHS.map(epoch => {
    const value = epoch[0];
    const name = currentLang === 'ru' ? epoch[1] : epoch[2];
    return [value, name];
  });

  /* ── Создание модального окна ── */
  function createModal() {
    if (document.getElementById('medal-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'medal-modal-overlay';
    overlay.innerHTML = `
      <div id="medal-modal-box">
        <div class="medal-mh">
          <span>${t.modalTitle}</span>
          <button id="medal-modal-close" title="${t.closeTitle}">✕</button>
        </div>
        <div class="medal-mc">
          <label for="medal-selectA">${t.labelFirstPurchase}</label>
          <select id="medal-selectA">
            <option value="">${t.selectPlaceholder}</option>
            ${epochNames.map(([v, name]) => `<option value="${v}">${name}</option>`).join('')}
          </select>

          <label for="medal-inputA">${t.labelCurrentCost}</label>
          <input type="number" id="medal-inputA" min="0" step="any" placeholder="0">

          <label for="medal-inputFrom">${t.labelCurrentPoint}</label>
          <input type="number" id="medal-inputFrom" min="0" placeholder="0">

          <div class="medal-btns">
            <button id="medal-btn64">${t.btnTo64}</button>
            <button id="medal-btn80">${t.btnTo80}</button>
          </div>

          <div class="medal-result" id="medal-result">${t.resultPlaceholder}</div>
          <button class="medal-reset" id="medal-reset">${t.resetButton}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.getElementById('medal-modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    document.getElementById('medal-selectA').addEventListener('change', function () {
      if (this.value !== '') document.getElementById('medal-inputA').value = this.value;
    });

    document.getElementById('medal-btn64').addEventListener('click', () => calculate(64));
    document.getElementById('medal-btn80').addEventListener('click', () => calculate(80));
    document.getElementById('medal-reset').addEventListener('click', reset);
  }

  function openModal()  { document.getElementById('medal-modal-overlay').classList.add('active'); }
  function closeModal() { document.getElementById('medal-modal-overlay').classList.remove('active'); }

  function calculate(target) {
    const a    = parseFloat(document.getElementById('medal-inputA').value);
    const from = parseInt(document.getElementById('medal-inputFrom').value, 10);
    const res  = document.getElementById('medal-result');
    
    if (isNaN(a) || isNaN(from)) { 
      res.textContent = t.errorNoData; 
      return; 
    }
    
    const steps = target - from;
    if (steps < 0) { 
      res.textContent = t.errorTargetExceeded; 
      return; 
    }
    
    // Форматирование числа с разделителями согласно языку
    const resultValue = Math.round(a * (Math.pow(1.2, steps) - 1) / 0.2);
    res.textContent = resultValue.toLocaleString(currentLang === 'ru' ? 'ru-RU' : 'en-US');
  }

  function reset() {
    document.getElementById('medal-inputA').value = '';
    document.getElementById('medal-inputFrom').value = '';
    document.getElementById('medal-result').textContent = t.resultPlaceholder;
    document.getElementById('medal-selectA').selectedIndex = 0;
  }

  /* ── Вставка кнопки в заголовок GexStat ── */
  function injectButton() {
    if (document.getElementById('GexStat-medal-btn')) return;
    const buttons = document.getElementById('GexStatButtons');
    if (!buttons) return;

    const btn = document.createElement('button');
    btn.id          = 'GexStat-medal-btn';
    btn.textContent = t.buttonText;
    btn.title       = t.buttonTitle;
    btn.addEventListener('click', openModal);
    buttons.insertBefore(btn, buttons.firstChild);

    createModal();
  }

  /* ── MutationObserver: ждём появления окна GexStat ── */
  const observer = new MutationObserver(() => {
    if (document.getElementById('GexStatButtons')) {
      injectButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // На случай если окно уже есть в DOM в момент загрузки скрипта
  injectButton();

})();
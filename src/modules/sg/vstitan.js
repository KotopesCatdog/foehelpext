// vstitan.js — логика калькулятора титанов

(function () {
  'use strict';

  // Заполняем селекты уровнями 11–200
  const levelSelectFrom = document.getElementById('fromLevel');
  const levelSelectTo   = document.getElementById('toLevel');

  for (let i = 11; i <= 200; i++) {
    const opt = document.createElement('option');
    opt.value       = i;
    opt.textContent = i;
    levelSelectFrom.appendChild(opt.cloneNode(true));
    levelSelectTo.appendChild(opt);
  }

  // Синхронизация при "Один уровень"
  function syncLevels() {
    const singleLevel = document.getElementById('singleLevel');
    const fromLevel   = document.getElementById('fromLevel');
    const toLevel     = document.getElementById('toLevel');

    if (singleLevel.checked) {
      toLevel.value    = fromLevel.value;
      toLevel.disabled = true;
    } else {
      toLevel.disabled = false;
    }
  }

  // Расчёт
  function calculate() {
    const fromLevel = document.getElementById('fromLevel').value;
    const toLevel   = document.getElementById('toLevel').value;
    const titans    = document.querySelectorAll('.titan-checkbox input[type="checkbox"]:checked');

    let totalItem  = 0;
    let totalCoins = 0;

    titans.forEach(titan => {
      const tv = titan.value;

      // Фундамент
      if (fromLevel === 'foundation') {
        if      (tv === 'hydra')   totalItem += 15;
        else if (tv === 'centaur') totalItem += 12.5;
        else                       totalItem += 10;
      }

      // Уровни 11+
      if (toLevel !== 'foundation') {
        const fromLvl = fromLevel === 'foundation' ? 11 : parseInt(fromLevel);
        const toLvl   = parseInt(toLevel);

        for (let lvl = fromLvl; lvl <= toLvl; lvl++) {
          const adj = lvl - 10;
          let item, coins;

          if      (tv === 'hydra')   { item = 0.5 * adj; coins = 5 * adj; }
          else if (tv === 'centaur') { item = 0.4 * adj; coins = 4 * adj; }
          else                       { item = 0.3 * adj; coins = 3 * adj; }

          totalItem  += item;
          totalCoins += coins;
        }
      }
    });

    const itemPer = totalItem / 5;
    const locale  = navigator.language || 'ru-RU';

    const fmtDec = v => parseFloat(v.toFixed(1)).toLocaleString(locale, {
      minimumFractionDigits: v % 1 !== 0 ? 1 : 0,
      maximumFractionDigits: 1
    });
    const fmtInt = v => Math.round(v).toLocaleString(locale);

    document.getElementById('itemPer').textContent = fmtDec(itemPer);
    document.getElementById('total').textContent   = fmtDec(totalItem);
    document.getElementById('coins').textContent   = fmtInt(totalCoins);
  }

  // События
  document.querySelectorAll('.titan-checkbox input').forEach(cb =>
    cb.addEventListener('change', calculate)
  );
  document.getElementById('fromLevel').addEventListener('change', () => { syncLevels(); calculate(); });
  document.getElementById('toLevel').addEventListener('change', calculate);
  document.getElementById('singleLevel').addEventListener('change', () => { syncLevels(); calculate(); });

  // Инициализация
  syncLevels();
  calculate();

})();

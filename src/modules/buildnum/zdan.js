// zdan.js — подсчёт построек (локализация ru/en)

(function () {
  'use strict';

  /* ── Язык ── */
  const lang = (navigator.language || 'ru').startsWith('ru') ? 'ru' : 'en';

  /* ── Тексты ── */
  const T = {
    ru: {
      title:          'Подсчёт построек',
      btnReset:       'Сбросить фильтры',
      btnCopy:        'Копировать результат',
      filterTitle:    'Фильтры результатов:',
      wells:          'Колодцы',
      smallWells:     'Мал. колодцы',
      fountains:      'Фонтаны',
      smallFountains: 'Мал. фонтаны',
      colName:        'Имя',
      colCount:       'Количество',
      navBack:        '← Назад',
      navHome:        '🏠 Домой',
      errNoData:      'Нет данных. Откройте страницу через кнопку в FoE Helper.',
      errParse:       'Не удалось распознать данные зданий.',
      errNoCopy:      'Нет результатов для копирования.',
      msgCopied:      'Результаты скопированы в буфер обмена.',
      msgCopyFail:    'Ошибка при копировании.',
      copyHeader:     'Имя\tКоличество\n',
      nameWells:         'Колодец желаний',
      nameSmallWells:    'Маленький колодец желаний',
      nameFountains:     'Фонтан молодости',
      nameSmallFountains:'Маленький Фонтан молодости',
    },
    en: {
      title:          'Building Count',
      btnReset:       'Reset filters',
      btnCopy:        'Copy result',
      filterTitle:    'Result filters:',
      wells:          'Wishing Wells',
      smallWells:     'Sm. Wishing Wells',
      fountains:      'Fountains of Youth',
      smallFountains: 'Sm. Fountains of Youth',
      colName:        'Name',
      colCount:       'Count',
      navBack:        '← Back',
      navHome:        '🏠 Home',
      errNoData:      'No data. Open this page via the button in FoE Helper.',
      errParse:       'Could not parse building data.',
      errNoCopy:      'No results to copy.',
      msgCopied:      'Results copied to clipboard.',
      msgCopyFail:    'Copy failed.',
      copyHeader:     'Name\tCount\n',
      nameWells:         'Wishing Well',
      nameSmallWells:    'Small Wishing Well',
      nameFountains:     'Fountain of Youth',
      nameSmallFountains:'Small Fountain of Youth',
    }
  };

  const t = T[lang];

  /* ── Безопасная установка текста ── */
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // Для label: меняем текстовый узел после чекбокса, не трогая сам input
  function setLabelText(id, text) {
    const label = document.getElementById(id);
    if (!label) return;
    for (const node of label.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = '\u00a0' + text;
        return;
      }
    }
    label.appendChild(document.createTextNode('\u00a0' + text));
  }

  /* ── Применяем тексты к DOM ── */
  function applyLocale() {
    document.title = t.title;
    setText('pageTitle',   t.title);
    setText('btnReset',    t.btnReset);
    setText('btnCopy',     t.btnCopy);
    setText('filterTitle', t.filterTitle);
    setText('thName',      t.colName);
    setText('thCount',     t.colCount);
    setText('navBack',     t.navBack);
    setText('navHome',     t.navHome);
    setLabelText('labelWells',          t.wells);
    setLabelText('labelSmallWells',     t.smallWells);
    setLabelText('labelFountains',      t.fountains);
    setLabelText('labelSmallFountains', t.smallFountains);
  }

  /* ── Инициализация ── */
  document.addEventListener('DOMContentLoaded', () => {
    applyLocale();

    // Запрос данных от background
    chrome.runtime.sendMessage({ action: 'getData' }, response => {
      if (response && response.success && response.key === 'buildNumData') {
        processData(response.data);
      } else {
        showError(t.errNoData);
      }
    });
  });

  /* ── Обработка и подсчёт ── */
  function processData(rawData) {
    const lines = rawData.split('\n').map(l => l.trim()).filter(l => l !== '');
    const counts = {};

    lines.forEach(line => {
      const values = line.split('\t');
      if (values.length >= 5) {
        const name = values[4].trim();
        counts[name] = (counts[name] || 0) + 1;
      }
    });

    if (Object.keys(counts).length === 0) {
      showError(t.errParse);
      return;
    }

    renderTable(counts);
    setupFilters(counts);
    setupCopy();
  }

  /* ── Рендер таблицы ── */
  function renderTable(counts, filterNames) {
    let results = Object.entries(counts);

    if (filterNames && filterNames.length > 0) {
      results = results.filter(([name]) => filterNames.includes(name));
    }

    results.sort((a, b) => b[1] - a[1]);

    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = '';

    results.forEach(([name, count]) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${name}</td><td>${count.toLocaleString(navigator.language)}</td>`;
      tbody.appendChild(row);
    });
  }

  /* ── Фильтры ── */
  function setupFilters(counts) {
    const checkboxMap = {
      wells:          t.nameWells,
      smallWells:     t.nameSmallWells,
      fountains:      t.nameFountains,
      smallFountains: t.nameSmallFountains,
    };
    const ids = Object.keys(checkboxMap);

    function applyFilters() {
      const active = ids
        .filter(id => document.getElementById(id).checked)
        .map(id => checkboxMap[id]);
      renderTable(counts, active.length > 0 ? active : null);
    }

    ids.forEach(id => document.getElementById(id).addEventListener('change', applyFilters));

    document.getElementById('btnReset').addEventListener('click', () => {
      ids.forEach(id => document.getElementById(id).checked = false);
      renderTable(counts);
    });
  }

  /* ── Копирование ── */
  function setupCopy() {
    document.getElementById('btnCopy').addEventListener('click', () => {
      const tbody = document.getElementById('resultsBody');
      if (!tbody.innerHTML) { alert(t.errNoCopy); return; }

      let text = t.copyHeader;
      tbody.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        text += `${cells[0].innerText}\t${cells[1].innerText}\n`;
      });

      navigator.clipboard.writeText(text)
        .then(() => alert(t.msgCopied))
        .catch(() => {
          const area = document.getElementById('copyArea');
          area.value = text;
          area.select();
          try { document.execCommand('copy'); alert(t.msgCopied); }
          catch { alert(t.msgCopyFail); }
        });
    });
  }

  /* ── Ошибка ── */
  function showError(msg) {
    document.getElementById('resultsBody').innerHTML =
      `<tr><td colspan="2" style="text-align:center;color:#f88;">${msg}</td></tr>`;
  }

})();

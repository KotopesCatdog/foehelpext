// BuildNum — content script
// По аналогии с planner_content.js: собирает данные зданий и открывает zdan.html

(function () {
  'use strict';

  if (window._foeBuildNumInjected) return;
  window._foeBuildNumInjected = true;

  function getCityData() {
    const elements = document.querySelectorAll('span.entity');
    if (elements.length === 0) {
      return { error: 'Откройте Обзор города в хелпере.' };
    }

    const cityClassValues = {
      'street': 1,
      'main_building': 2,
      'noStreet': 3,
      'greatbuilding': 4
    };

    const extractedData = [];

    elements.forEach(element => {
      const classNames = element.className.trim();
      const style = element.getAttribute('style') || '';
      const name = element.getAttribute('data-title') || 'Без названия';

      const regex = /width:\s*([\d.]+)em;\s*height:\s*([\d.]+)em;\s*left:\s*([\d.]+)em;\s*top:\s*([\d.]+)em;/;
      const match = style.match(regex);

      if (match) {
        const width  = Math.round(parseFloat(match[1]));
        const height = Math.round(parseFloat(match[2]));
        const left   = Math.round(parseFloat(match[3]));
        const top    = Math.round(parseFloat(match[4]));

        let color = '';
        for (const cls of classNames.split(' ')) {
          if (cityClassValues[cls]) { color = cityClassValues[cls]; break; }
        }

        extractedData.push(`${width}\t${height}\t${left}\t${top}\t${name}\t${color}`);
      }
    });

    if (extractedData.length === 0) {
      return { error: 'Не удалось найти данные зданий.' };
    }

    return { data: extractedData.join('\n'), count: extractedData.length };
  }

  function openBuildNumWithData() {
    const result = getCityData();
    if (result.error) { alert(result.error); return; }

    // Передаём данные через background (тот же механизм, что statprod/statbattle)
    chrome.runtime.sendMessage({
      action: 'openBuildNum',
      data: result.data
    });
  }

  // Слушаем событие от page script
  window.addEventListener('FOEhelp_openBuildNum', openBuildNumWithData);

  // Инжектируем page script
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('src/modules/buildnum/buildnum_page.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);

})();

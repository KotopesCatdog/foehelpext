// SG Titan Calculator — content script
// Инжектирует sg_page.js и слушает событие открытия страницы

(function () {
  'use strict';

  if (window._foeSgInjected) return;
  window._foeSgInjected = true;

  // Инжектируем page script в контекст страницы
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('src/modules/sg/sg_page.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);

  // Слушаем событие от page script и открываем вкладку через background
  window.addEventListener('FOEhelp_openSgTitan', () => {
    chrome.runtime.sendMessage({ action: 'openSgTitan' });
  });

})();

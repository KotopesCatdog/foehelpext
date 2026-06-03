// Medal Calculator — content script
// Инжектирует medal_page.js и ждёт появления окна GexStat от FoE Helper

(function () {
  'use strict';

  if (window._foeMedalInjected) return;
  window._foeMedalInjected = true;

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('medal_page.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);

})();

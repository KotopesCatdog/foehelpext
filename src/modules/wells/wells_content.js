// FoE Wells Highlighter — content script

(function () {
  'use strict';

  if (window._foeWellsInjected) return;
  window._foeWellsInjected = true;

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('src/modules/wells/wells_page.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);

})();

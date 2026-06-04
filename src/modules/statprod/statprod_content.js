// StatProd — content script
// Инжектирует statprod_page.js и слушает сообщения STATPROD_OPEN / STATBATTLE_OPEN

(function () {
  'use strict';

  if (window._foeStatProdInjected) return;
  window._foeStatProdInjected = true;

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('src/modules/statprod/statprod_page.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (!event.data || !event.data.payload) return;

    if (event.data.type === 'STATPROD_OPEN') {
      chrome.storage.session.set({ statProdData: event.data.payload }).then(() => {
        // storage устанавливается здесь — не работает, делаем через background
      });
      chrome.runtime.sendMessage({ action: 'openStatProd', data: event.data.payload });
    }

    if (event.data.type === 'STATBATTLE_OPEN') {
      chrome.runtime.sendMessage({ action: 'openStatBattle', data: event.data.payload });
    }
  });

})();

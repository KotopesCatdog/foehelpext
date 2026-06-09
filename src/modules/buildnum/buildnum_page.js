// BuildNum — page script
// Вставляет кнопку в заголовок окна citymap (FoE Helper), левее существующих кнопок

(function () {
  'use strict';

  if (window._foeBuildNumLoaded) return;
  window._foeBuildNumLoaded = true;

  const lang = (navigator.language || 'ru').startsWith('ru') ? 'ru' : 'en';
  const btnText  = lang === 'ru' ? '🏘 Постройки'              : '🏘 Buildings';
  const btnTitle = lang === 'ru' ? 'Подсчёт построек в городе' : 'Count buildings in the city';

  function addBuildNumButton() {
    const header = document.querySelector('#citymap-mainHeader');
    if (!header) return false;
    if (document.getElementById('foe-buildnum-btn')) return true;

    const btn = document.createElement('div');
    btn.id        = 'foe-buildnum-btn';
    btn.textContent = btnText;
    btn.title     = btnTitle;

    btn.style.cssText = `
      position: relative;
      padding: 0 12px;
      height: 22px;
      background: #1a3a1a;
      border: 1px solid #5f5;
      border-radius: 3px;
      color: #5f5;
      font-size: 11px;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
      font-family: Arial, sans-serif;
      white-space: nowrap;
      z-index: 100;
      margin-right: 4px;
    `;

    btn.onmouseenter = () => btn.style.background = '#254025';
    btn.onmouseleave = () => btn.style.background = '#1a3a1a';

    btn.onclick = e => {
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('FOEhelp_openBuildNum'));
    };

    // Вставляем перед блоком кнопок хелпера (правее заголовка, левее иконок)
    const buttonsContainer = header.querySelector('.box-buttons');
    header.insertBefore(btn, buttonsContainer);

    return true;
  }

  let attempts = 0;
  const interval = setInterval(() => {
    if (addBuildNumButton()) {
      clearInterval(interval);
    } else if (attempts++ > 30) {
      clearInterval(interval);
    }
  }, 500);

  const observer = new MutationObserver(() => {
    if (document.querySelector('#citymap-mainHeader')) {
      addBuildNumButton();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();

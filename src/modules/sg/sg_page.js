// SG Titan Calculator — page script
// Вставляет кнопку в заголовок окна OwnPartBox (FoE Helper)
// и открывает страницу vstitan.html в новой вкладке

(function () {
  'use strict';

  if (window._foeSgPageLoaded) return;
  window._foeSgPageLoaded = true;

  /* ── Определение языка ── */
  const getLanguage = () => {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('ru') ? 'ru' : 'en';
  };

  const currentLang = getLanguage();

  /* ── Тексты кнопки ── */
  const uiTexts = {
    ru: {
      buttonText:  'Калькулятор ВС Титана',
      buttonTitle: 'Открыть калькулятор вложений в титанов'
    },
    en: {
      buttonText:  'Saturn Gate Calculator',
      buttonTitle: 'Open titan investment calculator'
    }
  };

  const t = uiTexts[currentLang];

  /* ── Стиль кнопки (в тон medal-кнопке) ── */
  const css = `
    #OwnPartBox-sg-btn {
      background: #1a6b8a;
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
    #OwnPartBox-sg-btn:hover { background: #228aaf; }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = 'sg-btn-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── Открытие страницы через CustomEvent → content script → background ── */
  function openTitanPage() {
    window.dispatchEvent(new CustomEvent('FOEhelp_openSgTitan'));
  }

  /* ── Вставка кнопки в заголовок OwnPartBox ── */
  function injectButton() {
    if (document.getElementById('OwnPartBox-sg-btn')) return;
    const buttons = document.getElementById('OwnPartBoxButtons');
    if (!buttons) return;

    const btn = document.createElement('button');
    btn.id          = 'OwnPartBox-sg-btn';
    btn.textContent = t.buttonText;
    btn.title       = t.buttonTitle;
    btn.addEventListener('click', openTitanPage);
    buttons.insertBefore(btn, buttons.firstChild);
  }

  /* ── MutationObserver: ждём появления окна OwnPartBox ── */
  const observer = new MutationObserver(() => {
    if (document.getElementById('OwnPartBoxButtons')) {
      injectButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // На случай если окно уже есть в DOM в момент загрузки скрипта
  injectButton();

})();

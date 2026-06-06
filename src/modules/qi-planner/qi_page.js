// qi_page.js — добавляет кнопку квантового планировщика в интерфейс игры

(function () {
    'use strict';

    if (window._foeQiPlannerLoaded) return;
    window._foeQiPlannerLoaded = true;

    function addQiPlannerButton() {
        const header = document.querySelector('#citymap-mainHeader');
        const buttonsContainer = document.querySelector('#citymap-mainButtons');

        if (!header || !buttonsContainer) return false;
        if (document.getElementById('foe-qi-planner-btn')) return true;

        const btn = document.createElement('div');
        btn.id = 'foe-qi-planner-btn';
        btn.textContent = 'QI-Plan';
        btn.title = 'Скопировать данные города и открыть планировщик квантов';

        btn.style.cssText = `
            position: relative;
            padding: 0 12px;
            height: 22px;
            background: #1a2e40;
            border: 1px solid #00cfff;
            border-radius: 3px;
            color: #00cfff;
            font-size: 11px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
            font-family: Arial, sans-serif;
            white-space: nowrap;
            z-index: 100;
        `;

        btn.onmouseenter = () => btn.style.background = '#2a3e50';
        btn.onmouseleave = () => btn.style.background = '#1a2e40';

        btn.onclick = (e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent('foeOpenQiPlanner'));
        };

        // Вставляем перед блоком кнопок хелпера
        header.insertBefore(btn, buttonsContainer);

        return true;
    }

    let attempts = 0;
    const interval = setInterval(() => {
        if (addQiPlannerButton()) clearInterval(interval);
        else if (attempts++ > 30) clearInterval(interval);
    }, 500);

    const observer = new MutationObserver(() => {
        if (document.querySelector('#citymap-mainButtons')) addQiPlannerButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

// Альтернативный вариант с оберткой
(function () {
    'use strict';

    if (window._foePlannerLoaded) return;
    window._foePlannerLoaded = true;

    function addPlannerButton() {
        const buttonsContainer = document.querySelector('#citymap-mainButtons');
        
        if (!buttonsContainer) return false;
        if (document.getElementById('foe-planner-btn')) return true;

        // Создаём кнопку как div для лучшего контроля
        const btn = document.createElement('div');
        btn.id = 'foe-planner-btn';
        btn.textContent = 'FOEhelp-Plan';
        btn.title = 'Скопировать данные города и открыть планировщик';
        
        btn.style.cssText = `
            position: relative;
            float: left;
            padding: 0 12px;
            height: 22px;
            background: #2a1e40;
            border: 1px solid #ffd700;
            border-radius: 3px;
            color: #ffd700;
            font-size: 11px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
            font-family: Arial, sans-serif;
            white-space: nowrap;
            z-index: 100;
        `;

        btn.onmouseenter = () => btn.style.background = '#3a2e50';
        btn.onmouseleave = () => btn.style.background = '#2a1e40';
        
        btn.onclick = (e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent('foeOpenCityPlanner'));
        };

        // Очищаем контейнер от float
        const originalFloat = buttonsContainer.style.cssFloat;
        buttonsContainer.style.cssFloat = 'none';
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.flexDirection = 'row-reverse';
        
        // Вставляем в начало
        buttonsContainer.appendChild(btn);
        
        return true;
    }

    let attempts = 0;
    const interval = setInterval(() => {
        if (addPlannerButton()) {
            clearInterval(interval);
        } else if (attempts++ > 30) {
            clearInterval(interval);
        }
    }, 500);

    const observer = new MutationObserver(() => {
        if (document.querySelector('#citymap-mainButtons')) {
            addPlannerButton();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
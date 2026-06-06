/*
 * FOEhelp — telegram_content.js
 */

(function () {
    'use strict';

    // Инжектируем telegram.js в page context
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('src/modules/telegram/telegram.js');
    (document.head || document.documentElement).appendChild(s);

    // ----------------------------------------------------------------
    // GBG Box — наблюдатель
    // ----------------------------------------------------------------
    // Флаг защиты от рекурсии: injectButtons/applyAttritionBadges меняют DOM,
    // что само по себе триггерит этот же observer — без флага бесконечный цикл.
    let _observerBusy = false;
    const observer = new MutationObserver(() => {
        if (_observerBusy) return;
        const gbgOpen = !!document.getElementById('LiveGildFightingBody');
        if (!gbgOpen) {
            window.dispatchEvent(new CustomEvent('foehelp_tg_attrition_stop'));
            return;
        }
        _observerBusy = true;
        try {
            injectGear();
            injectButtons();
            window.dispatchEvent(new CustomEvent('foehelp_tg_attrition_start'));
        } finally {
            _observerBusy = false;
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ----------------------------------------------------------------
    // GBG: Шестерёнка
    // ----------------------------------------------------------------
    function injectGear() {
        if (document.getElementById('tg-settings-gear')) return;

        const buttons = document.getElementById('LiveGildFightingButtons');
        if (!buttons) return;

        const gear = document.createElement('span');
        gear.id = 'tg-settings-gear';
        gear.title = 'Telegram settings';
        gear.textContent = '✈️';
        gear.style.cssText = 'cursor:pointer; font-size:14px; margin-right:6px; opacity:0.75; transition:opacity 0.2s; vertical-align:middle;';

        gear.addEventListener('click', (e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent('foehelp_tg_settings'));
        });

        buttons.insertBefore(gear, buttons.firstChild);
    }

    // ----------------------------------------------------------------
    // GBG: Кнопки в таблице
    // ----------------------------------------------------------------
    function injectButtons() {
        document.querySelectorAll('#nextup tr[data-id]').forEach(tr => {
            if (tr.querySelector('.tg-sector')) return;

            const provinceId = tr.dataset.id;
            const btn = document.createElement('button');
            btn.className = 'btn btn-slim tg-sector';
            btn.title = 'Send to Telegram';
            btn.textContent = '✈️';
            btn.style.visibility = 'hidden';

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent('foehelp_tg_send_sector', {
                    detail: { id: parseInt(provinceId) }
                }));
            });

            tr.addEventListener('mouseenter', () => btn.style.visibility = 'visible');
            tr.addEventListener('mouseleave', () => btn.style.visibility = 'hidden');

            let targetTd = tr.querySelector('td .btn-group')?.closest('td') ||
                           Array.from(tr.querySelectorAll('td')).slice(-2)[0];

            if (targetTd) {
                let group = targetTd.querySelector('.btn-group');
                if (!group) {
                    group = document.createElement('div');
                    group.className = 'btn-group';
                    targetTd.appendChild(group);
                }
                group.appendChild(btn);
            }
        });

        // Bulk кнопка
        document.querySelectorAll('.btn.dcbutton.discord:not(.custom)').forEach(discordBtn => {
            if (discordBtn.nextElementSibling?.classList.contains('tg-bulk')) return;

            const btn = document.createElement('button');
            btn.className = 'btn btn-slim dcbutton tg-bulk';
            btn.title = 'Send selection to Telegram';
            btn.textContent = '✈️';
            btn.style.display = discordBtn.style.display;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent('foehelp_tg_send_bulk'));
            });

            discordBtn.insertAdjacentElement('afterend', btn);

            new MutationObserver(() => {
                btn.style.display = discordBtn.style.display;
            }).observe(discordBtn, { attributes: true, attributeFilter: ['style'] });
        });
    }

    // ----------------------------------------------------------------
    // GBG: Бейджи процента атрришена в строках таблицы
    // ----------------------------------------------------------------
    function applyAttritionBadges(data) {
        document.querySelectorAll('#nextup tr[data-id]').forEach(tr => {
            const id = parseInt(tr.dataset.id);
            const pct = data[id];

            const nameTd = tr.querySelector('td');
            if (!nameTd) return;
            nameTd.style.whiteSpace = 'nowrap';

            let badge = tr.querySelector('.tg-attrition-badge');

            if (pct == null) {
                // Нет данных — скрываем бейдж если был
                if (badge) badge.style.display = 'none';
                return;
            }

            let color, bg;
            if (pct >= 50) {
                color = '#ff4444'; bg = 'rgba(255,60,60,0.18)';
            } else if (pct >= 20) {
                color = '#ff9800'; bg = 'rgba(255,152,0,0.18)';
            } else {
                color = '#8bc34a'; bg = 'rgba(139,195,74,0.15)';
            }

            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'tg-attrition-badge';
                badge.style.cssText = `
                    display: inline-block;
                    font-size: 10px;
                    font-weight: bold;
                    border-radius: 3px;
                    padding: 0px 4px;
                    margin-left: 4px;
                    line-height: 16px;
                    vertical-align: middle;
                    white-space: nowrap;
                `;
                // Вставляем сразу после текстового элемента с названием сектора.
                // Ищем: сначала явный <span>/<a> с названием, иначе берём первый
                // текстовый узел непосредственно в td и оборачиваем его в <span>,
                // чтобы было куда вставить insertAdjacentElement.
                const nameEl = nameTd.querySelector('span.name, a.name, span:first-child, a:first-child')
                             || (() => {
                                 // Ищем первый непустой текстовый узел и оборачиваем
                                 for (const node of nameTd.childNodes) {
                                     if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                                         const wrap = document.createElement('span');
                                         wrap.className = 'tg-name-wrap';
                                         node.parentNode.insertBefore(wrap, node);
                                         wrap.appendChild(node);
                                         return wrap;
                                     }
                                 }
                                 return null;
                             })();

                if (nameEl) {
                    nameEl.insertAdjacentElement('afterend', badge);
                } else {
                    nameTd.appendChild(badge);
                }
            }

            // Обновляем только стиль и текст — не трогаем DOM-структуру
            badge.style.display = 'inline-block';
            badge.style.color = color;
            badge.style.background = bg;
            badge.style.border = `1px solid ${color}55`;
            badge.title = `Attrition: ${pct}%`;
            badge.textContent = `${pct}%🔥`;
        });
    }

    // Слушаем данные атрришена от page context
    window.addEventListener('foehelp_tg_attrition_data', (e) => {
        applyAttritionBadges(e.detail);
    });

    // ----------------------------------------------------------------
    // Infoboard
    // ----------------------------------------------------------------
    function injectInfoboardGear() {
        if (document.getElementById('tg-infoboard-gear')) return;
        const buttons = document.getElementById('BackgroundInfoButtons');
        if (!buttons) return;

        const gear = document.createElement('span');
        gear.id = 'tg-infoboard-gear';
        gear.title = 'Telegram / Discord settings';
        gear.textContent = '✈️';
        gear.style.cssText = 'cursor:pointer; font-size:14px; margin-right:6px; opacity:0.75; transition:opacity 0.2s; vertical-align:middle;';

        gear.addEventListener('click', (e) => {
            e.stopPropagation();
            window.postMessage({ type: 'foehelp_tg_infoboard_settings' }, '*');
        });

        buttons.insertBefore(gear, buttons.firstChild);
    }

    // Запуск observer'а Infoboard
    function startInfoboardObserver() {
        window.postMessage({ type: 'foehelp_tg_start_infoboard_observer' }, '*');
    }

    // Следим за появлением инфобокса
    const infoboxWatcher = new MutationObserver(() => {
        if (document.getElementById('BackgroundInfoButtons')) injectInfoboardGear();
        if (document.getElementById('BackgroundInfoList')) startInfoboardObserver();
    });
    infoboxWatcher.observe(document.body, { childList: true, subtree: true });


})();
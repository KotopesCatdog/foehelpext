/*
 * FOEhelp — telegram_content.js
 */

(function () {
    'use strict';

    // Инжектируем telegram.js в page context
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('telegram.js');
    (document.head || document.documentElement).appendChild(s);

    // ----------------------------------------------------------------
    // GBG Box — наблюдатель
    // ----------------------------------------------------------------
    const observer = new MutationObserver(() => {
        if (document.getElementById('LiveGildFightingBody')) {
            injectGear();
            injectButtons();
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
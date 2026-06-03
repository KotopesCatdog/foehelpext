/*
 * FOEhelp — telegram.js (page context)
 * Объект Telegram: настройки, отправка сообщений в бот
 */

let Telegram = {

    // Настройки сохраняются в localStorage — переживают перезапуск браузера
    StorageName: 'TelegramSettings',
    InfoboardStorageName: 'TelegramInfoboardSettings',

    // Основные настройки GBG
    botToken: '',
    chatIds: [], // Массив объектов { name: string, id: string }
    selectedChatIdIndex: 0, // Индекс выбранного чата для отправки GBG

    // Настройки Infoboard
    infoboardEnabled: false,
    infoboardFilter: ['auction', 'ge', 'gbg', 'qi', 'trade', 'level', 'msg'],
    infoboardBotToken: '',
    infoboardChatId: '', // Тут тоже поддерживаем множественные ID

    infoboardDiscordEnabled: false,
    infoboardDiscordWebhook: '',
    infoboardDiscordFilter: ['auction', 'ge', 'gbg', 'qi', 'trade', 'level', 'msg'],

    // ----------------------------------------------------------------
    // Init
    // ----------------------------------------------------------------
    init: () => {
        // Загружаем обычные настройки Telegram из localStorage
        const saved = JSON.parse(localStorage.getItem(Telegram.StorageName) || 'null');
        if (saved) {
            Telegram.botToken = saved.botToken || '';
            Telegram.chatIds = saved.chatIds || [];
            Telegram.selectedChatIdIndex = saved.selectedChatIdIndex || 0;
        }

        // Загружаем настройки Infoboard из localStorage
        const ibSaved = JSON.parse(localStorage.getItem(Telegram.InfoboardStorageName) || 'null');
        if (ibSaved) {
            Telegram.infoboardEnabled        = ibSaved.enabled !== undefined ? ibSaved.enabled : false;
            Telegram.infoboardFilter         = ibSaved.filter         || Telegram.infoboardFilter;
            Telegram.infoboardBotToken       = ibSaved.botToken       || '';
            Telegram.infoboardChatId         = ibSaved.chatId         || '';
            Telegram.infoboardDiscordEnabled = ibSaved.discordEnabled !== undefined ? ibSaved.discordEnabled : false;
            Telegram.infoboardDiscordWebhook = ibSaved.discordWebhook || '';
            Telegram.infoboardDiscordFilter  = ibSaved.discordFilter  || Telegram.infoboardDiscordFilter;
        }

        // Слушаем события от content script
        window.addEventListener('foehelp_tg_settings',    () => Telegram.buildSettingsPanel());
        window.addEventListener('foehelp_tg_send_sector', (e) => Telegram.sendGBGSector(e.detail.id));
        window.addEventListener('foehelp_tg_send_bulk',   () => Telegram.sendGBGSectors());
        window.addEventListener('foehelp_tg_infoboard', (e) => Telegram.handleInfoboardEvent(e.detail));

        // Слушаем postMessage от content script (для Infoboard)
        window.addEventListener('message', (e) => {
            if (e.data?.type === 'foehelp_tg_start_infoboard_observer') {
                Telegram.initInfoboardObserver();
            }
            if (e.data?.type === 'foehelp_tg_infoboard_settings') {
                Telegram.buildInfoboardSettingsPanel();
            }
        });
    },

    // ----------------------------------------------------------------
    // GBG Settings Panel
    // ----------------------------------------------------------------
    buildSettingsPanel: () => {
        let existing = document.getElementById('TelegramSettingsPanel');
        if (existing) { existing.remove(); return; }

        const panel = document.createElement('div');
        panel.id = 'TelegramSettingsPanel';
        panel.style.cssText = `
            background: rgba(0,0,0,0.85);
            border-bottom: 1px solid rgba(255,255,255,0.15);
            padding: 8px 10px;
            font-size: 12px;
            position: relative;
            z-index: 10;
        `;

        panel.innerHTML = `
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                <label style="min-width:78px; color:#e6c619; font-size:11px;">⛄ Bot Token</label>
                <input id="tg-bot-token" type="password" placeholder="123456:ABC-DEF..."
                    value="${Telegram.botToken}" style="flex:1; font-size:11px; padding:3px 6px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); border-radius:3px; color:#eee;">
            </div>
            <div style="margin-bottom:6px;">
                <label style="display:block; color:#e6c619; font-size:11px; margin-bottom:4px;">💬 Chat IDs</label>
                <div id="tg-chat-list" style="margin-bottom:6px; max-height:200px; overflow-y:auto;">
                </div>
                <button id="tg-add-chat" type="button" style="font-size:10px; padding:2px 6px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:3px; color:#aaa; cursor:pointer;">+ Add Chat</button>
            </div>
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                <label style="min-width:78px; color:#e6c619; font-size:11px;">🎯 Send to</label>
                <select id="tg-selected-chat" style="flex:1; font-size:11px; padding:3px 6px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); border-radius:3px; color:#eee;">
                </select>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <button id="tg-save-btn" class="btn btn-green btn-slim">💾 Save</button>
                <button id="tg-test-btn" class="btn btn-slim">📨 Test</button>
                <a href="https://core.telegram.org/bots#how-do-i-create-a-bot" target="_blank" 
                   style="margin-left:auto; font-size:11px; color:rgba(255,255,255,0.4); border:1px solid rgba(255,255,255,0.15); border-radius:3px; padding:2px 6px; text-decoration:none;">?</a>
            </div>
        `;

        const header = document.getElementById('LiveGildFightingHeader');
        if (header) header.insertAdjacentElement('afterend', panel);
        else {
            const body = document.getElementById('LiveGildFightingBody');
            if (body) body.prepend(panel);
            else document.body.appendChild(panel);
        }

        // Обновляем списки
        Telegram.updateChatListUI(panel);
        Telegram.updateSelectUI(panel);

        // Добавляем обработчики
        panel.querySelector('#tg-save-btn').addEventListener('click', () => Telegram.saveSettings(panel));
        panel.querySelector('#tg-test-btn').addEventListener('click', () => Telegram.sendTest(panel));
        panel.querySelector('#tg-add-chat').addEventListener('click', () => Telegram.addChatInput(panel));
    },

    updateChatListUI: (panel) => {
        const container = panel.querySelector('#tg-chat-list');
        if (!container) return;

        if (Telegram.chatIds.length === 0) {
            container.innerHTML = '<div style="font-size:10px; color:#666; padding:4px;">No chats configured. Click "Add Chat" to add one.</div>';
            return;
        }
        
        container.innerHTML = Telegram.chatIds.map((chat, idx) => `
            <div class="tg-chat-item" data-index="${idx}" style="display:flex; gap:4px; margin-bottom:4px; align-items:center;">
                <input type="text" placeholder="Name (e.g., Guild Chat)" value="${Telegram.escapeHtml(chat.name || '')}" 
                       style="flex:1; font-size:10px; padding:2px 4px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); border-radius:3px; color:#eee;">
                <input type="text" placeholder="Chat ID (-100...)" value="${Telegram.escapeHtml(chat.id || '-100')}" 
                       style="flex:2; font-size:10px; padding:2px 4px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); border-radius:3px; color:#eee;">
                <button class="tg-remove-chat" data-index="${idx}" style="background:rgba(255,80,80,0.3); border:1px solid rgba(255,80,80,0.5); border-radius:3px; color:#ff8888; cursor:pointer; padding:2px 6px; font-size:10px;">✖</button>
            </div>
        `).join('');

        // Добавляем обработчики удаления
        container.querySelectorAll('.tg-remove-chat').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                Telegram.removeChat(index);
            });
        });

        // Добавляем обработчики изменения полей ввода
        container.querySelectorAll('.tg-chat-item input').forEach((input, i) => {
            input.addEventListener('change', () => {
                const item = input.closest('.tg-chat-item');
                const idx = parseInt(item.dataset.index);
                const nameInput = item.querySelector('input:first-child');
                const idInput = item.querySelector('input:last-child');
                if (Telegram.chatIds[idx]) {
                    Telegram.chatIds[idx].name = nameInput.value;
                    Telegram.chatIds[idx].id = idInput.value;
                    Telegram.updateSelectUI(panel);
                }
            });
        });
    },

    updateSelectUI: (panel) => {
        const select = panel.querySelector('#tg-selected-chat');
        if (!select) return;

        if (Telegram.chatIds.length === 0) {
            select.innerHTML = '<option disabled>No chats configured</option>';
            select.disabled = true;
        } else {
            select.innerHTML = Telegram.chatIds.map((chat, idx) => 
                `<option value="${idx}" ${idx === Telegram.selectedChatIdIndex ? 'selected' : ''}>${Telegram.escapeHtml(chat.name || 'Unnamed')} (${Telegram.escapeHtml(chat.id || '-100')})</option>`
            ).join('');
            select.disabled = false;
            
            // Удаляем старый обработчик, чтобы не навешивать много
            const newSelect = select.cloneNode(true);
            select.parentNode.replaceChild(newSelect, select);
            newSelect.addEventListener('change', (e) => {
                Telegram.selectedChatIdIndex = parseInt(e.target.value);
            });
            // Сохраняем ссылку на новый select в panel для будущих обновлений
            panel.querySelector('#tg-selected-chat').removeEventListener('change', () => {});
        }
    },

    removeChat: (index) => {
        if (index >= 0 && index < Telegram.chatIds.length) {
            Telegram.chatIds.splice(index, 1);
            if (Telegram.selectedChatIdIndex >= Telegram.chatIds.length) {
                Telegram.selectedChatIdIndex = Math.max(0, Telegram.chatIds.length - 1);
            }
            
            const panel = document.getElementById('TelegramSettingsPanel');
            if (panel) {
                Telegram.updateChatListUI(panel);
                Telegram.updateSelectUI(panel);
            }
        }
    },

    addChatInput: (panel) => {
        // Добавляем новый чат с ID по умолчанию "-100"
        Telegram.chatIds.push({ name: '', id: '-100' });
        Telegram.updateChatListUI(panel);
        Telegram.updateSelectUI(panel);
        
        // Автоматически выбираем новый чат в селекте
        Telegram.selectedChatIdIndex = Telegram.chatIds.length - 1;
        Telegram.updateSelectUI(panel);
    },

    saveSettings: (panel) => {
        Telegram.botToken = document.getElementById('tg-bot-token')?.value.trim() || '';
        
        // Синхронизируем данные из UI
        const chatItems = panel.querySelectorAll('.tg-chat-item');
        const newChatIds = [];
        
        chatItems.forEach(item => {
            const inputs = item.querySelectorAll('input');
            const name = inputs[0]?.value.trim() || '';
            let id = inputs[1]?.value.trim() || '';
            // Если ID пустой или только прочерк, ставим дефолтный -100
            if (!id || id === '' || id === '-') {
                id = '-100';
            }
            if (id && id !== '') { // Сохраняем все чаты, даже с -100
                newChatIds.push({ name: name || 'Unnamed', id: id });
            }
        });
        
        Telegram.chatIds = newChatIds;
        
        // Сохраняем выбранный индекс
        const selectedSelect = panel.querySelector('#tg-selected-chat');
        if (selectedSelect && selectedSelect.value) {
            Telegram.selectedChatIdIndex = parseInt(selectedSelect.value) || 0;
        }
        
        if (Telegram.selectedChatIdIndex >= Telegram.chatIds.length) {
            Telegram.selectedChatIdIndex = Telegram.chatIds.length - 1;
        }

        // Сохраняем в localStorage
        localStorage.setItem(Telegram.StorageName, JSON.stringify({
            botToken: Telegram.botToken,
            chatIds: Telegram.chatIds,
            selectedChatIdIndex: Telegram.selectedChatIdIndex
        }));

        const btn = panel.querySelector('#tg-save-btn');
        if (btn) {
            const t = btn.textContent;
            btn.textContent = '✅ Saved';
            setTimeout(() => btn.textContent = t, 1500);
        }
    },

    // Получить текущий выбранный chat ID для GBG
    getCurrentChatId: () => {
        if (Telegram.chatIds.length === 0) return '';
        const selected = Telegram.chatIds[Telegram.selectedChatIdIndex];
        return selected ? selected.id : '';
    },

    // ----------------------------------------------------------------
    // Infoboard Settings Panel
    // ----------------------------------------------------------------
    buildInfoboardSettingsPanel: () => {
        let existing = document.getElementById('TelegramInfoboardPanel');
        if (existing) { 
            existing.remove(); 
            return; 
        }

        const panel = document.createElement('div');
        panel.id = 'TelegramInfoboardPanel';
        panel.style.cssText = `
            background: rgba(0,0,0,0.85);
            border-bottom: 1px solid rgba(255,255,255,0.15);
            padding: 8px 10px;
            font-size: 12px;
            position: relative;
            z-index: 10;
        `;

        const filterLabels = { 
            auction:'💰 Аукцион', 
            ge:'⚔️ Экспедиция', 
            gbg:'🏰 ПБГ', 
            qi:'🔮 QI', 
            trade:'📊 Рынок', 
            level:'🏆 ВC', 
            msg:'💬 Сообщения' 
        };

        panel.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <label style="color:#e6c619; font-size:11px; min-width:130px;">✈️ Telegram авто-отправка</label>
                <label style="font-size:11px; display:flex; align-items:center; gap:4px; cursor:pointer;">
                    <input type="checkbox" id="tg-ib-enabled" ${Telegram.infoboardEnabled ? 'checked' : ''}>
                    включить
                </label>
            </div>
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                <label style="min-width:78px; color:#aaa; font-size:11px;">⛄ Bot Token</label>
                <input id="tg-ib-token" type="password" placeholder="оставьте пустым — использовать GBG-бот"
                    value="${Telegram.infoboardBotToken || ''}" 
                    style="flex:1; font-size:11px; padding:3px 6px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); border-radius:3px; color:#eee;">
            </div>
            <div style="display:flex; align-items:flex-start; gap:6px; margin-bottom:6px;">
                <label style="min-width:78px; color:#aaa; font-size:11px; margin-top:4px;">💬 Chat ID(s)</label>
                <div style="flex:1; display:flex; flex-direction:column; gap:2px;">
                    <input id="tg-ib-chatid" type="text" placeholder="оставьте пустым или введите через запятую"
                        value="${Telegram.infoboardChatId || '-100'}" 
                        style="width:100%; font-size:11px; padding:3px 6px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); border-radius:3px; color:#eee;">
                </div>
            </div>

            <div id="tg-ib-filters" style="display:flex; flex-wrap:wrap; gap:6px; margin:8px 0; ${Telegram.infoboardEnabled ? '' : 'opacity:0.4; pointer-events:none;'}">
                ${Object.entries(filterLabels).map(([k,v]) => `
                    <label style="font-size:11px; display:flex; align-items:center; gap:3px; cursor:pointer; white-space:nowrap;">
                        <input type="checkbox" class="tg-ib-filter" data-type="${k}" ${Telegram.infoboardFilter.includes(k) ? 'checked' : ''}>
                        ${v}
                    </label>
                `).join('')}
            </div>

            <div style="display:flex; gap:8px;">
                <button id="tg-ib-save" class="btn btn-green btn-slim">💾 Save</button>
                <button id="tg-ib-test" class="btn btn-slim">📨 Test</button>
            </div>
        `;

        const header = document.getElementById('BackgroundInfoHeader');
        if (header) {
            header.insertAdjacentElement('afterend', panel);
        }

        const enabledCb = panel.querySelector('#tg-ib-enabled');
        if (enabledCb) {
            enabledCb.addEventListener('change', function() {
                const filtersDiv = panel.querySelector('#tg-ib-filters');
                if (filtersDiv) {
                    filtersDiv.style.opacity = this.checked ? '1' : '0.4';
                    filtersDiv.style.pointerEvents = this.checked ? '' : 'none';
                }
            });
        }

        panel.querySelector('#tg-ib-save').addEventListener('click', () => Telegram.saveInfoboardSettings(panel));
        panel.querySelector('#tg-ib-test').addEventListener('click', () => Telegram.testInfoboardBot(panel));

        // Discord секция
        const dcSection = document.createElement('div');
        dcSection.style.cssText = 'border-top:1px solid rgba(255,255,255,0.1); margin-top:10px; padding-top:8px;';
        dcSection.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <label style="color:#7289da; font-size:11px; min-width:130px;">🔔 Discord авто-отправка</label>
                <label style="font-size:11px; display:flex; align-items:center; gap:4px; cursor:pointer;">
                    <input type="checkbox" id="dc-ib-enabled" ${Telegram.infoboardDiscordEnabled ? 'checked' : ''}>
                    включить
                </label>
            </div>
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                <label style="min-width:78px; color:#aaa; font-size:11px;">🔗 Webhook</label>
                <input id="dc-ib-webhook" type="text" placeholder="https://discord.com/api/webhooks/..."
                    value="${Telegram.infoboardDiscordWebhook || ''}" 
                    style="flex:1; font-size:11px; padding:3px 6px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); border-radius:3px; color:#eee;">
            </div>
            <div id="dc-ib-filters" style="display:flex; flex-wrap:wrap; gap:6px; margin:8px 0; ${Telegram.infoboardDiscordEnabled ? '' : 'opacity:0.4; pointer-events:none;'}">
                ${Object.entries(filterLabels).map(([k,v]) => `
                    <label style="font-size:11px; display:flex; align-items:center; gap:3px; cursor:pointer; white-space:nowrap;">
                        <input type="checkbox" class="dc-ib-filter" data-type="${k}" ${Telegram.infoboardDiscordFilter.includes(k) ? 'checked' : ''}>
                        ${v}
                    </label>
                `).join('')}
            </div>
            <div style="display:flex; gap:8px;">
                <button id="dc-ib-save" class="btn btn-slim" style="background:#4e5d94;">💾 Save Discord</button>
                <button id="dc-ib-test" class="btn btn-slim" style="background:#4e5d94;">📨 Test</button>
            </div>
        `;
        panel.appendChild(dcSection);

        panel.querySelector('#dc-ib-enabled').addEventListener('change', function() {
            const fDiv = panel.querySelector('#dc-ib-filters');
            if (fDiv) {
                fDiv.style.opacity = this.checked ? '1' : '0.4';
                fDiv.style.pointerEvents = this.checked ? '' : 'none';
            }
        });

        panel.querySelector('#dc-ib-save').addEventListener('click', () => Telegram.saveInfoboardSettings(panel));
        panel.querySelector('#dc-ib-test').addEventListener('click', () => Telegram.testInfoboardDiscord(panel));
    },

    saveInfoboardSettings: (panel) => {
        const tgEnabledEl = panel.querySelector('#tg-ib-enabled');
        if (tgEnabledEl) Telegram.infoboardEnabled = tgEnabledEl.checked;

        const tgFilterBoxes = panel.querySelectorAll('.tg-ib-filter:checked');
        if (tgFilterBoxes.length > 0 || panel.querySelector('.tg-ib-filter')) {
            Telegram.infoboardFilter = [...tgFilterBoxes].map(cb => cb.dataset.type);
        }

        const tgTokenEl = panel.querySelector('#tg-ib-token');
        if (tgTokenEl) Telegram.infoboardBotToken = tgTokenEl.value.trim();
        
        const tgChatIdEl = panel.querySelector('#tg-ib-chatid');
        if (tgChatIdEl) {
            let rawChatId = tgChatIdEl.value.trim();
            if (rawChatId === '-100' || rawChatId === '') rawChatId = '';
            Telegram.infoboardChatId = rawChatId;
        }

        const dcEnabledEl = panel.querySelector('#dc-ib-enabled');
        if (dcEnabledEl) Telegram.infoboardDiscordEnabled = dcEnabledEl.checked;

        const dcWebhookEl = panel.querySelector('#dc-ib-webhook');
        if (dcWebhookEl) Telegram.infoboardDiscordWebhook = dcWebhookEl.value.trim();

        const dcFilterBoxes = panel.querySelectorAll('.dc-ib-filter:checked');
        if (dcFilterBoxes.length > 0 || panel.querySelector('.dc-ib-filter')) {
            Telegram.infoboardDiscordFilter = [...dcFilterBoxes].map(cb => cb.dataset.type);
        }

        // Сохраняем в localStorage
        localStorage.setItem(Telegram.InfoboardStorageName, JSON.stringify({
            enabled:        Telegram.infoboardEnabled,
            filter:         Telegram.infoboardFilter,
            botToken:       Telegram.infoboardBotToken,
            chatId:         Telegram.infoboardChatId,
            discordEnabled: Telegram.infoboardDiscordEnabled,
            discordWebhook: Telegram.infoboardDiscordWebhook,
            discordFilter:  Telegram.infoboardDiscordFilter
        }));

        const activeBtn = document.activeElement;
        if (activeBtn && activeBtn.id.includes('save')) {
            const t = activeBtn.textContent;
            activeBtn.textContent = '✅ Saved';
            setTimeout(() => activeBtn.textContent = t, 1500);
        }
    },

    createGBGMessage: (sector) => {
        const timeAt  = moment.unix(sector.lockedUntil - 2);
        const timeStr = timeAt.format('HH:mm');
        const diffMin = Math.round((sector.lockedUntil - 2 - moment().unix()) / 60);
        const diff    = diffMin > 0 ? `(~${diffMin} min)` : '(now)';
        const color   = (GuildFights.showTileColors != 0) ? (sector.isAttackBattleType ? '🔴' : '🔵') : '';
        const attrition = sector.gainAttritionChance != null ? ` | ${sector.gainAttritionChance}%🔥` : '';
        const vp        = sector.victoryPoints ? ` | 🏆${sector.victoryPoints}${sector.victoryPointsBonus ? '+'+sector.victoryPointsBonus : ''}` : '';
        const guild     = (typeof GuildFights !== 'undefined' && GuildFights.showGuildColumn && sector.owner) ? ` | 🏰${sector.owner}` : '';

        return `${color} <b>${sector.title}</b> ⏰ ${timeStr} ${diff}${attrition}${vp}${guild}`;
    },

    sendGBGSector: (id) => {
        if (!Telegram.isConfigured()) { Telegram.warnNotConfigured(); return; }
        const sector = GuildFights.MapData.map.provinces.find(x => x.id === id);
        if (!sector) return;
        const msg = Telegram.createGBGMessage(sector) + `\n<i>— ${ExtPlayerName}</i>`;
        Telegram.sendMessage(msg).then(ok => Telegram.showToast(ok));
    },

    sendGBGSectors: () => {
        if (!Telegram.isConfigured()) { Telegram.warnNotConfigured(); return; }
        if (!GuildFights.discordCache?.length) return;
        const lines = GuildFights.discordCache.map(s => Telegram.createGBGMessage(s));
        const msg = lines.join('\n') + `\n<i>— ${ExtPlayerName}</i>`;
        Telegram.sendMessage(msg).then(ok => Telegram.showToast(ok));
    },

    sendTest: (panel) => {
        const token = document.getElementById('tg-bot-token')?.value.trim();
        const currentChatId = Telegram.getCurrentChatId();
        
        if (!token || !currentChatId) { 
            alert('Заполните Bot Token и хотя бы один Chat ID'); 
            return; 
        }

        const btn = panel.querySelector('#tg-test-btn');
        if (btn) btn.textContent = '⏳';

        Telegram.sendMessage('⛄ <b>FOEhelp</b> — Telegram test ✅', token, currentChatId)
            .then(ok => {
                if (btn) { 
                    btn.textContent = ok ? '✅ OK' : '❌ Error'; 
                    setTimeout(() => btn.textContent = '📨 Test', 2500); 
                }
            });
    },

    sendMessage: async (text, token, chatId) => {
        const t = token || Telegram.botToken;
        const targetId = chatId || Telegram.getCurrentChatId();
        
        if (!t || !targetId) return false;

        try {
            const res = await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: targetId, text, parse_mode: 'HTML' })
            });
            const json = await res.json();
            return json.ok === true;
        } catch (e) {
            console.error('[FOEhelp Telegram] Error sending message:', e);
            return false;
        }
    },

    sendMessageToMultiple: async (text, token, chatIdsString) => {
        const t = token || Telegram.botToken;
        if (!t || !chatIdsString) return false;

        const targetIds = chatIdsString.split(',').map(id => id.trim()).filter(id => id && id !== '-100');
        if (targetIds.length === 0) return false;

        let allOk = true;
        for (const c of targetIds) {
            try {
                const res = await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: c, text, parse_mode: 'HTML' })
                });
                const json = await res.json();
                if (json.ok !== true) allOk = false;
            } catch (e) {
                console.error(`[FOEhelp Telegram] Error sending to chat ${c}:`, e);
                allOk = false;
            }
        }
        return allOk;
    },

    sendDiscordMessage: async (url, text) => {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'FoE Helper', content: text })
            });
            return res.ok;
        } catch (e) {
            console.error('[FOEhelp Discord]', e);
            return false;
        }
    },

    testInfoboardBot: (panel) => {
        const token  = panel.querySelector('#tg-ib-token')?.value.trim() || Telegram.botToken;
        const chatId = panel.querySelector('#tg-ib-chatid')?.value.trim() || Telegram.getCurrentChatId();
        if (!token || !chatId || chatId === '-100') { alert('Заполните Bot Token и Chat ID'); return; }

        const btn = panel.querySelector('#tg-ib-test');
        if (btn) btn.textContent = '⏳';

        Telegram.sendMessageToMultiple('⛄ <b>FOEhelp Infoboard</b> — тест ✅', token, chatId)
            .then(ok => {
                if (btn) { 
                    btn.textContent = ok ? '✅ OK' : '❌ Error'; 
                    setTimeout(() => btn.textContent = '📨 Test', 2500); 
                }
            });
    },

    testInfoboardDiscord: (panel) => {
        const url = panel.querySelector('#dc-ib-webhook')?.value.trim();
        if (!url) { alert('Введите Discord Webhook'); return; }

        const btn = panel.querySelector('#dc-ib-test');
        if (btn) btn.textContent = '⏳';

        Telegram.sendDiscordMessage(url, '⛄ **FOEhelp Infoboard** — тест ✅')
            .then(ok => {
                if (btn) { 
                    btn.textContent = ok ? '✅ OK' : '❌ Error'; 
                    setTimeout(() => btn.textContent = '📨 Test', 2500); 
                }
            });
    },

    // ----------------------------------------------------------------
    // Обработка событий инфоборда (Автоматическая рассылка)
    // ----------------------------------------------------------------
    handleInfoboardEvent: (detail) => {
        const emojis = { auction:'💰', ge:'⚔️', gbg:'🏰', qi:'🔮', trade:'📊', level:'🏆', msg:'💬' };
        let emoji = emojis[detail.eventClass] || '📢';

        if (detail.text.includes('===') || detail.text.includes('<b>') || detail.eventClass.includes('msg')) {
            emoji = '💬';
        }
        
        const timeStr = detail.time ? ` [${detail.time}]` : '';

        // --- 1. Отправка в TELEGRAM ---
        if (Telegram.infoboardEnabled) {
            const isTgAllowed = Telegram.infoboardFilter.some(filterKey => detail.eventClass.includes(filterKey));
            
            if (isTgAllowed) {
                const tgToken  = Telegram.infoboardBotToken || Telegram.botToken;
                const tgChatId = Telegram.infoboardChatId   || Telegram.getCurrentChatId();

                if (tgToken && tgChatId) {
                    const htmlTime = detail.time ? ` <i>${detail.time}</i>` : '';
                    const tgMsg = `${emoji} ${detail.text}${htmlTime}`;

                    Telegram.sendMessageToMultiple(tgMsg, tgToken, tgChatId);
                }
            }
        }

        // --- 2. Отправка в DISCORD ---
        if (Telegram.infoboardDiscordEnabled) {
            const isDcAllowed = Telegram.infoboardDiscordFilter.some(filterKey => detail.eventClass.includes(filterKey));

            if (isDcAllowed) {
                const dcUrl = Telegram.infoboardDiscordWebhook;

                if (dcUrl) {
                    let markdownText = detail.text
                        .replace(/<\/?b>/g, '**')
                        .replace(/<\/?strong>/g, '**')
                        .replace(/<[^>]*>/g, '');

                    const dcMsg = `${emoji}${timeStr} ${markdownText}`;
                    Telegram.sendDiscordMessage(dcUrl, dcMsg);
                }
            }
        }
    },

    isConfigured: () => Telegram.botToken !== '' && Telegram.chatIds.length > 0 && Telegram.getCurrentChatId() !== '',

    warnNotConfigured: () => {
        const gear = document.getElementById('tg-settings-gear');
        if (gear) {
            gear.style.outline = '2px solid red';
            setTimeout(() => gear.style.outline = '', 2000);
        }
        Telegram.buildSettingsPanel();
    },

    showToast: (ok) => {
        if (typeof HTML !== 'undefined' && HTML.ShowToastMsg) {
            HTML.ShowToastMsg({
                show: 'force',
                head: ok ? 'Telegram' : 'Telegram Error',
                text: ok ? 'Message sent ✅' : 'Failed to send ❌',
                type: ok ? 'success' : 'error',
                hideAfter: 2500
            });
        }
    },

    escapeHtml: (str) => {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    },

    // ----------------------------------------------------------------
    // Infoboard Observer (в page context)
    // ----------------------------------------------------------------
    initInfoboardObserver: () => {
        const list = document.getElementById('BackgroundInfoList');
        if (!list) {
            console.warn('[TG] BackgroundInfoList not found');
            return;
        }
        if (list.dataset.tgObserved) return;

        list.dataset.tgObserved = 'true';

        new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1 || node.tagName !== 'LI') continue;
                    if (node.classList.contains('welcome') || node.style.display === 'none') continue;

                    const eventClass = (node.className || '').trim().split(/\s+/)[0];
                    const timeEl = node.querySelector('small em');
                    const timeStr = timeEl ? timeEl.textContent.trim() : '';
                    
                    let cleanText = '';
                    const mainDiv = node.querySelector('.main');
                    
                    if (mainDiv) {
                        const brightTitleEl = mainDiv.querySelector('strong.bright');
                        const hasLink = mainDiv.querySelector('a.external-link');
                        const hasSender = mainDiv.querySelector('.sender');
                        const contentEl = mainDiv.querySelector('.content');

                        const isChat = eventClass === 'msg' || brightTitleEl || (hasLink && contentEl);

                        if (isChat) {
                            let roomHeader = brightTitleEl ? brightTitleEl.innerText.trim() : '';
                            let playerName = '';

                            if (hasLink) {
                                const linkClone = hasLink.cloneNode(true);
                                const svg = linkClone.querySelector('svg');
                                if (svg) svg.remove();
                                playerName = linkClone.textContent.trim();
                            } else if (hasSender) {
                                playerName = hasSender.textContent.trim().replace(/:$/, '');
                            }

                            let messageBody = '';
                            if (contentEl) {
                                messageBody = contentEl.innerText.trim();
                            } else {
                                let textParts = [];
                                mainDiv.childNodes.forEach(child => {
                                    if (child.nodeType === 3) {
                                        textParts.push(child.textContent);
                                    } else if (child.nodeType === 1) {
                                        const tagName = child.tagName.toLowerCase();
                                        if (tagName !== 'small' && tagName !== 'strong' && tagName !== 'em') {
                                            textParts.push(child.innerText);
                                        }
                                    }
                                });
                                messageBody = textParts.join(' ').replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
                            }

                            messageBody = messageBody.replace(/^[\s:]+/, '').trim();

                            const formattedRoom = roomHeader ? `[${roomHeader}] ` : '';
                            if (playerName) {
                                cleanText = `${formattedRoom}<b>${playerName}</b>: ${messageBody}`;
                            } else {
                                cleanText = `${formattedRoom}${messageBody}`;
                            }

                        } else {
                            let rawText = mainDiv.innerText.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
                            if (timeStr && rawText.startsWith(timeStr)) {
                                rawText = rawText.substring(timeStr.length).trim();
                            }
                            cleanText = rawText;
                        }
                    }

                    if (cleanText) {
                        Telegram.handleInfoboardEvent({
                            eventClass: eventClass,
                            text: cleanText,
                            time: timeStr
                        });
                    }
                }
            }
        }).observe(list, { childList: true, subtree: false });
    },
};

// Автозапуск
setTimeout(() => Telegram.init(), 800);
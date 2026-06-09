const LINKS_URL = 'https://foehelp.ru/links-db.json';

// Временное хранилище данных в памяти (вместо session storage)
const pendingData = {};

function updateBadge(hasUpdate) {
    if (hasUpdate) {
        const badgeText = chrome.i18n.getMessage('newVersion') || 'NEW';
        chrome.action.setBadgeText({ text: badgeText });
        chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    } else {
        chrome.action.setBadgeText({ text: '' });
    }
}

function isNewerVersion(latest, current) {
    const a = latest.split('.').map(Number);
    const b = current.split('.').map(Number);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const x = a[i] || 0;
        const y = b[i] || 0;
        if (x > y) return true;
        if (x < y) return false;
    }
    return false;
}

async function checkForUpdates() {
    try {
        const response = await fetch(LINKS_URL, { cache: 'no-cache' });
        if (!response.ok) return;
        const data = await response.json();
        const currentVersion = chrome.runtime.getManifest().version;
        if (data.version && isNewerVersion(data.version, currentVersion)) {
            await chrome.storage.local.set({
                updateAvailable: true,
                latestVersion: data.version,
                updateUrl: data.chrome_extension || 'https://foehelp.ru/'
            });
            updateBadge(true);
        } else {
            await chrome.storage.local.set({ updateAvailable: false });
            updateBadge(false);
        }
    } catch (err) {
        console.error('Error checking for updates:', err);
    }
}

chrome.storage.local.get(['updateAvailable'], (result) => {
    if (result.updateAvailable) updateBadge(true);
});

chrome.runtime.onInstalled.addListener(() => { checkForUpdates(); });
chrome.runtime.onStartup.addListener(() => { checkForUpdates(); });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openCityPlanner') {
        const url = chrome.runtime.getURL('cityplan.html');
        chrome.tabs.create({ url: url });
        sendResponse({ success: true });
        return true;
    }

    if (request.action === 'openStatProd') {
        const url = chrome.runtime.getURL('src/modules/statprod/index.html');
        chrome.tabs.create({ url: url }, (tab) => {
            pendingData[tab.id] = { key: 'statProdData', data: request.data };
        });
        sendResponse({ success: true });
        return true;
    }

    if (request.action === 'openStatBattle') {
        const url = chrome.runtime.getURL('src/modules/statbattle/indexst.html');
        chrome.tabs.create({ url: url }, (tab) => {
            pendingData[tab.id] = { key: 'statBattleData', data: request.data };
        });
        sendResponse({ success: true });
        return true;
    }

    // Страница запрашивает свои данные по tabId
    if (request.action === 'getData') {
        const entry = pendingData[sender.tab.id];
        if (entry) {
            delete pendingData[sender.tab.id];
            sendResponse({ success: true, key: entry.key, data: entry.data });
        } else {
            sendResponse({ success: false });
        }
        return true;
    }
	if (request.action === 'openSgTitan') {
    const url = chrome.runtime.getURL('src/modules/sg/vstitan.html');
    chrome.tabs.create({ url: url });
    sendResponse({ success: true });
    return true;
}
if (request.action === 'openBuildNum') {
    const url = chrome.runtime.getURL('src/modules/buildnum/zdan.html');
    chrome.tabs.create({ url: url }, (tab) => {
        pendingData[tab.id] = { key: 'buildNumData', data: request.data };
    });
    sendResponse({ success: true });
    return true;
}
});

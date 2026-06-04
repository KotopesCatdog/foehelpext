const LINKS_URL = 'https://foehelp.ru/links-db.json';

function updateBadge(hasUpdate) {
    if (hasUpdate) {
        const badgeText = chrome.i18n.getMessage('newVersion') || 'NEW';
        chrome.action.setBadgeText({ text: badgeText });
        chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    } else {
        chrome.action.setBadgeText({ text: '' });
    }
}

async function checkForUpdates() {
    try {
        const response = await fetch(LINKS_URL, { cache: 'no-cache' });
        if (!response.ok) return;
        const data = await response.json();
        const currentVersion = chrome.runtime.getManifest().version;
        if (data.version && data.version !== currentVersion) {
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
        chrome.storage.session.set({ statProdData: request.data }).then(() => {
            const url = chrome.runtime.getURL('src/modules/statprod/index.html');
            chrome.tabs.create({ url: url });
        });
        sendResponse({ success: true });
        return true;
    }

    if (request.action === 'openStatBattle') {
        chrome.storage.session.set({ statBattleData: request.data }).then(() => {
            const url = chrome.runtime.getURL('src/modules/statbattle/indexst.html');
            chrome.tabs.create({ url: url });
        });
        sendResponse({ success: true });
        return true;
    }
});

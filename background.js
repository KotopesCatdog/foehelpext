const LINKS_URL = 'https://foehelp.ru/links-db.json';

// Функция обновления значка (Badge)
function updateBadge(hasUpdate) {
    if (hasUpdate) {
        const badgeText = chrome.i18n.getMessage('newVersion') || 'NEW';
        chrome.action.setBadgeText({ text: badgeText });
        chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    } else {
        chrome.action.setBadgeText({ text: '' });
    }
}

// Функция проверки версии
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

// Инициализация значка при запуске Service Worker
chrome.storage.local.get(['updateAvailable'], (result) => {
    if (result.updateAvailable) {
        updateBadge(true);
    }
});

// Проверка при установке или обновлении
chrome.runtime.onInstalled.addListener(() => {
    checkForUpdates();
});

// Проверка при запуске браузера
chrome.runtime.onStartup.addListener(() => {
    checkForUpdates();
});

// Обработчик сообщений
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openCityPlanner') {
        const url = chrome.runtime.getURL('cityplan.html');
        chrome.tabs.create({ url: url });
        sendResponse({ success: true });
        return true;
    }
});
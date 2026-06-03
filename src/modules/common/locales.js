// Локализация интерфейса
const i18n = {
    currentLocale: 'ru',
    
    init: function() {
        this.currentLocale = chrome.i18n.getMessage('@@ui_locale') || 'en';
        this.translatePage();
        
        const manifest = chrome.runtime.getManifest();
        const titleElement = document.getElementById('extensionTitle');
        if (titleElement) {
            titleElement.textContent = `${chrome.i18n.getMessage('extName')} v${manifest.version}`;
        }
    },
    
    translatePage: function() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                if (element.tagName === 'BUTTON' || element.tagName === 'SPAN') {
                    const originalText = element.innerHTML;
                    const emojiMatch = originalText.match(/^[\s]*[\u{1F300}-\u{1F9FF}][\s]*/u);
                    if (emojiMatch) {
                        element.innerHTML = emojiMatch[0] + ' ' + message;
                    } else {
                        element.textContent = message;
                    }
                } else {
                    element.textContent = message;
                }
            }
        });
        
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.title = message;
            }
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.placeholder = message;
            }
        });
    },
    
    getMessage: function(key, substitutions = null) {
        return chrome.i18n.getMessage(key, substitutions);
    },
    
    updateStatus: function(element, key, substitutions = null) {
        if (element) {
            let message = this.getMessage(key, substitutions);
            if (message) {
                element.textContent = message;
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});
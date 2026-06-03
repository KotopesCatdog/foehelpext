// Локализация интерфейса
const i18n = {
    currentLocale: 'ru', // будет определено автоматически
    
    // Загрузка переводов из Chrome i18n API
    init: function() {
        // Получаем язык браузера/расширения
        this.currentLocale = chrome.i18n.getMessage('@@ui_locale') || 'en';
        
        // Переводим все элементы с data-i18n атрибутом
        this.translatePage();
        
        // Обновляем заголовок с версией
        const manifest = chrome.runtime.getManifest();
        const titleElement = document.getElementById('extensionTitle');
        if (titleElement) {
            titleElement.textContent = `${chrome.i18n.getMessage('extName')} v${manifest.version}`;
        }
    },
    
    // Перевод страницы
    translatePage: function() {
        // Переводим textContent элементов с data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                // Сохраняем эмодзи и специальные символы
                if (element.tagName === 'BUTTON' || element.tagName === 'SPAN') {
                    // Для кнопок сохраняем эмодзи
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
        
        // Переводим title атрибуты
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.title = message;
            }
        });
        
        // Переводим placeholder атрибуты (если есть)
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.placeholder = message;
            }
        });
    },
    
    // Получить локализованное сообщение с подстановкой параметров
    getMessage: function(key, substitutions = null) {
        return chrome.i18n.getMessage(key, substitutions);
    },
    
    // Обновить статус с подстановкой
    updateStatus: function(element, key, substitutions = null) {
        if (element) {
            let message = this.getMessage(key, substitutions);
            if (message) {
                element.textContent = message;
            }
        }
    }
};

// Автоматическая инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});
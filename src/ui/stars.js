// stars.js - падающие эмодзи без фона
function createStarField() {
    const container = document.getElementById('starField');
    if (!container) return;
    container.innerHTML = '';

    const emojis = ['⛄'];
    const emojiCount = 15;

    for (let i = 0; i < emojiCount; i++) {
        const fallingEmoji = document.createElement('div');
        fallingEmoji.classList.add('star');
        fallingEmoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Размер
        const size = Math.random() * 0.9 + 0.1;
        fallingEmoji.style.fontSize = size + 'rem';
        fallingEmoji.style.left = Math.random() * 100 + '%';
        
        // Длительность полёта
        const duration = Math.random() * 4 + 3;
        
        // Случайная задержка от 0 до длительности полёта
        // Чтобы эмодзи были не только сверху, но уже где-то в середине или снизу
        const delay = Math.random() * duration * -1; // отрицательная задержка
        
        const drift = (Math.random() - 0.5) * 80;
        
        fallingEmoji.style.animation = `flyStar ${duration}s linear infinite`;
        fallingEmoji.style.animationDelay = `${delay}s`;
        fallingEmoji.style.setProperty('--drift', drift + 'px');
        
        // Прозрачность для плавности
        const opacity = Math.random() * 0.6 + 0.4;
        fallingEmoji.style.opacity = opacity;
        
        container.appendChild(fallingEmoji);
    }
}

document.addEventListener('DOMContentLoaded', createStarField);
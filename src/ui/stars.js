// stars.js - анимация звёздного фона
function createStarField() {
    const container = document.getElementById('starField');
    if (!container) return;
    container.innerHTML = '';
    const starCount = 70;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        
        const duration = Math.random() * 2 + 1.2;
        const delay = Math.random() * 5;
        const drift = (Math.random() - 0.5) * 80;
        
        star.style.animation = `flyStar ${duration}s linear infinite`;
        star.style.animationDelay = `${delay}s`;
        star.style.setProperty('--drift', drift + 'px');
        
        const brightness = Math.random() * 0.5 + 0.4;
        star.style.backgroundColor = `rgba(255, 240, 200, ${brightness})`;
        
        container.appendChild(star);
    }
}

document.addEventListener('DOMContentLoaded', createStarField);
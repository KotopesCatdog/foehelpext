document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('grid');
    const tooltip = document.getElementById('tooltip');
    const roadResult = document.getElementById('road-result');
    const totalCells = 72 * 72;

    const areas = [
        { colStart: 1, colEnd: 16, rowStart: 1, rowEnd: 8, color: '#ccc' },
        { colStart: 1, colEnd: 8, rowStart: 9, rowEnd: 24, color: '#ccc' },
        { colStart: 61, colEnd: 72, rowStart: 1, rowEnd: 8, color: '#ccc' },
        { colStart: 69, colEnd: 72, rowStart: 9, rowEnd: 24, color: '#ccc' },
        { colStart: 69, colEnd: 72, rowStart: 37, rowEnd: 72, color: '#ccc' },
        { colStart: 65, colEnd: 72, rowStart: 59, rowEnd: 64, color: '#ccc' },
        { colStart: 57, colEnd: 72, rowStart: 65, rowEnd: 72, color: '#ccc' },
        { colStart: 65, colEnd: 68, rowStart: 57, rowEnd: 61, color: '#ccc' },
        { colStart: 1, colEnd: 8, rowStart: 65, rowEnd: 72, color: '#ccc' },
        { colStart: 9, colEnd: 16, rowStart: 68, rowEnd: 72, color: '#ccc' }
    ];

    let boundaryState = 0;
    let isDrawing = false;

    // ==================== СОЗДАНИЕ СЕТКИ ====================
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        const row = Math.floor(i / 72) + 1;
        const col = (i % 72) + 1;
        const isThickCol = col % 4 === 0 && col <= 68;
        const isThickRow = row % 4 === 0 && row <= 68;

        if (isThickCol && isThickRow) cell.classList.add('thick-both');
        else if (isThickCol) cell.classList.add('thick-right');
        else if (isThickRow) cell.classList.add('thick-bottom');

        areas.forEach(area => {
            if (col >= area.colStart && col <= area.colEnd && row >= area.rowStart && row <= area.rowEnd) {
                if (!(col === 68 && row >= 9 && row <= 24) && !(row === 68 && col >= 9 && col <= 16)) {
                    cell.style.backgroundColor = area.color;
                }
            }
        });
        grid.appendChild(cell);
    }

    // ==================== ВСЕ ФУНКЦИИ ====================
    function placeFigures() {
        document.querySelectorAll('.figure').forEach(f => f.remove());
        const input = document.getElementById('data-input').value.trim();
        const lines = input.split('\n').filter(l => l.trim() !== '');

        lines.forEach(line => {
            const data = line.split('\t');
            if (data.length < 4) return;
            const [width, height, x, y, name, colorCode] = data;

            const figure = document.createElement('div');
            figure.classList.add('figure');
            if (name && name.includes('Ратуша')) figure.classList.add('ratusha');

            figure.style.width = `${parseInt(width) * 20}px`;
            figure.style.height = `${parseInt(height) * 20}px`;
            figure.style.left = `${parseInt(x) * 20}px`;
            figure.style.top = `${parseInt(y) * 20}px`;
            figure.dataset.name = name || '';

            const colorMap = {'1':'gray','2':'yellow','3':'blue','4':'red','5':'green','6':'light-green'};
            figure.classList.add(colorMap[colorCode] || colorCode || 'default-color');

            const text = document.createElement('div');
            text.textContent = (name || '').substring(0, Math.floor(parseInt(width)*20/8));
            figure.appendChild(text);

            figure.addEventListener('click', e => {
                tooltip.textContent = name || '';
                tooltip.style.display = 'block';
                tooltip.style.left = `${e.clientX + 10}px`;
                tooltip.style.top = `${e.clientY + 10}px`;
            });
            figure.addEventListener('mouseleave', () => tooltip.style.display = 'none');

            grid.appendChild(figure);
            addDragHandlers(figure);
        });
    }

    function createFigure() {
        const height = parseInt(document.getElementById('height-select').value);
        const width = parseInt(document.getElementById('width-select').value);
        const color = document.getElementById('color-select').value || 'default-color';
        const name = document.getElementById('figure-name-input').value.trim() || "Здание";

        const figure = document.createElement('div');
        figure.classList.add('figure', color);
        if (name.includes('Ратуша')) figure.classList.add('ratusha');

        figure.style.width = `${width * 20}px`;
        figure.style.height = `${height * 20}px`;
        figure.style.left = '80px';
        figure.style.top = '80px';
        figure.dataset.name = name;

        const text = document.createElement('div');
        text.textContent = name.substring(0, Math.floor(width * 20 / 8));
        figure.appendChild(text);

        grid.appendChild(figure);
        addDragHandlers(figure);
    }

    function addDragHandlers(figure) {
        let isDragging = false, offsetX, offsetY;
        figure.addEventListener('mousedown', e => {
            isDragging = true;
            offsetX = e.clientX - figure.offsetLeft;
            offsetY = e.clientY - figure.offsetTop;
            figure.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            figure.style.left = `${Math.max(0, e.clientX - offsetX)}px`;
            figure.style.top = `${Math.max(0, e.clientY - offsetY)}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                figure.style.left = `${Math.round(figure.offsetLeft / 20) * 20}px`;
                figure.style.top = `${Math.round(figure.offsetTop / 20) * 20}px`;
            }
            isDragging = false;
            figure.style.cursor = 'grab';
        });
    }

    function resetFigures() {
        document.querySelectorAll('.figure').forEach(f => f.remove());
        placeDefaultRatusha();
    }

    function placeDefaultRatusha() {
        const figure = document.createElement('div');
        figure.classList.add('figure', 'yellow', 'ratusha');
        figure.style.width = '120px';
        figure.style.height = '140px';
        figure.style.left = '160px';
        figure.style.top = '160px';
        figure.dataset.name = 'Ратуша';
        figure.innerHTML = '<div>Ратуша</div>';
        grid.appendChild(figure);
        addDragHandlers(figure);
    }

    function toggleBoundaryMode() {
        boundaryState = (boundaryState + 1) % 3;
        const btn = document.getElementById('btnBoundary');
        btn.textContent = boundaryState === 1 ? '🟩 Рисовать' : boundaryState === 2 ? '🟥 Стирать' : 'Границы';
    }

    function startDrawing(e) {
        if (boundaryState === 0) return;
        isDrawing = true;
        drawBoundary(e);
    }

    function drawBoundary(e) {
        if (!isDrawing) return;
        const rect = grid.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / 20) * 20;
        const y = Math.floor((e.clientY - rect.top) / 20) * 20;
        const index = Math.floor(y / 20) * 72 + Math.floor(x / 20);
        if (index >= 0 && index < totalCells) {
            if (boundaryState === 1) grid.children[index].classList.add('boundary');
            else if (boundaryState === 2) grid.children[index].classList.remove('boundary');
        }
    }

    function stopDrawing() { isDrawing = false; }

    function removeRoads() {
        document.querySelectorAll('.figure.gray').forEach(road => {
            road.style.left = `${71 * 20}px`;
            road.style.top = `${16 * 20}px`;
        });
    }

    function calculateRoads() {
        let current = 0, required = 0;
        document.querySelectorAll('.figure').forEach(f => {
            const w = Math.round(f.offsetWidth / 20);
            const h = Math.round(f.offsetHeight / 20);
            const x = Math.round(f.offsetLeft / 20);
            const y = Math.round(f.offsetTop / 20);
            const name = f.dataset.name || "";
            if (isInGrayArea(x*20, y*20, w, h)) return;
            if (f.classList.contains('gray')) current += w * h;
            else if (!name.toLowerCase().includes('ратуша') && !f.classList.contains('blue') && !f.classList.contains('green')) {
                required += Math.min(w, h) / 2;
            }
        });
        const eff = current > 0 ? (required / current * 100).toFixed(2) : 0;
        roadResult.textContent = `Дороги: ${current} | Эффективность: ${eff}%`;
    }

    function isInGrayArea(x, y, width, height) {
        const colStart = Math.floor(x / 20) + 1;
        const rowStart = Math.floor(y / 20) + 1;
        const colEnd = colStart + width - 1;
        const rowEnd = rowStart + height - 1;
        for (let r = rowStart; r <= rowEnd; r++) {
            for (let c = colStart; c <= colEnd; c++) {
                for (let a of areas) {
                    if (c >= a.colStart && c <= a.colEnd && r >= a.rowStart && r <= a.rowEnd) return true;
                }
            }
        }
        return false;
    }

    function loadFile(input) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => document.getElementById('data-input').value = e.target.result;
        reader.readAsText(file);
        input.value = '';
    }

    function saveToFile() {
        const figures = document.querySelectorAll('.figure');
        if (figures.length === 0) return alert("Нет фигур для сохранения!");

        const lines = [];
        figures.forEach(f => {
            const w = Math.round(f.offsetWidth / 20);
            const h = Math.round(f.offsetHeight / 20);
            const x = Math.round(f.offsetLeft / 20);
            const y = Math.round(f.offsetTop / 20);
            const name = f.dataset.name || "";
            let color = '';
            if (f.classList.contains('gray')) color = '1';
            else if (f.classList.contains('yellow')) color = '2';
            else if (f.classList.contains('blue')) color = '3';
            else if (f.classList.contains('red')) color = '4';
            else if (f.classList.contains('green')) color = '5';
            else if (f.classList.contains('light-green')) color = '6';
            lines.push(`${w}\t${h}\t${x}\t${y}\t${name}${color ? '\t' + color : ''}`);
        });

        const blob = new Blob([lines.join('\n')], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cityplan.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

        function checkOverlapsAndGray() {
        const figures = document.querySelectorAll('.figure');
        
        // Сброс всех эффектов
        figures.forEach(figure => {
            figure.classList.remove('blinking', 'yellow-outline');
        });

        // 1. Проверка наложений между зданиями
        for (let i = 0; i < figures.length; i++) {
            for (let j = i + 1; j < figures.length; j++) {
                const f1 = figures[i];
                const f2 = figures[j];

                if (!(f1.offsetLeft + f1.offsetWidth <= f2.offsetLeft ||
                      f2.offsetLeft + f2.offsetWidth <= f1.offsetLeft ||
                      f1.offsetTop + f1.offsetHeight <= f2.offsetTop ||
                      f2.offsetTop + f2.offsetHeight <= f1.offsetTop)) {
                    f1.classList.add('blinking');
                    f2.classList.add('blinking');
                }
            }
        }

        // 2. Подсветка зданий, стоящих в серой зоне
        figures.forEach(figure => {
            const x = Math.round(figure.offsetLeft / 20);
            const y = Math.round(figure.offsetTop / 20);
            const width = Math.round(figure.offsetWidth / 20);
            const height = Math.round(figure.offsetHeight / 20);

            if (isInGrayArea(x * 20, y * 20, width, height)) {
                figure.classList.add('yellow-outline');
            }
        });
    }

    function testOverlaps() {
        checkOverlapsAndGray();
    }

    // ==================== ПРИВЯЗКА КНОПОК ====================
    document.getElementById('btnStart').addEventListener('click', placeFigures);
    document.getElementById('btnResetFigures').addEventListener('click', resetFigures);
    document.getElementById('btnResetInput').addEventListener('click', () => document.getElementById('data-input').value = '');
    document.getElementById('btnBoundary').addEventListener('click', toggleBoundaryMode);
    document.getElementById('btnRemoveRoads').addEventListener('click', removeRoads);
    document.getElementById('btnCreateFigure').addEventListener('click', createFigure);
    document.getElementById('btnCalculateRoads').addEventListener('click', calculateRoads);
    document.getElementById('btnTestOverlaps').addEventListener('click', testOverlaps);
    document.getElementById('btnSaveFile').addEventListener('click', saveToFile);
    document.getElementById('btnLoadFile').addEventListener('click', () => document.getElementById('fileInput').click());
    document.getElementById('fileInput').addEventListener('change', function() { loadFile(this); });

    // Рисование границ
    grid.addEventListener('mousedown', startDrawing);
    grid.addEventListener('mousemove', drawBoundary);
    grid.addEventListener('mouseup', stopDrawing);
    grid.addEventListener('mouseleave', stopDrawing);

    placeDefaultRatusha();
    console.log('✅ Полная версия cityplan.js загружена');
});
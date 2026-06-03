// ─── AUDIO ────────────────────────────────────────────────
let audioCtx = null;

function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playBeep(frequency, duration, volume = 0.3) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;
    oscillator.type = "sine";
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, now + duration);
    oscillator.stop(now + duration);
}

function playBrickHit(strength) {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (strength <= 0) playBeep(880, 0.12, 0.25);
    else playBeep(440, 0.08, 0.2);
}

function playPaddleHit() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playBeep(660, 0.06, 0.15);
}

function playBonusCollect() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 523.25;
    gain.gain.value = 0.2;
    osc.start();
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
    osc.stop(now + 0.15);
}

function playLifeLost() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playBeep(220, 0.3, 0.3);
}

function playLaserShoot() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 1200;
    gain.gain.value = 0.15;
    osc.type = "square";
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.1);
    osc.stop(now + 0.1);
}

function playExplosionSound() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const now = audioCtx.currentTime;
    
    const frequencies = [55, 80, 110];
    const types = ["sawtooth", "square", "sawtooth"];
    
    for (let i = 0; i < frequencies.length; i++) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = frequencies[i];
        gain.gain.value = 0.35;
        osc.type = types[i];
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.4);
        osc.frequency.exponentialRampToValueAtTime(frequencies[i] / 2, now + 0.4);
        osc.stop(now + 0.4);
    }
}

function playFoxSound() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 1000;
    gain.gain.value = 0.6;
    osc.type = "sine";
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.25);
    osc.stop(now + 0.25);
}

window.playFoxSound = playFoxSound;
window.playExplosionSound = playExplosionSound;


// ─── CONFIG ───────────────────────────────────────────────
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');

const R         = 22;
const COLS      = 20;
const MAX_ROWS  = 16;
const DX        = R * 2;
const DY        = R * Math.sqrt(3);
const GRID_X    = canvas.width / 2 - ((COLS - 1) / 2) * DX;
const GRID_Y    = R + 10;
const CANNON_X  = canvas.width / 2;
const CANNON_Y  = canvas.height - 50;

// Все 8 цветов
const ALL_COLORS = ['#e74c3c','#2ecc71','#3498db','#f1c40f','#9b59b6','#e67e22','#ffffff','#e91e8c'];
const ALL_GLOW   = ['#ff6b6b','#55ff99','#55aaff','#ffee55','#cc77ff','#ffaa44','#ffffff','#ff66cc'];

// Уровень определяет сколько цветов используется (3..8) и сколько рядов (5..10)
function levelConfig(lvl) {
    return {
        colors:   Math.min(3 + lvl - 1, 8),
        initRows: Math.min(5 + Math.floor((lvl - 1) / 2), 10),
        speed:    0.55 + (lvl - 1) * 0.04,
    };
}

// ─── STATE ────────────────────────────────────────────────
let grid     = [];
let curColor = 0;
let nxtColor = 0;
let score    = 0;
let shots    = 0;
let level    = 1;
let gameOver = false;
let won      = false;
let bullet   = null;
let aimAngle = 0;
let COLORS   = ALL_COLORS.slice(0, 3);
let GLOW     = ALL_GLOW.slice(0, 3);
let bulletSpeed    = 0.55;
let dropEvery      = 60;
let shotsThisLevel = 0;
let poppedCount    = 0;
let difficulty     = 2;        // 0..5
const POPS_TO_WIN  = 500;

// ─── ЧАСТИЦЫ ──────────────────────────────────────────────
let particles = [];
let fallers   = [];
let flashAlpha = 0;

function spawnParticles(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3;
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: 3 + Math.random() * 4,
            color,
            life: 1,
            maxLife: 0.4 + Math.random() * 0.4
        });
    }
}

function spawnFaller(x, y, colorIdx) {
    fallers.push({
        x, y,
        vx: (Math.random() - 0.5) * 2,
        vy: -1 - Math.random() * 2,
        color: colorIdx,
        life: 1
    });
}

function triggerFlash() {
    flashAlpha = 0.55;
}

function updateParticles(dt) {
    const sec = dt / 1000;
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x  += p.vx * dt * 0.06;
        p.y  += p.vy * dt * 0.06;
        p.vy += 0.12 * dt * 0.06;
        p.life -= sec / p.maxLife;
        if (p.life <= 0) particles.splice(i, 1);
    }
    for (let i = fallers.length - 1; i >= 0; i--) {
        const f = fallers[i];
        f.x  += f.vx * dt * 0.06;
        f.y  += f.vy * dt * 0.06;
        f.vy += 0.25 * dt * 0.06;
        f.life -= sec / 1.2;
        if (f.life <= 0 || f.y > canvas.height + R) fallers.splice(i, 1);
    }
    if (flashAlpha > 0) flashAlpha = Math.max(0, flashAlpha - sec * 2.5);
}

function drawParticles() {
    for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.life * 0.9;
        ctx.shadowBlur  = 6;
        ctx.shadowColor = p.color;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    for (const f of fallers) {
        ctx.save();
        ctx.globalAlpha = f.life;
        drawBubble(f.x, f.y, f.color, R * 0.8);
        ctx.restore();
    }
    if (flashAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = flashAlpha;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
}

// ─── УРОВЕНЬ ──────────────────────────────────────────────
function applyLevel(lvl) {
    const cfg = levelConfig(lvl);
    COLORS      = ALL_COLORS.slice(0, cfg.colors);
    GLOW        = ALL_GLOW.slice(0, cfg.colors);
    bulletSpeed = cfg.speed;
    updateDropEvery();
    return cfg;
}

function updateDropEvery() {
    const values = [100, 80, 60, 40, 20, 10];
    dropEvery = values[difficulty] ?? 60;
}

// ─── ИНИЦИАЛИЗАЦИЯ СЕТКИ ──────────────────────────────────
function initGrid(initRows) {
    grid = [];
    for (let r = 0; r < MAX_ROWS; r++) {
        grid[r] = new Array(COLS).fill(null);
    }
    for (let r = 0; r < initRows; r++) {
        const cols = (r % 2 === 0) ? COLS : COLS - 1;
        for (let c = 0; c < cols; c++) {
            grid[r][c] = Math.floor(Math.random() * COLORS.length);
        }
    }
}

function dropNewRow() {
    for (let r = MAX_ROWS - 1; r > 0; r--) {
        grid[r] = grid[r - 1];
    }
    grid[0] = new Array(COLS).fill(null);
    const cols = (0 % 2 === 0) ? COLS : COLS - 1;
    for (let c = 0; c < cols; c++) {
        grid[0][c] = Math.floor(Math.random() * COLORS.length);
    }
}

function newGame(keepScore = false) {
    if (!keepScore) { score = 0; level = 1; }
    const cfg = applyLevel(level);
    initGrid(cfg.initRows);
    curColor       = randColor();
    nxtColor       = randColor();
    shots          = 0;
    shotsThisLevel = 0;
    poppedCount    = 0;
    gameOver       = false;
    won            = false;
    bullet         = null;
    aimAngle       = 0;
    particles      = [];
    fallers        = [];
    flashAlpha     = 0;
    updateUI();
    draw();
}

function nextLevel() {
    level++;
    const cfg = applyLevel(level);
    initGrid(cfg.initRows);
    curColor       = randColor();
    nxtColor       = randColor();
    shots          = 0;
    shotsThisLevel = 0;
    poppedCount    = 0;
    won            = false;
    bullet         = null;
    aimAngle       = 0;
    particles      = [];
    fallers        = [];
    flashAlpha     = 0;
    updateUI();
    draw();
}

function randColor() { return Math.floor(Math.random() * COLORS.length); }

// ─── GRID HELPERS ─────────────────────────────────────────
function cellCenter(row, col) {
    const offset = (row % 2 === 0) ? 0 : R;
    return {
        x: GRID_X + col * DX + offset,
        y: GRID_Y + row * DY
    };
}

function neighbours(row, col) {
    const even = (row % 2 === 0);
    const offsets = even
        ? [[-1,-1],[-1,0],[0,-1],[0,1],[1,-1],[1,0]]
        : [[-1,0],[-1,1],[0,-1],[0,1],[1,0],[1,1]];
    const res = [];
    for (const [dr, dc] of offsets) {
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < grid.length && nc >= 0 && nc < COLS)
            res.push({row: nr, col: nc});
    }
    return res;
}

// ─── UI ───────────────────────────────────────────────────
function updateUI() {
    document.getElementById('scoreVal').textContent = String(score).padStart(5,'0');
    document.getElementById('shotsVal').textContent = String(shots).padStart(3,'0');
    document.getElementById('levelVal').textContent = String(level).padStart(2,'0');
    document.getElementById('diffVal').textContent  = difficulty;
    const nb = document.getElementById('nextBubble');
    nb.style.background = COLORS[nxtColor];
    nb.style.boxShadow  = `0 0 12px ${GLOW[nxtColor]}`;
    const pct = Math.min(poppedCount / POPS_TO_WIN * 100, 100);
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressText').textContent = `${poppedCount} / ${POPS_TO_WIN}`;
}

// ─── AIM ──────────────────────────────────────────────────
canvas.addEventListener('mousemove', e => {
    if (bullet || gameOver || won) return;
    const r = canvas.getBoundingClientRect();
    const mx = (e.clientX - r.left) * (canvas.width  / r.width);
    const my = (e.clientY - r.top)  * (canvas.height / r.height);
    let a = Math.atan2(mx - CANNON_X, CANNON_Y - my);
    a = Math.max(-1.3, Math.min(1.3, a));
    aimAngle = a;
    draw();
});

canvas.addEventListener('click', e => {
    e.preventDefault();
    if (typeof initAudio === 'function') initAudio();
    if (bullet || gameOver || won) return;
    shoot();
});

document.getElementById('btnReset').addEventListener('click', () => newGame(won));

// ─── SHOOT ────────────────────────────────────────────────
function shoot() {
    const vx = Math.sin(aimAngle) * bulletSpeed;
    const vy = -Math.cos(aimAngle) * bulletSpeed;
    bullet = { x: CANNON_X, y: CANNON_Y, vx, vy, color: curColor };
    shots++;
    shotsThisLevel++;
   
    updateUI();
    if (typeof playPaddleHit === 'function') playPaddleHit();
    lastTime = null;
    requestAnimationFrame(gameLoop);
}

// ─── GAME LOOP ────────────────────────────────────────────
let lastTime = null;
function gameLoop(now) {
    if (!lastTime) lastTime = now;
    const dt = now - lastTime;
    lastTime = now;

    updateParticles(dt);

    if (bullet) moveBullet(dt);

    draw();

    if (bullet || particles.length > 0 || fallers.length > 0 || flashAlpha > 0) {
        requestAnimationFrame(gameLoop);
    }
}

function moveBullet(dt) {
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;

    if (bullet.x - R < 0) {
        bullet.x = R;
        bullet.vx = Math.abs(bullet.vx);
    }
    if (bullet.x + R > canvas.width) {
        bullet.x = canvas.width - R;
        bullet.vx = -Math.abs(bullet.vx);
    }

    if (bullet.y - R <= GRID_Y) {
        snapBullet();
        return;
    }

    const hit = findCollision();
    if (hit) {
        snapBullet(hit);
    }
}

function findCollision() {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] === null) continue;
            const {x, y} = cellCenter(r, c);
            const dx = bullet.x - x, dy = bullet.y - y;
            if (dx*dx + dy*dy < (R*1.9)*(R*1.9)) {
                return {row: r, col: c};
            }
        }
    }
    return null;
}

function snapBullet(hit) {
    const placed = findEmptyCell(hit);
    if (placed) {
        grid[placed.row][placed.col] = bullet.color;
        
        if (shotsThisLevel > 0 && shotsThisLevel % dropEvery === 0) {
            dropNewRow();
        }
        
        processMatches(placed.row, placed.col);
        checkWin();
        checkLose();
    }
    curColor = nxtColor;
    nxtColor = randColor();
    bullet   = null;
    lastTime = null;
    updateUI();
    draw();
}

function findEmptyCell(hit) {
    if (!hit) {
        return findCellNearPoint(bullet.x, GRID_Y);
    }
    const cands = neighbours(hit.row, hit.col).filter(n => grid[n.row][n.col] === null);
    if (cands.length === 0) {
        return findCellNearPoint(bullet.x, bullet.y);
    }
    let best = null, bestD = Infinity;
    for (const n of cands) {
        const {x, y} = cellCenter(n.row, n.col);
        const d = (bullet.x-x)**2 + (bullet.y-y)**2;
        if (d < bestD) { bestD = d; best = n; }
    }
    return best;
}

function findCellNearPoint(px, py) {
    let best = null, bestD = Infinity;
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] !== null) continue;
            if (r > 0 && !hasActiveNeighbour(r, c)) continue;
            const {x, y} = cellCenter(r, c);
            const d = (px-x)**2 + (py-y)**2;
            if (d < bestD) { bestD = d; best = {row:r, col:c}; }
        }
    }
    return best;
}

function hasActiveNeighbour(row, col) {
    return neighbours(row, col).some(n => grid[n.row][n.col] !== null);
}

// ─── MATCH LOGIC ──────────────────────────────────────────
function processMatches(row, col) {
    const color = grid[row][col];
    const group = floodFill(row, col, c => c === color);
    if (group.length >= 3) {
        for (const {row:r, col:c} of group) {
            const {x, y} = cellCenter(r, c);
            spawnParticles(x, y, COLORS[grid[r][c]], group.length >= 6 ? 18 : 10);
            grid[r][c] = null;
            score += 10;
            poppedCount++;
        }
        if (typeof playBrickHit === 'function') playBrickHit(group.length >= 6 ? 0 : 1);

        const floating = findFloating();
        for (const {row:r, col:c} of floating) {
            const {x, y} = cellCenter(r, c);
            spawnFaller(x, y, grid[r][c]);
            spawnParticles(x, y, COLORS[grid[r][c]], 6);
            grid[r][c] = null;
            score += 5;
        }
        if (floating.length > 0 && typeof playExplosionSound === 'function') playExplosionSound();

        if (group.length >= 6) {
            if (typeof playBonusCollect === 'function') playBonusCollect();
        }
    }
    updateUI();
}

function floodFill(startRow, startCol, predicate) {
    const result = [];
    const visited = new Set();
    const queue = [{row: startRow, col: startCol}];
    while (queue.length) {
        const {row, col} = queue.shift();
        const key = `${row},${col}`;
        if (visited.has(key)) continue;
        visited.add(key);
        if (row < 0 || row >= grid.length || col < 0 || col >= COLS) continue;
        if (grid[row][col] === null) continue;
        if (!predicate(grid[row][col])) continue;
        result.push({row, col});
        for (const n of neighbours(row, col)) queue.push(n);
    }
    return result;
}

function findFloating() {
    const attached = new Set();
    const queue = [];
    for (let c = 0; c < COLS; c++) {
        if (grid[0][c] !== null) {
            queue.push({row:0, col:c});
            attached.add(`0,${c}`);
        }
    }
    while (queue.length) {
        const {row, col} = queue.shift();
        for (const n of neighbours(row, col)) {
            const key = `${n.row},${n.col}`;
            if (!attached.has(key) && grid[n.row][n.col] !== null) {
                attached.add(key);
                queue.push(n);
            }
        }
    }
    const floating = [];
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] !== null && !attached.has(`${r},${c}`)) {
                floating.push({row:r, col:c});
            }
        }
    }
    return floating;
}

// ─── WIN / LOSE ───────────────────────────────────────────
function checkWin() {
    const fieldEmpty = grid.every(row => row.every(cell => cell === null));
    if (poppedCount < POPS_TO_WIN && !fieldEmpty) return;
    
    won = true;
    if (typeof playBonusCollect === 'function') {
        playBonusCollect();
        setTimeout(() => playBonusCollect(), 200);
    }
    draw();
    setTimeout(() => {
        nextLevel();
    }, 3000);
}

function triggerGameOver() {
    gameOver = true;
    if (typeof playLifeLost === 'function') playLifeLost();
    draw();
    setTimeout(openGameOverModal, 600);
}

function checkLose() {
    const dangerRow = MAX_ROWS - 1;
    for (let c = 0; c < COLS; c++) {
        if (grid[dangerRow] && grid[dangerRow][c] !== null) {
            triggerGameOver();
            return;
        }
    }
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] !== null) {
                const {y} = cellCenter(r, c);
                if (y + R >= CANNON_Y - 30) {
                    triggerGameOver();
                    return;
                }
            }
        }
    }
}

// ─── DRAWING ──────────────────────────────────────────────
function drawBubble(x, y, colorIdx, radius, alpha) {
    const color = COLORS[colorIdx];
    const glow  = GLOW[colorIdx];
    ctx.save();
    ctx.globalAlpha = alpha ?? 1;

    ctx.shadowBlur  = 10;
    ctx.shadowColor = glow;

    const grad = ctx.createRadialGradient(x - radius*0.3, y - radius*0.3, 0, x, y, radius);
    const isWhite = color === '#ffffff';
    grad.addColorStop(0, isWhite ? '#ffffff' : lighten(color, 40));
    grad.addColorStop(1, isWhite ? '#cccccc' : color);
    
    ctx.beginPath();
    ctx.arc(x, y, radius - 1, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(x - radius*0.3, y - radius*0.3, radius*0.25, 0, Math.PI*2);
    ctx.fillStyle = color === '#ffffff' ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.55)';
    ctx.fill();

    ctx.restore();
}

function lighten(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (n>>16) + pct);
    const g = Math.min(255, ((n>>8)&0xff) + pct);
    const b = Math.min(255, (n&0xff) + pct);
    return `rgb(${r},${g},${b})`;
}

function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0c1220');
    grad.addColorStop(1, '#182030');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255,80,80,0.25)';
    ctx.setLineDash([6,6]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, CANNON_Y - 30);
    ctx.lineTo(canvas.width, CANNON_Y - 30);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawGrid() {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] === null) continue;
            const {x, y} = cellCenter(r, c);
            if (y - R > canvas.height) continue;
            drawBubble(x, y, grid[r][c], R);
        }
    }
}

function drawAimLine() {
    if (bullet || gameOver || won) return;
    let x = CANNON_X, y = CANNON_Y;
    let vx = Math.sin(aimAngle), vy = -Math.cos(aimAngle);

    ctx.save();
    ctx.strokeStyle = 'rgba(150,220,255,0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.moveTo(x, y);

    const maxBounces = 6;
    let bounces = 0;
    while (bounces <= maxBounces) {
        const tx = vx > 0
            ? (canvas.width - R - x) / vx
            : vx < 0 ? (R - x) / vx : Infinity;
        const ty = (GRID_Y - y) / vy;

        if (ty > 0 && ty <= tx) {
            x += vx * ty;
            y += vy * ty;
            ctx.lineTo(x, y);
            break;
        } else if (tx > 0) {
            x += vx * tx;
            y += vy * tx;
            ctx.lineTo(x, y);
            vx = -vx;
            bounces++;
        } else {
            break;
        }
    }
    ctx.stroke();
    ctx.restore();
}

function drawCannon() {
    const cx = CANNON_X, cy = CANNON_Y;
    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI*2);
    ctx.fillStyle = '#1a2a3a';
    ctx.shadowBlur  = 12;
    ctx.shadowColor = '#4ecca3';
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#4ecca3';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.translate(cx, cy);
    ctx.rotate(aimAngle);
    ctx.beginPath();
    ctx.roundRect(-6, -34, 12, 36, 4);
    ctx.fillStyle = '#4ecca3';
    ctx.shadowBlur  = 8;
    ctx.shadowColor = '#4ecca3';
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    if (!bullet) {
        const tipX = cx + Math.sin(aimAngle) * 38;
        const tipY = cy - Math.cos(aimAngle) * 38;
        drawBubble(tipX, tipY, curColor, R - 2);
    }
}

function drawBullet() {
    if (!bullet) return;
    drawBubble(bullet.x, bullet.y, bullet.color, R - 1);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawGrid();
    drawAimLine();
    drawCannon();
    drawBullet();
    drawParticles();

    if (won) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.font = 'bold 48px "Courier New", monospace';
        ctx.fillStyle = '#55ff88';
        ctx.shadowBlur = 24; ctx.shadowColor = '#55ff88';
        ctx.fillText(`УРОВЕНЬ ${level} ПРОЙДЕН!`, canvas.width/2, canvas.height/2 - 20);
        ctx.shadowBlur = 0;
        ctx.font = '20px "Courier New", monospace';
        ctx.fillStyle = '#ffdd88';
        ctx.fillText(`Следующий: уровень ${level + 1} · ${Math.min(3 + level, 8)} цветов`, canvas.width/2, canvas.height/2 + 30);
    }
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.font = 'bold 48px "Courier New", monospace';
        ctx.fillStyle = '#ff5555';
        ctx.shadowBlur = 24; ctx.shadowColor = '#ff5555';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
        ctx.shadowBlur = 0;
    }
}

// ─── START ────────────────────────────────────────────────
newGame();

// ─── СЛОЖНОСТЬ ────────────────────────────────────────────
function createDifficultyOptions() {
    const container = document.getElementById('difficultyOptions');
    container.innerHTML = '';
    const names  = ['Очень лёгкая','Лёгкая','Нормальная','Сложная','Очень сложная','Экстремальная'];
    const values = [100, 80, 60, 40, 20, 10];
    for (let i = 0; i <= 5; i++) {
        const btn = document.createElement('button');
        btn.className = 'modal-btn';
        btn.style.background = (i === difficulty) ? '#4ecca3' : '#1a2e1a';
        btn.style.border     = (i === difficulty) ? '2px solid #7eff5e' : '1px solid #3a6a3a';
        btn.textContent = `${i} — ${names[i]}  (новый ряд каждые ${values[i]} выстрелов)`;
        btn.onclick = () => {
            difficulty = i;
            updateDropEvery();
            updateUI();
            createDifficultyOptions();
        };
        container.appendChild(btn);
    }
}

function openDifficultyModal() {
    createDifficultyOptions();
    document.getElementById('difficultyModal').classList.add('active');
}
function closeDifficultyModal() {
    document.getElementById('difficultyModal').classList.remove('active');
}

// ─── SUPABASE ─────────────────────────────────────────────
const SUPABASE_URL = 'https://hewlajcgcyaoitdethhq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhld2xhamNnY3lhb2l0ZGV0aGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDIyNTcsImV4cCI6MjA5MTQ3ODI1N30.-OYgXzzjUXJA2Bc95CZVpKCErZED6HMNdEFwZpslbD4';
const TABLE = 'bubblescore';

async function sbFetch(path, opts = {}) {
    const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        ...(opts.headers || {})
    };
    const res = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
        ...opts,
        headers
    });
    if (!res.ok) {
        const txt = await res.text();
        console.error('Supabase error:', res.status, txt);
        throw new Error(txt);
    }
    const txt = await res.text();
    return txt ? JSON.parse(txt) : null;
}

async function loadHighScores() {
    try {
        return await sbFetch(`${TABLE}?select=name,score&order=score.desc&limit=20`);
    } catch(e) {
        console.error('Supabase load error', e);
        return null;
    }
}

async function saveHighScore(name, scoreVal) {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ name, score: scoreVal })
        });
        if (!res.ok) {
            const txt = await res.text();
            console.error('Save error:', res.status, txt);
            return false;
        }
        return true;
    } catch(e) {
        console.error('Supabase save error', e);
        return false;
    }
}

// ─── ИМЯ ИГРОКА (localStorage) ────────────────────────────
function getPlayerName() {
    return localStorage.getItem('bubblePlayerName') || '';
}
function setPlayerName(n) {
    localStorage.setItem('bubblePlayerName', n.trim());
}

// ─── МОДАЛЬ: ТАБЛИЦА РЕКОРДОВ ─────────────────────────────
async function openHsModal() {
    document.getElementById('hsModal').classList.add('active');
    const list = document.getElementById('hsList');
    list.innerHTML = '<div class="hs-loading">Загрузка...</div>';
    const rows = await loadHighScores();
    if (!rows || rows.length === 0) {
        list.innerHTML = '<div class="hs-loading">Рекордов пока нет</div>';
        return;
    }
    const medals = ['🥇','🥈','🥉'];
    list.innerHTML = rows.map((r, i) => `
        <div class="hs-item">
            <span class="hs-rank">${medals[i] || (i+1)}</span>
            <span class="hs-name">${escHtml(r.name)}</span>
            <span class="hs-score">${r.score.toLocaleString()}</span>
        </div>`).join('');
}
function closeHsModal() {
    document.getElementById('hsModal').classList.remove('active');
}

// ─── МОДАЛЬ: GAME OVER ────────────────────────────────────
function openGameOverModal() {
    document.getElementById('goScore').textContent = score.toLocaleString();
    const inp = document.getElementById('playerNameInput');
    inp.value = getPlayerName();
    document.getElementById('gameOverModal').classList.add('active');
}
function closeGameOverModal() {
    document.getElementById('gameOverModal').classList.remove('active');
}

// ─── ОБРАБОТЧИКИ КНОПОК (были inline onclick) ─────────────
document.getElementById('closeBtn').addEventListener('click', () => window.close());
document.getElementById('hsModalCloseTop').addEventListener('click', closeHsModal);
document.getElementById('hsModalCloseBtn').addEventListener('click', closeHsModal);
document.getElementById('difficultyModalCloseTop').addEventListener('click', closeDifficultyModal);
document.getElementById('difficultyModalCloseBtn').addEventListener('click', closeDifficultyModal);

document.getElementById('saveNameBtn').addEventListener('click', () => {
    const v = document.getElementById('playerNameInput').value.trim();
    if (v) { setPlayerName(v); }
});

document.getElementById('btnSaveScore').addEventListener('click', async () => {
    const name = document.getElementById('playerNameInput').value.trim() || 'Аноним';
    setPlayerName(name);
    document.getElementById('btnSaveScore').textContent = '⏳ Сохраняю...';
    const ok = await saveHighScore(name, score);
    if (ok) {
        document.getElementById('btnSaveScore').textContent = '✅ Сохранено!';
        setTimeout(() => {
            closeGameOverModal();
            newGame(false);
        }, 1000);
    } else {
        document.getElementById('btnSaveScore').textContent = '❌ Ошибка';
    }
});

document.getElementById('btnRestartAfterLose').addEventListener('click', () => {
    closeGameOverModal();
    newGame(false);
});

// Закрытие по клику на оверлей
document.getElementById('hsModal').addEventListener('click', e => {
    if (e.target === document.getElementById('hsModal')) closeHsModal();
});
document.getElementById('gameOverModal').addEventListener('click', e => {
    if (e.target === document.getElementById('gameOverModal')) closeGameOverModal();
});
document.getElementById('difficultyModal').addEventListener('click', e => {
    if (e.target === document.getElementById('difficultyModal')) closeDifficultyModal();
});

function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── KEYDOWN ──────────────────────────────────────────────
document.addEventListener('keydown', e => {
    const k = e.key;
    const anyModal = () =>
        document.getElementById('hsModal').classList.contains('active') ||
        document.getElementById('gameOverModal').classList.contains('active') ||
        document.getElementById('difficultyModal').classList.contains('active');

    if (k === 't' || k === 'T' || k === 'е' || k === 'Е') { if (!anyModal()) openHsModal(); return; }
    if (k === 'l' || k === 'L' || k === 'д' || k === 'Д') { if (!anyModal()) openDifficultyModal(); return; }
    if (k === 'Escape') {
        if (document.getElementById('hsModal').classList.contains('active'))         { closeHsModal(); return; }
        if (document.getElementById('gameOverModal').classList.contains('active'))   { closeGameOverModal(); return; }
        if (document.getElementById('difficultyModal').classList.contains('active')) { closeDifficultyModal(); return; }
        return;
    }
    if (k === 'r' || k === 'R' || k === 'к' || k === 'К') {
        if (!anyModal()) newGame(won);
    }
});
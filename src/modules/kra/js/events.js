// events.js — replaces all inline onclick handlers from index.html
// Must be loaded LAST, after game.js

document.addEventListener('DOMContentLoaded', function () {

    // ── Paddle modal ──────────────────────────────────────────────────────
    const closePaddleBtn = document.querySelector('#paddleModal .close-btn');
    if (closePaddleBtn) closePaddleBtn.addEventListener('click', closePaddleModal);

    document.querySelectorAll('.paddle-option').forEach(function (el) {
        el.addEventListener('click', function () {
            selectPaddle(el.dataset.paddle);
        });
    });

    // ── Level complete modal ──────────────────────────────────────────────
    const nextLevelBtn = document.querySelector('#levelCompleteModal .next-level-btn');
    if (nextLevelBtn) nextLevelBtn.addEventListener('click', closeLevelCompleteModal);

    // ── Generator modal ───────────────────────────────────────────────────
    const closeGenBtn = document.querySelector('#generatorModal .close-btn');
    if (closeGenBtn) closeGenBtn.addEventListener('click', closeGeneratorModal);

    const cancelGenBtn = document.querySelector('#generatorModal .generator-buttons button:first-child');
    if (cancelGenBtn) cancelGenBtn.addEventListener('click', closeGeneratorModal);

    const saveGenBtn = document.querySelector('#generatorModal .btn-primary');
    if (saveGenBtn) saveGenBtn.addEventListener('click', saveGeneratorSettings);

    // ── Help modal ────────────────────────────────────────────────────────
    const closeHelpBtn = document.querySelector('#helpModal .next-level-btn');
    if (closeHelpBtn) closeHelpBtn.addEventListener('click', closeHelpModal);

    // ── Exit modal ────────────────────────────────────────────────────────
    const saveScoreBtn = document.querySelector('.exit-btn:not(.cancel-btn)');
    if (saveScoreBtn) saveScoreBtn.addEventListener('click', saveScoreAndExit);

    const cancelExitBtn = document.querySelector('.exit-btn.cancel-btn');
    if (cancelExitBtn) cancelExitBtn.addEventListener('click', closeExitModal);

    // ── High scores modal ─────────────────────────────────────────────────
    const closeHSBtn = document.querySelector('#highScoresModal .next-level-btn');
    if (closeHSBtn) closeHSBtn.addEventListener('click', closeHighScoresModal);

});

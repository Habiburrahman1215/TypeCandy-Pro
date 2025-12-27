// ==================== Game Data ====================
const wordLists = {
    easy: ['cat', 'dog', 'sun', 'run', 'fun', 'hat', 'bat', 'map', 'cup', 'red', 'blue', 'fish', 'bird', 'tree', 'book', 'door', 'food', 'good', 'look', 'cook', 'play', 'stay', 'day', 'way', 'say', 'love', 'home', 'come', 'some', 'time'],
    medium: ['apple', 'banana', 'orange', 'purple', 'yellow', 'flower', 'garden', 'window', 'button', 'coffee', 'laptop', 'camera', 'planet', 'rocket', 'castle', 'bridge', 'stream', 'forest', 'desert', 'island', 'monkey', 'rabbit', 'turtle', 'dolphin', 'penguin'],
    hard: ['adventure', 'beautiful', 'challenge', 'dangerous', 'excellent', 'fantastic', 'gorgeous', 'happiness', 'important', 'knowledge', 'lightning', 'magnificent', 'mysterious', 'nightmare', 'operation', 'passionate', 'qualified', 'remarkable', 'successful', 'technology'],
    expert: ['accomplishment', 'extraordinary', 'rehabilitation', 'recommendation', 'communication', 'determination', 'environmental', 'international', 'pharmaceutical', 'unprecedented', 'comprehensive', 'consciousness', 'entrepreneurship', 'infrastructure', 'representative']
};

const sentences = {
    easy: [
        'The cat sat on the mat.',
        'I love to play games.',
        'The sun is very bright.',
        'She has a red balloon.',
        'We go to school daily.'
    ],
    medium: [
        'The quick brown fox jumps over the lazy dog.',
        'Practice makes perfect in everything you do.',
        'Learning to type fast is a valuable skill.',
        'The beautiful garden has many colorful flowers.',
        'Technology is changing the world every day.'
    ],
    hard: [
        'Success is not final, failure is not fatal: it is the courage to continue that counts.',
        'The only way to do great work is to love what you do and never give up.',
        'Innovation distinguishes between a leader and a follower in any field.',
        'The journey of a thousand miles begins with a single step forward.',
        'Creativity is intelligence having fun with endless possibilities.'
    ],
    expert: [
        'The extraordinary phenomenon of bioluminescence occurs in various marine organisms throughout the ocean depths.',
        'Entrepreneurship requires a combination of creativity, determination, and strategic thinking to achieve success.',
        'The comprehensive analysis of environmental sustainability reveals significant challenges for future generations.',
        'Pharmaceutical research and development continues to advance medical treatments for complex diseases worldwide.',
        'International cooperation is essential for addressing global challenges such as climate change and economic inequality.'
    ]
};

const quotes = [
    { text: 'Be the change you wish to see in the world.', author: 'Mahatma Gandhi' },
    { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
    { text: 'The only thing we have to fear is fear itself.', author: 'Franklin D. Roosevelt' },
    { text: 'To be or not to be, that is the question.', author: 'William Shakespeare' },
    { text: 'I think, therefore I am.', author: 'René Descartes' },
    { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
    { text: 'Life is what happens when you are busy making other plans.', author: 'John Lennon' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' }
];

const codeSnippets = [
    'const x = 10;',
    'function hello() { }',
    'if (a > b) return a;',
    'for (let i = 0; i < 10; i++)',
    'console.log("Hello World");',
    'const arr = [1, 2, 3, 4, 5];',
    'document.getElementById("app");',
    'async function fetchData() { }',
    'import React from "react";',
    'export default App;'
];

// ==================== Game State ====================
let gameState = {
    mode: 'words',
    difficulty: 'easy',
    score: 0,
    combo: 1,
    maxCombo: 1,
    lives: 3,
    currentWord: '',
    currentIndex: 0,
    wordsCompleted: 0,
    totalWords: 10,
    correctChars: 0,
    totalChars: 0,
    startTime: null,
    timeLeft: 60,
    isPaused: false,
    isPlaying: false,
    powerups: {
        freeze: 3,
        skip: 2,
        hint: 3
    },
    currentLevel: 1,
    xp: 0,
    xpToNextLevel: 100,
    isBossLevel: false
};

let playerData = {
    name: 'Player',
    highScore: 0,
    bestWPM: 0,
    bestAccuracy: 0,
    totalStars: 0,
    gamesPlayed: 0,
    achievements: [],
    highestLevel: 1,
    infinityBest: 0
};

let timerInterval = null;
let audioContext = null;

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    loadPlayerData();
    createBackgroundCandies();
    setupEventListeners();
    generateLeaderboard();

    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 1500);
});

function loadPlayerData() {
    const saved = localStorage.getItem('typeCandyData');
    if (saved) {
        playerData = { ...playerData, ...JSON.parse(saved) };
    }
    updateStatsDisplay();
    document.getElementById('playerName').value = playerData.name;
}

function savePlayerData() {
    localStorage.setItem('typeCandyData', JSON.stringify(playerData));
    updateStatsDisplay();
}

function updateStatsDisplay() {
    document.getElementById('totalStars').textContent = playerData.totalStars;
    document.getElementById('highScore').textContent = playerData.highScore.toLocaleString();
    document.getElementById('accuracy').textContent = playerData.bestAccuracy + '%';
    document.getElementById('bestWPM').textContent = playerData.bestWPM;
}

// ==================== Background Animation ====================
function createBackgroundCandies() {
    const colors = ['#ff6b9d', '#c44eff', '#4ecdc4', '#ffe66d', '#ff9f43', '#26de81'];
    const container = document.getElementById('bgAnimation');

    for (let i = 0; i < 20; i++) {
        const candy = document.createElement('div');
        candy.className = 'floating-candy';
        candy.style.width = Math.random() * 50 + 20 + 'px';
        candy.style.height = candy.style.width;
        candy.style.background = colors[Math.floor(Math.random() * colors.length)];
        candy.style.left = Math.random() * 100 + '%';
        candy.style.animationDelay = Math.random() * 15 + 's';
        candy.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(candy);
    }
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchScreen(tab.dataset.screen));
    });

    // Mode Selection
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', () => {
            gameState.mode = card.dataset.mode;
            startGame();
        });
    });

    // Difficulty Selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            gameState.difficulty = btn.dataset.difficulty;
        });
    });

    // Typing Input
    const input = document.getElementById('typingInput');
    input.addEventListener('input', handleTyping);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            togglePause();
        }
    });

    // Power-ups
    document.getElementById('freezeBtn').addEventListener('click', useFreeze);
    document.getElementById('skipBtn').addEventListener('click', useSkip);
    document.getElementById('hintBtn').addEventListener('click', useHint);

    // Game Controls
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('quitBtn').addEventListener('click', quitGame);
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        closeModal();
        startGame();
    });
    document.getElementById('nextLevelBtn').addEventListener('click', () => {
        closeModal();
        gameState.currentLevel++;
        startGame();
    });
    document.getElementById('homeBtn').addEventListener('click', () => {
        closeModal();
        switchScreen('home');
    });

    // Settings
    document.getElementById('playerName').addEventListener('change', (e) => {
        playerData.name = e.target.value || 'Player';
        savePlayerData();
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all progress?')) {
            localStorage.removeItem('typeCandyData');
            location.reload();
        }
    });

    // Leaderboard Tabs
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            generateLeaderboard(tab.dataset.period);
        });
    });
}

// ==================== Screen Navigation ====================
function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    document.getElementById(screenName + 'Screen').classList.add('active');
    document.querySelector(`.nav-tab[data-screen="${screenName}"]`).classList.add('active');

    if (screenName !== 'game' && gameState.isPlaying) {
        quitGame();
    }
}

// ==================== Game Logic ====================
function startGame() {
    switchScreen('game');

    const isInfinity = gameState.mode === 'infinity';
    const isLevels = gameState.mode === 'levels';

    // Reset game state
    gameState = {
        ...gameState,
        score: 0,
        combo: 1,
        maxCombo: 1,
        lives: isInfinity ? 5 : 3,
        currentIndex: 0,
        wordsCompleted: 0,
        correctChars: 0,
        totalChars: 0,
        startTime: Date.now(),
        isPaused: false,
        isPlaying: true,
        powerups: { freeze: 3, skip: 2, hint: 3 },
        xp: 0,
        isBossLevel: isLevels && gameState.currentLevel % 5 === 0
    };

    // Reset level for non-level modes
    if (!isLevels) gameState.currentLevel = 1;

    // Set difficulty based on level for infinity/levels modes
    if (isInfinity || isLevels) {
        gameState.difficulty = getDifficultyForLevel(gameState.currentLevel);
    }

    // Set time and words based on mode
    if (isInfinity) {
        gameState.timeLeft = 30;
        gameState.totalWords = 999999;
    } else if (isLevels) {
        gameState.timeLeft = 45 + gameState.currentLevel * 2;
        gameState.totalWords = 5 + Math.floor(gameState.currentLevel / 2);
        if (gameState.isBossLevel) gameState.totalWords += 5;
    } else if (gameState.mode === 'practice') {
        gameState.timeLeft = 999;
        gameState.totalWords = 10;
    } else {
        gameState.timeLeft = 60;
        gameState.totalWords = gameState.mode === 'challenge' ? 999 : 10;
    }

    // Show/hide level UI
    const showLevelUI = isInfinity || isLevels;
    document.getElementById('levelStat').style.display = showLevelUI ? 'flex' : 'none';
    document.getElementById('levelBarContainer').style.display = showLevelUI ? 'block' : 'none';
    document.getElementById('bossIndicator').style.display = gameState.isBossLevel ? 'block' : 'none';

    // Update UI
    updateLives();
    updateLevelDisplay();
    updatePowerupCounts();
    updateGameStats();
    updateProgress();
    document.getElementById('typingInput').value = '';
    document.getElementById('hintText').textContent = '';

    // Get new word
    getNextWord();

    // Start timer
    if (gameState.mode !== 'practice') {
        startTimer();
    } else {
        document.getElementById('gameTimer').textContent = '∞';
    }

    // Focus input
    setTimeout(() => document.getElementById('typingInput').focus(), 100);
}

function getDifficultyForLevel(level) {
    if (level <= 5) return 'easy';
    if (level <= 15) return 'medium';
    if (level <= 30) return 'hard';
    return 'expert';
}

function updateLevelDisplay() {
    document.getElementById('currentLevelDisplay').textContent = 'Level ' + gameState.currentLevel;
    document.getElementById('levelText').textContent = 'Level ' + gameState.currentLevel;
    const xpPercent = Math.min((gameState.xp / gameState.xpToNextLevel) * 100, 100);
    document.getElementById('xpBar').style.width = xpPercent + '%';
    document.getElementById('xpText').textContent = 'XP: ' + gameState.xp + '/' + gameState.xpToNextLevel;
}

function addXP(amount) {
    gameState.xp += amount;
    while (gameState.xp >= gameState.xpToNextLevel) {
        gameState.xp -= gameState.xpToNextLevel;
        levelUp();
    }
    updateLevelDisplay();
}

function levelUp() {
    gameState.currentLevel++;
    gameState.xpToNextLevel = 100 + (gameState.currentLevel - 1) * 25;
    gameState.difficulty = getDifficultyForLevel(gameState.currentLevel);

    if (gameState.mode === 'infinity') {
        gameState.timeLeft += 12;
        gameState.lives = Math.min(gameState.lives + 1, 7);
        updateLives();
    }

    if (gameState.currentLevel % 5 === 0) {
        gameState.isBossLevel = true;
        document.getElementById('bossIndicator').style.display = 'block';
        showAchievement('👹', 'BOSS LEVEL!', 'Type fast to defeat the boss!');
    } else {
        gameState.isBossLevel = false;
        document.getElementById('bossIndicator').style.display = 'none';
    }

    showAchievement('🎉', 'Level Up!', 'Now at Level ' + gameState.currentLevel);
    createConfetti();

    if (gameState.currentLevel > playerData.highestLevel) {
        playerData.highestLevel = gameState.currentLevel;
        savePlayerData();
    }
}

function getNextWord() {
    let words;

    switch (gameState.mode) {
        case 'infinity':
        case 'levels':
        case 'words':
            words = wordLists[gameState.difficulty];
            gameState.currentWord = words[Math.floor(Math.random() * words.length)];
            break;
        case 'sentences':
            words = sentences[gameState.difficulty];
            gameState.currentWord = words[Math.floor(Math.random() * words.length)];
            break;
        case 'quotes':
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            gameState.currentWord = quote.text;
            document.getElementById('hintText').textContent = `— ${quote.author}`;
            break;
        case 'code':
            gameState.currentWord = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            break;
        case 'challenge':
        case 'practice':
        default:
            words = wordLists[gameState.difficulty];
            gameState.currentWord = words[Math.floor(Math.random() * words.length)];
    }

    gameState.currentIndex = 0;
    displayWord();
    document.getElementById('typingInput').value = '';
}

function displayWord() {
    const display = document.getElementById('wordDisplay');
    display.innerHTML = '';

    for (let i = 0; i < gameState.currentWord.length; i++) {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = gameState.currentWord[i];

        if (i < gameState.currentIndex) {
            span.classList.add('correct');
        } else if (i === gameState.currentIndex) {
            span.classList.add('current');
        }

        display.appendChild(span);
    }
}

function handleTyping(e) {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const input = e.target.value;
    const currentChar = input[input.length - 1];
    const expectedChar = gameState.currentWord[gameState.currentIndex];

    gameState.totalChars++;

    if (currentChar === expectedChar) {
        // Correct character
        gameState.correctChars++;
        gameState.currentIndex++;
        gameState.combo++;

        if (gameState.combo > gameState.maxCombo) {
            gameState.maxCombo = gameState.combo;
        }

        playSound('correct');
        createParticle(e.target);

        // Show combo effects
        if (gameState.combo > 1 && gameState.combo % 5 === 0) {
            showCombo(gameState.combo);
        }

        // Check if word completed
        if (gameState.currentIndex >= gameState.currentWord.length) {
            wordCompleted();
        } else {
            displayWord();
        }
    } else if (currentChar !== undefined) {
        // Incorrect character
        gameState.combo = 1;
        playSound('wrong');

        // Shake effect
        e.target.style.animation = 'shake 0.3s ease';
        setTimeout(() => e.target.style.animation = '', 300);

        // Lose life in challenge or infinity mode
        if (gameState.mode === 'challenge' || gameState.mode === 'infinity') {
            loseLife();
        }

        e.target.value = input.slice(0, -1);
    }

    updateGameStats();
}

function wordCompleted() {
    gameState.wordsCompleted++;

    // Calculate score
    const basePoints = gameState.currentWord.length * 10;
    const comboBonus = Math.floor(basePoints * (gameState.combo / 10));
    const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2, expert: 3 }[gameState.difficulty];
    const levelMult = 1 + (gameState.currentLevel - 1) * 0.1;
    const points = Math.floor((basePoints + comboBonus) * difficultyMultiplier * levelMult);

    gameState.score += points;

    // Add XP for infinity/levels modes
    if (gameState.mode === 'infinity' || gameState.mode === 'levels') {
        addXP(Math.floor(points / 5));
    }

    // Add bonus time in infinity mode
    if (gameState.mode === 'infinity') {
        gameState.timeLeft += 2;
        updateTimerDisplay();
    }

    playSound('complete');
    createConfetti();

    // Update progress
    updateProgress();

    // Check if game/level complete
    if (gameState.mode === 'levels' && gameState.wordsCompleted >= gameState.totalWords) {
        endGame(true);
    } else if (gameState.wordsCompleted >= gameState.totalWords && gameState.mode !== 'challenge' && gameState.mode !== 'practice' && gameState.mode !== 'infinity') {
        endGame(true);
    } else {
        getNextWord();
    }
}

function loseLife() {
    gameState.lives--;
    updateLives();

    if (gameState.lives <= 0) {
        endGame(false);
    }
}

function updateLives() {
    const container = document.getElementById('livesContainer');
    container.innerHTML = '';
    const maxLives = gameState.mode === 'infinity' ? 7 : 3;
    for (let i = 0; i < maxLives; i++) {
        const life = document.createElement('span');
        life.className = 'life' + (i >= gameState.lives ? ' lost' : '');
        life.textContent = '❤️';
        container.appendChild(life);
    }
}

function updateProgress() {
    const progress = (gameState.wordsCompleted / gameState.totalWords) * 100;
    document.getElementById('progressBar').style.width = Math.min(progress, 100) + '%';
    const total = gameState.totalWords === 999999 ? '∞' : gameState.totalWords;
    document.getElementById('progressText').textContent = `${gameState.wordsCompleted} / ${total}`;
}

function updateGameStats() {
    document.getElementById('gameScore').textContent = gameState.score.toLocaleString();
    document.getElementById('gameCombo').textContent = 'x' + gameState.combo;

    // Calculate WPM
    const timeElapsed = (Date.now() - gameState.startTime) / 1000 / 60; // in minutes
    const wpm = timeElapsed > 0 ? Math.round((gameState.correctChars / 5) / timeElapsed) : 0;
    document.getElementById('gameWPM').textContent = wpm + ' WPM';
}

// ==================== Timer ====================
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (gameState.isPaused) return;

        gameState.timeLeft--;
        updateTimerDisplay();

        if (gameState.timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timer = document.getElementById('gameTimer');
    timer.textContent = gameState.timeLeft;

    timer.classList.remove('warning', 'danger');
    if (gameState.timeLeft <= 10) {
        timer.classList.add('danger');
    } else if (gameState.timeLeft <= 20) {
        timer.classList.add('warning');
    }
}

// ==================== Power-ups ====================
function useFreeze() {
    if (gameState.powerups.freeze <= 0 || !gameState.isPlaying) return;

    gameState.powerups.freeze--;
    gameState.timeLeft += 10;
    updatePowerupCounts();
    updateTimerDisplay();

    playSound('powerup');
    showAchievement('❄️', 'Time Frozen!', '+10 seconds added');
}

function useSkip() {
    if (gameState.powerups.skip <= 0 || !gameState.isPlaying) return;

    gameState.powerups.skip--;
    updatePowerupCounts();
    getNextWord();

    playSound('powerup');
}

function useHint() {
    if (gameState.powerups.hint <= 0 || !gameState.isPlaying) return;

    gameState.powerups.hint--;
    updatePowerupCounts();

    const hint = gameState.currentWord.substring(0, Math.ceil(gameState.currentWord.length / 2));
    document.getElementById('hintText').textContent = `Hint: "${hint}..."`;

    playSound('powerup');
}

function updatePowerupCounts() {
    document.getElementById('freezeCount').textContent = gameState.powerups.freeze;
    document.getElementById('skipCount').textContent = gameState.powerups.skip;
    document.getElementById('hintCount').textContent = gameState.powerups.hint;

    document.getElementById('freezeBtn').disabled = gameState.powerups.freeze <= 0;
    document.getElementById('skipBtn').disabled = gameState.powerups.skip <= 0;
    document.getElementById('hintBtn').disabled = gameState.powerups.hint <= 0;
}

// ==================== Game End ====================
function togglePause() {
    if (!gameState.isPlaying) return;

    gameState.isPaused = !gameState.isPaused;
    document.getElementById('pauseBtn').textContent = gameState.isPaused ? '▶️ Resume' : '⏸️ Pause';

    if (!gameState.isPaused) {
        document.getElementById('typingInput').focus();
    }
}

function quitGame() {
    clearInterval(timerInterval);
    gameState.isPlaying = false;
    switchScreen('home');
}

function endGame(won) {
    clearInterval(timerInterval);
    gameState.isPlaying = false;

    // Calculate final stats
    const accuracy = gameState.totalChars > 0
        ? Math.round((gameState.correctChars / gameState.totalChars) * 100)
        : 0;
    const timeElapsed = (Date.now() - gameState.startTime) / 1000 / 60;
    const wpm = timeElapsed > 0 ? Math.round((gameState.correctChars / 5) / timeElapsed) : 0;

    // Calculate stars
    let stars = 0;
    if (accuracy >= 70) stars++;
    if (accuracy >= 85) stars++;
    if (accuracy >= 95) stars++;

    // Update player data
    let isNewRecord = false;
    if (gameState.score > playerData.highScore) {
        playerData.highScore = gameState.score;
        isNewRecord = true;
    }
    if (wpm > playerData.bestWPM) {
        playerData.bestWPM = wpm;
    }
    if (accuracy > playerData.bestAccuracy) {
        playerData.bestAccuracy = accuracy;
    }
    if (gameState.mode === 'infinity' && gameState.currentLevel > playerData.infinityBest) {
        playerData.infinityBest = gameState.currentLevel;
    }
    playerData.totalStars += stars;
    playerData.gamesPlayed++;
    savePlayerData();

    // Show results
    showResults(won, gameState.score, accuracy, wpm, gameState.maxCombo, stars, isNewRecord);
}

function showResults(won, score, accuracy, wpm, maxCombo, stars, isNewRecord) {
    const isLevelMode = gameState.mode === 'levels';
    const isInfinityMode = gameState.mode === 'infinity';

    // Set title based on mode
    if (isLevelMode && won) {
        document.getElementById('modalTitle').textContent = '🎯 Level Complete!';
    } else if (isInfinityMode && !won) {
        document.getElementById('modalTitle').textContent = '🌌 Game Over - Level ' + gameState.currentLevel;
    } else {
        document.getElementById('modalTitle').textContent = won ? '🎉 Great Job!' : '😢 Game Over';
    }

    // Show/hide level complete badge
    document.getElementById('levelCompleteBadge').style.display = isLevelMode && won ? 'inline-block' : 'none';
    document.getElementById('completedLevelNum').textContent = gameState.currentLevel;

    // Show/hide next level button
    document.getElementById('nextLevelBtn').style.display = isLevelMode && won ? 'inline-flex' : 'none';

    document.getElementById('resultScore').textContent = score.toLocaleString();
    document.getElementById('resultAccuracy').textContent = accuracy + '%';
    document.getElementById('resultWPM').textContent = wpm;
    document.getElementById('resultCombo').textContent = maxCombo;

    // Animate stars
    const starsDisplay = document.getElementById('starsDisplay');
    const starElements = starsDisplay.querySelectorAll('.star');
    starElements.forEach((star, i) => {
        star.classList.remove('earned');
        star.textContent = '⭐';
        star.style.opacity = '0.3';

        if (i < stars) {
            setTimeout(() => {
                star.style.opacity = '1';
                star.classList.add('earned');
                playSound('star');
            }, (i + 1) * 300);
        }
    });

    // Show new record badge
    document.getElementById('newRecordBadge').style.display = isNewRecord ? 'inline-block' : 'none';

    // Open modal
    document.getElementById('resultsModal').classList.add('active');
}

function closeModal() {
    document.getElementById('resultsModal').classList.remove('active');
}

// ==================== Leaderboard ====================
function generateLeaderboard(period = 'all') {
    const names = ['ProTyper99', 'SpeedDemon', 'KeyMaster', 'TypeNinja', 'SwiftFingers',
        'WordWarrior', 'FlashTyper', 'KeyboardKing', 'RapidRacer', 'TypeTitan'];

    const leaderboard = [];

    // Add current player
    if (playerData.highScore > 0) {
        leaderboard.push({
            name: playerData.name,
            score: playerData.highScore,
            wpm: playerData.bestWPM,
            isPlayer: true
        });
    }

    // Generate fake players
    for (let i = 0; i < 10; i++) {
        const multiplier = period === 'daily' ? 0.3 : period === 'weekly' ? 0.6 : 1;
        leaderboard.push({
            name: names[i],
            score: Math.floor((Math.random() * 50000 + 10000) * multiplier),
            wpm: Math.floor(Math.random() * 80 + 40),
            isPlayer: false
        });
    }

    // Sort by score
    leaderboard.sort((a, b) => b.score - a.score);

    // Render
    const container = document.getElementById('leaderboardList');
    container.innerHTML = '';

    leaderboard.slice(0, 10).forEach((player, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        if (index === 0) item.classList.add('top-1');
        if (index === 1) item.classList.add('top-2');
        if (index === 2) item.classList.add('top-3');
        if (player.isPlayer) item.style.border = '2px solid var(--candy-pink)';

        const medals = ['🥇', '🥈', '🥉'];

        item.innerHTML = `
                    <div class="rank ${index < 3 ? 'rank-medal' : ''}">${index < 3 ? medals[index] : index + 1}</div>
                    <div class="player-info">
                        <div class="player-name">${player.name} ${player.isPlayer ? '(You)' : ''}</div>
                        <div class="player-details">${player.wpm} WPM</div>
                    </div>
                    <div class="player-score">${player.score.toLocaleString()}</div>
                `;

        container.appendChild(item);
    });
}

// ==================== Effects ====================
function showCombo(combo) {
    const display = document.getElementById('comboDisplay');
    display.textContent = `${combo}x COMBO!`;
    display.style.background = `linear-gradient(45deg, var(--candy-pink), var(--candy-purple))`;
    display.style.webkitBackgroundClip = 'text';
    display.style.webkitTextFillColor = 'transparent';
    display.style.backgroundClip = 'text';
    display.classList.remove('show');
    void display.offsetWidth;
    display.classList.add('show');

    setTimeout(() => display.classList.remove('show'), 1000);
}

function createParticle(element) {
    const colors = ['#ff6b9d', '#c44eff', '#4ecdc4', '#ffe66d', '#ff9f43'];
    const rect = element.getBoundingClientRect();

    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    left: ${rect.left + rect.width / 2}px;
                    top: ${rect.top}px;
                    pointer-events: none;
                    z-index: 1000;
                `;
        document.body.appendChild(particle);

        const angle = (Math.random() - 0.5) * Math.PI;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = -Math.random() * 100 - 50;

        let x = 0, y = 0, opacity = 1;
        const animate = () => {
            x += vx * 0.02;
            y += vy * 0.02 + 2;
            opacity -= 0.02;

            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        requestAnimationFrame(animate);
    }
}

function createConfetti() {
    const colors = ['#ff6b9d', '#c44eff', '#4ecdc4', '#ffe66d', '#ff9f43', '#26de81'];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                        position: fixed;
                        width: ${Math.random() * 10 + 5}px;
                        height: ${Math.random() * 10 + 5}px;
                        background: ${colors[Math.floor(Math.random() * colors.length)]};
                        left: ${Math.random() * 100}vw;
                        top: -20px;
                        pointer-events: none;
                        z-index: 1000;
                        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    `;
            document.body.appendChild(confetti);

            let y = 0, rotation = 0;
            const speed = Math.random() * 3 + 2;
            const rotationSpeed = Math.random() * 10 - 5;
            const wobble = Math.random() * 50;
            const wobbleSpeed = Math.random() * 0.1;
            let time = 0;

            const animate = () => {
                y += speed;
                rotation += rotationSpeed;
                time += wobbleSpeed;

                const x = Math.sin(time) * wobble;
                confetti.style.transform = `translateY(${y}px) translateX(${x}px) rotate(${rotation}deg)`;

                if (y < window.innerHeight + 50) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };
            requestAnimationFrame(animate);
        }, i * 30);
    }
}

function showAchievement(icon, title, desc) {
    const popup = document.getElementById('achievementPopup');
    document.getElementById('achievementTitle').textContent = title;
    document.getElementById('achievementDesc').textContent = desc;
    popup.querySelector('.achievement-icon').textContent = icon;

    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 3000);
}

// ==================== Sound Effects ====================
function playSound(type) {
    if (!document.getElementById('soundToggle').checked) return;

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const volume = document.getElementById('volumeSlider').value / 100 * 0.3;

    switch (type) {
        case 'correct':
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'wrong':
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(volume * 0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
        case 'complete':
            [523.25, 659.25, 783.99].forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
                gain.gain.setValueAtTime(volume, audioContext.currentTime + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);
                osc.start(audioContext.currentTime + i * 0.1);
                osc.stop(audioContext.currentTime + i * 0.1 + 0.3);
            });
            break;
        case 'star':
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'powerup':
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
    }
}
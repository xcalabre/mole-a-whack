const holes = document.querySelectorAll('.hole');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const gameOverEl = document.getElementById('game-over');
const startBtn = document.getElementById('start-btn');

let score = 0;
let timeLeft = 30;
let gameInterval;
let bugInterval;
let gameActive = false;

function randomHole() {
  return holes[Math.floor(Math.random() * holes.length)];
}

function showBug() {
  if (!gameActive) return;
  const hole = randomHole();
  if (hole.classList.contains('bug') || hole.classList.contains('rare-bug') || hole.classList.contains('butterfly')) return;

  // Decide which bug to show
  let bugType = 'bug';
  let emoji = '🐛';
  let points = 10;
  let className = 'bug';
  let clickHandler;

  // Butterfly appears more often as time runs out
  let butterflyChance = 0.10;
  if (timeLeft <= 10) butterflyChance = 0.35;
  else if (timeLeft <= 20) butterflyChance = 0.20;
  // 10% rare bug, butterflyChance for butterfly, rest normal bug
  const rand = Math.random();
  if (rand < 0.10) {
    bugType = 'rare-bug';
    emoji = '🪰';
    points = 50;
    className = 'rare-bug';
    clickHandler = () => {
      if (!hole.classList.contains('rare-bug') || !gameActive) return;
      score += points;
      scoreEl.textContent = score;
      hole.textContent = '💥';
      hole.classList.remove('rare-bug');
      hole.classList.add('squashed');
      triggerConfetti();
      setTimeout(() => {
        hole.textContent = '';
        hole.classList.remove('squashed');
      }, 500);
    };
  } else if (rand < 0.10 + butterflyChance) {
    bugType = 'butterfly';
    emoji = '🦋';
    points = -30;
    className = 'butterfly';
    clickHandler = () => {
      if (!hole.classList.contains('butterfly') || !gameActive) return;
      score += points;
      if (score < 0) score = 0;
      scoreEl.textContent = score;
      hole.textContent = '💥';
      hole.classList.remove('butterfly');
      hole.classList.add('squashed-butterfly');
      setTimeout(() => {
        hole.textContent = '';
        hole.classList.remove('squashed-butterfly');
      }, 500);
    };
  } else {
    clickHandler = () => {
      if (!hole.classList.contains('bug') || !gameActive) return;
      score += points;
      scoreEl.textContent = score;
      hole.textContent = '💥';
      hole.classList.remove('bug');
      hole.classList.add('squashed');
      setTimeout(() => {
        hole.textContent = '';
        hole.classList.remove('squashed');
      }, 500);
    };
  }

  hole.textContent = emoji;
  hole.classList.add(className);
  hole.onclick = clickHandler;

  const hideTimer = setTimeout(() => {
    if (hole.classList.contains(className)) {
      hole.textContent = '';
      hole.classList.remove(className);
    }
  }, 1000 + Math.random() * 1000);
}

function triggerConfetti() {
  const confettiColors = ['#43aa8b', '#2196f3', '#d7263d', '#f7b267', '#fff'];
  for (let i = 0; i < 30; i++) {
    const conf = document.createElement('div');
    conf.style.position = 'fixed';
    conf.style.left = (Math.random() * 100) + 'vw';
    conf.style.top = (Math.random() * 40 + 20) + 'vh';
    conf.style.width = '12px';
    conf.style.height = '12px';
    conf.style.borderRadius = '50%';
    conf.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    conf.style.zIndex = 9999;
    conf.style.opacity = 0.8;
    conf.style.pointerEvents = 'none';
    conf.style.transition = 'transform 1.2s ease, opacity 1.2s';
    document.body.appendChild(conf);
    setTimeout(() => {
      conf.style.transform = `translateY(${80 + Math.random() * 40}vh)`;
      conf.style.opacity = 0;
    }, 50);
    setTimeout(() => {
      conf.remove();
    }, 1400);
  }
}

function clearBugs() {
  holes.forEach(hole => {
    hole.textContent = '';
    hole.classList.remove('bug', 'rare-bug', 'butterfly', 'squashed');
    hole.onclick = null;
  });
}

function startGame() {
  score = 0;
  scoreEl.textContent = score;
  timeLeft = 30;
  timerEl.textContent = timeLeft;
  gameOverEl.textContent = '';
  gameActive = true;
  clearBugs();
  startBtn.disabled = true;

  gameInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearInterval(bugInterval);
      gameActive = false;
      gameOverEl.textContent = `Game Over! Final Score: ${score}`;
      startBtn.disabled = false;
    }
  }, 1000);

  bugInterval = setInterval(showBug, 600);
}

startBtn.addEventListener('click', startGame);

let score = 0;
let timeLeft = 30;
let gameInterval;
let timerInterval;

// Start countdown before game begins
function startCountdown(callback) {
  let countdown = 3;
  const countdownDiv = document.createElement('div');
  countdownDiv.id = 'countdown';
  countdownDiv.style.cssText = `
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4rem;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    z-index: 1000;
  `;
  document.body.appendChild(countdownDiv);

  const interval = setInterval(() => {
    countdownDiv.textContent = countdown;
    countdown--;
    if (countdown < 0) {
      clearInterval(interval);
      countdownDiv.remove();
      callback(); // Start the game
    }
  }, 1000);
}

function startGame() {
  score = 0;
  timeLeft = 30;
  updateScore();
  updateTimer();

  // Create Jerry Can and start drop generation
  createJerryCan();

  // Interval for drop creation every second
  gameInterval = setInterval(() => {
    createDrop();
  }, 1000);

  // Timer countdown
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  alert("Time's up! Your final score is: " + score);
}

function createDrop() {
  const drop = document.createElement('div');
  drop.className = 'water-drop'; // Apply base class for drop
  
  const isBadDrop = Math.random() > 0.5; // 50% chance of being bad
  if (isBadDrop) {
    drop.classList.add('bad-drop');
  } else {
    drop.classList.add('good-drop');
  }

  // Randomize X position across the screen
  drop.style.left = Math.random() * 90 + 'vw';
  drop.style.top = '-50px'; // Start just above the container
  
  // Add the drop to the game container
  document.getElementById('game-container').appendChild(drop);

  // Apply falling animation
  drop.style.animation = 'dropFall 3s linear forwards';

  // Handle drop interaction (click event)
  drop.addEventListener('click', () => {
    if (isBadDrop) {
      updateScore(-5);
      showScoreFeedback('-5', 'red');
    } else {
      updateScore(10);
      showScoreFeedback('+10', 'limegreen');
    }
    drop.remove(); // Remove drop after interaction
  });

  // Handle drop falling off-screen (if missed)
  drop.addEventListener('animationend', () => {
    drop.remove();
    if (!isBadDrop) {
      updateScore(-1); // Penalize for missing good drop
      showScoreFeedback('-1', 'red');
    }
  });
}

function createJerryCan() {
  const jerryCan = document.createElement('div');
  jerryCan.id = 'jerry-can';
  jerryCan.className = 'jerry-can';
  document.getElementById('game-container').appendChild(jerryCan);

  // Move jerry can horizontally with mouse
  document.addEventListener('mousemove', (event) => {
    const gameContainer = document.getElementById('game-container');
    const gameRect = gameContainer.getBoundingClientRect();
    const jerryCanWidth = jerryCan.offsetWidth;
    let newLeft = event.clientX - gameRect.left - jerryCanWidth / 2;
    newLeft = Math.max(0, Math.min(newLeft, gameRect.width - jerryCanWidth));
    jerryCan.style.left = `${newLeft}px`;
  });
}

function updateScore(value = 0) {
  score += value;
  document.getElementById('score').textContent = score;
}

function updateTimer() {
  document.getElementById('timer').textContent = timeLeft;
}

function showScoreFeedback(text, color) {
  const feedback = document.createElement('div');
  feedback.textContent = text;
  feedback.className = 'score-feedback';
  feedback.style.color = color;
  document.body.appendChild(feedback);
  setTimeout(() => feedback.remove(), 1000);
}

// Start the countdown when button is clicked
document.getElementById('start-btn').addEventListener('click', () => {
  startCountdown(startGame);
});

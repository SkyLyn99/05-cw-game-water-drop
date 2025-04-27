// Declare global variables
let gameActive = false;
let gameInterval;

// Function to create a water drop
function createDrop() {
  const drop = document.createElement('div');

  // Randomly determine if this drop is good or bad (20% chance of bad)
  const isBadDrop = Math.random() < 0.2;
  drop.className = isBadDrop ? 'water-drop bad-drop' : 'water-drop good-drop';

  // Create random size variation for visual interest
  const scale = 0.8 + Math.random() * 0.7; // Results in 80% to 150% of original size
  drop.style.transform = `scale(${scale})`;

  // Position drop randomly along the width of the game container
  const gameWidth = document.getElementById('game-container').offsetWidth;
  const randomX = Math.random() * (gameWidth - 40); // Ensure drops stay within bounds
  drop.style.left = `${randomX}px`;

  // Set drop animation speed
  drop.style.animationDuration = '4s'; // Default fall duration

  // Add drop to game container
  document.getElementById('game-container').appendChild(drop);

  // Check for collision with the jerry can
  const checkCollision = setInterval(() => {
    const dropRect = drop.getBoundingClientRect();
    const jerryCan = document.getElementById('jerry-can');
    const jerryCanRect = jerryCan.getBoundingClientRect();

    // Check if the drop intersects with the jerry can
    if (
      dropRect.bottom >= jerryCanRect.top &&
      dropRect.top <= jerryCanRect.bottom &&
      dropRect.left <= jerryCanRect.right &&
      dropRect.right >= jerryCanRect.left
    ) {
      if (isBadDrop) {
        updateScoreWithFeedback(-5); // Subtract points for bad drops
      } else {
        updateScoreWithFeedback(10); // Add points for good drops
      }

      drop.remove(); // Remove the drop
      clearInterval(checkCollision); // Stop checking for collisions
    }
  }, 50);

  // Remove drop if it reaches the bottom without being caught
  drop.addEventListener('animationend', () => {
    drop.remove();
    clearInterval(checkCollision); // Stop checking for collisions
  });
}


  // Provide visual feedback
  const feedback = document.createElement('div');
  feedback.className = 'score-feedback';
  feedback.textContent = points > 0 ? `+${points}` : `${points}`;
  document.body.appendChild(feedback);

  setTimeout(() => feedback.remove(), 1000); // Remove feedback after 1 second
}

// Function to create the jerry can
function createJerryCan() {
  const jerryCan = document.createElement('div');
  jerryCan.id = 'jerry-can';
  jerryCan.className = 'jerry-can';
  document.getElementById('game-container').appendChild(jerryCan);

  // Allow the jerry can to be moved horizontally with the mouse
  document.addEventListener('mousemove', (event) => {
    const gameContainer = document.getElementById('game-container');
    const gameRect = gameContainer.getBoundingClientRect();
    const jerryCanWidth = jerryCan.offsetWidth;

    let newLeft = event.clientX - gameRect.left - jerryCanWidth / 2;
    newLeft = Math.max(0, Math.min(newLeft, gameRect.width - jerryCanWidth));
    jerryCan.style.left = `${newLeft}px`;
  });
}

// Game initialization function
function startGame() {
  if (gameActive) return; // Prevent multiple game instances

  gameActive = true; // Set game state to active
  document.getElementById('start-btn').disabled = true; // Disable the start button

  createJerryCan(); // Add the jerry can to the game

  // Start creating drops every 1000ms (1 second)
  gameInterval = setInterval(createDrop, 1000);
}

// Ensure DOM content is loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-btn').addEventListener('click', startGame);
});

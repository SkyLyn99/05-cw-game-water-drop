// Game state variables
let gameActive = false;  // Tracks if game is currently running
let gameInterval;        // Stores the interval that creates drops
// Score tracking
let score = 0;
// Event listener for water drop clicks
document.getElementById('game-container').addEventListener('click', (event) => {
  if (event.target.classList.contains('water-drop')) {
      const isBadDrop = event.target.classList.contains('bad-drop');
      
      // Update score and provide feedback based on drop type
      if (isBadDrop) {
          updateScoreWithFeedback(-5); // Deduct points for bad drops
      } else {
          updateScoreWithFeedback(10); // Add points for good drops
      }
      
      // Remove the clicked drop
      event.target.remove();
  }
});

// Function to update the score dynamically
function updateScore(points) {
  score += points;
  scoreElement.textContent = `Score: ${score}`;
}
// Event listener for the start button
document.getElementById('start-btn').addEventListener('click', startGame);
// Event listener for the stop button
document.getElementById('stop-btn').addEventListener('click', stopGame);

// Function to manage intervals for creating water drops
function manageDropIntervals(intervalTime) {
  if (gameInterval) {
    clearInterval(gameInterval); // Clear existing interval
  }
  gameInterval = setInterval(createDrop, intervalTime); // Set new interval
}
// Function to stop the game
function stopGame() {
  if (!gameActive) return;
  
  gameActive = false;
  clearInterval(gameInterval); // Stop creating drops
  document.getElementById('start-btn').disabled = false; // Enable start button
  
  // Remove all existing drops
  const drops = document.querySelectorAll('.water-drop');
  drops.forEach(drop => drop.remove());
  
  // Reset score
  score = 0;
  updateScore(0);
  
  // Display game over message
  displayFeedback('Game Over! Try again!', 'negative');
}
  // Stop all animations by removing the game container's children
  const gameContainer = document.getElementById('game-container');
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }
  // Reset game state
  const feedbackElement = document.getElementById('feedback');
  if (feedbackElement) {
    feedbackElement.textContent = 'Game Over! Try again!';
    feedbackElement.style.display = 'block';
  } else {
    console.warn('Feedback element not found.');
  }
  // Ensure the "Start Game" button is properly linked
  document.getElementById('start-btn').addEventListener('click', startGame);
// Game initialization function
function startGame() {
  if (gameActive) return; // Prevent multiple game instances

  gameActive = true; // Set game state to active
  document.getElementById('start-btn').disabled = true; // Disable the start button

  // Start creating drops every 1000ms (1 second)
  gameInterval = setInterval(createDrop, 1000);
}
// Announce score updates for screen readers
const scoreElement = document.getElementById('score');
const liveRegion = document.getElementById('live-region');
let currentScore = 0;

function updateScore(newScore) {
  currentScore = newScore;
  scoreElement.textContent = `Score: ${currentScore}`;
  liveRegion.textContent = `Score updated to ${currentScore}`;
}
    
    // Set up initial game state
    gameActive = true;
  document.getElementById('start-btn').disabled = true;

  // Start creating drops every 1000ms (1 second)
  gameInterval = setInterval(createDrop, 1000);

    setTimeout(() => {
      feedbackElement.style.display = 'none';
    }, 2000); // Hide feedback after 2 seconds
  

// Update the score and provide feedback
function updateScoreWithFeedback(points) {
  updateScore(points);
  if (points > 0) {
      displayFeedback('Good job!', 'positive');
  } else {
      displayFeedback('Avoid bad drops!', 'negative');
  }
}
// Function to create the jerry can element
function createJerryCan() {
  const jerryCan = document.createElement('div');
  jerryCan.id = 'jerry-can';
  jerryCan.className = 'jerry-can';
  // Collision logic is handled in the createDrop function
  // Position the jerry can at the bottom center of the game container
  const gameContainer = document.getElementById('game-container');
  jerryCan.style.left = `${(gameContainer.offsetWidth / 2) - 25}px`; // Center horizontally
  jerryCan.style.bottom = '10px'; // Position slightly above the bottom
  
  // Add the jerry can to the game container
  gameContainer.appendChild(jerryCan);
  
  // Enable dragging of the jerry can
  enableJerryCanDrag(jerryCan);
}
// Make the Jerry Can Follow the Mouse
document.addEventListener('mousemove', (event) => {
  const gameContainer = document.getElementById('game-container');
  const jerryCan = document.getElementById('jerry-can');
  
  if (jerryCan && gameContainer) {
    const gameRect = gameContainer.getBoundingClientRect();
    let newLeft = event.clientX - gameRect.left - (jerryCan.offsetWidth / 2);

    // Ensure the jerry can stays within the game container
    newLeft = Math.max(0, Math.min(newLeft, gameRect.width - jerryCan.offsetWidth));
    jerryCan.style.left = `${newLeft}px`;
  }
});
// Function to enable dragging of the jerry can
function enableJerryCanDrag(jerryCan) {
  let isDragging = false;
  let offsetX = 0;

  jerryCan.addEventListener('mousedown', (event) => {
    isDragging = true;
    offsetX = event.clientX - jerryCan.getBoundingClientRect().left;
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const gameContainer = document.getElementById('game-container');
      const gameRect = gameContainer.getBoundingClientRect();
      let newLeft = event.clientX - gameRect.left - offsetX;

      // Ensure the jerry can stays within the game container
      newLeft = Math.max(0, Math.min(newLeft, gameRect.width - jerryCan.offsetWidth));
      jerryCan.style.left = `${newLeft}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

// Modify the createDrop function to interact with the jerry can
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
  drop.addEventListener('animationend', () => {
    const jerryCan = document.querySelector('.jerry-can');
    if (jerryCan) {
      const dropRect = drop.getBoundingClientRect();
      const jerryCanRect = jerryCan.getBoundingClientRect();
      
      // Check if the drop intersects with the jerry can
      if (
        dropRect.bottom >= jerryCanRect.top &&
        dropRect.top <= jerryCanRect.bottom &&
        dropRect.left <= jerryCanRect.right &&
        dropRect.right >= jerryCanRect.left
      ) {
        if (!isBadDrop) {
          updateScoreWithFeedback(15); // Bonus points for collecting with the jerry can
        }
      }
    }
    drop.remove();
  });
}

// Add the jerry can to the game when it starts
document.getElementById('start-btn').addEventListener('click', () => {
  createJerryCan();
});
// Modify the event listener for water drop clicks to use the new feedback function
document.getElementById('game-container').addEventListener('click', (event) => {
  if (event.target.classList.contains('water-drop')) {
    const isBadDrop = event.target.classList.contains('bad-drop');
    
    // Update score and provide feedback based on drop type
    if (isBadDrop) {
      updateScoreWithFeedback(-5); // Deduct points for bad drops
    } else {
      updateScoreWithFeedback(10); // Add points for good drops
    }
    
    // Remove the clicked drop
    event.target.remove();
  }
});
// Function to create and manage individual water drops
function createDrop() {
  const drop = document.createElement('div');
  
  // Randomly determine if this drop is good or bad (20% chance of bad)
  const isBadDrop = Math.random() < 0.2;
  drop.className = isBadDrop ? 'water-drop bad-drop' : 'water-drop good-drop';
  
  // Create random size variation for visual interest
  const scale = 0.8 + Math.random() * 0.7;  // Results in 80% to 150% of original size
  drop.style.transform = `scale(${scale})`;
  
  // Position drop randomly along the width of the game container
  const gameWidth = document.getElementById('game-container').offsetWidth;
  const randomX = Math.random() * (gameWidth - 40); // Ensure drops stay within bounds
  drop.style.left = `${randomX}px`;
  
  // Set drop animation speed
  drop.style.animationDuration = '4s'; // Default fall duration
  
  // Add drop to game container
  document.getElementById('game-container').appendChild(drop);
  
  // Remove drop if it reaches the bottom without being clicked
    drop.addEventListener('animationend', () => {
        drop.remove();
    });
  }
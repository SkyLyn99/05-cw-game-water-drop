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

// Game initialization function
function startGame() {
  if (gameActive) return; // Prevent multiple game instances

  gameActive = true; // Set game state to active
  document.getElementById('start-btn').addEventListener('click', startGame);

  // Start creating drops every 1000ms (1 second)
  gameInterval = setInterval(createDrop, 1000);
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
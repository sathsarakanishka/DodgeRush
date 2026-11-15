<<<<<<< Updated upstream

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Get elements from the HTML page
const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");

=======
<<<<<<< Updated upstream
=======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");
>>>>>>> Stashed changes
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const instructions = document.getElementById("instructions");
const startButton = document.getElementById("startButton");

<<<<<<< Updated upstream
=======
// Banana challenge elements
>>>>>>> Stashed changes
const bananaChallenge = document.getElementById("bananaChallenge");
const bananaQuestion = document.getElementById("bananaQuestion");
const bananaAnswer = document.getElementById("bananaAnswer");
const submitBanana = document.getElementById("submitBanana");
const bananaMessage = document.getElementById("bananaMessage");

<<<<<<< Updated upstream
// Load game images
=======
// Load road and car images
>>>>>>> Stashed changes
const roadImage = new Image();
roadImage.src = "assets/road.png";

const playerCarImage = new Image();
playerCarImage.src = "assets/player-car.png";

const enemyCarImage = new Image();
enemyCarImage.src = "assets/enemy-car.png";

<<<<<<< Updated upstream
// X positions of the three driving lanes
const lanePositions = [40, 160, 280];

// Game status variables
=======
// Three lane positions
const lanePositions = [40, 160, 280];

>>>>>>> Stashed changes
let isRunning = false;
let isChallenging = false;

let carLane = 1;
let carPositionX = lanePositions[carLane];

const carPositionY = 420;
const carWidth = 40;
const carHeight = 70;

<<<<<<< Updated upstream
// Score and obstacle variables
=======
>>>>>>> Stashed changes
let obstacles = [];
let score = 0;
let frame = 0;
let animationId = null;

<<<<<<< Updated upstream
// Banana challenge variables
let bananaSolution = null;
const bonusPoints = 50;
let bonusLevelUsed = false;

// Get the saved best score from local storage
let bestScore = Number(localStorage.getItem("carDodgeBest")) || 0;
bestText.textContent = bestScore;

// Check whether all game images have loaded
=======
// Banana API variables
let bananaSolution = null;
const bonusPoints = 50;
<<<<<<< Updated upstream

// Best score
let bestScore = Number(localStorage.getItem("carDodgeBest")) || 0;
bestText.textContent = bestScore;


=======

// Allow only one bonus challenge per game
let bonusLevelUsed = false;

// Best score comes from MongoDB
let bestScore = 0;
bestText.textContent = "Loading...";


// Load the player's best score from MongoDB
async function loadBestScore() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        bestText.textContent = "Login required";
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/leaderboard/best",
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            throw new Error("Could not load best score");
        }

        const data = await response.json();

        bestScore = Number(data.bestScore) || 0;
        bestText.textContent = bestScore;

    } catch (error) {
        console.error("Best score error:", error);
        bestText.textContent = "Unavailable";
    }
}


// Load the best score when the game page opens
loadBestScore();


>>>>>>> Stashed changes
// Check whether all images have loaded
>>>>>>> Stashed changes
function imagesReady() {
    return (
        roadImage.complete &&
        roadImage.naturalWidth > 0 &&
        playerCarImage.complete &&
        playerCarImage.naturalWidth > 0 &&
        enemyCarImage.complete &&
        enemyCarImage.naturalWidth > 0
    );
}

<<<<<<< Updated upstream
// Draw the road background
=======

<<<<<<< Updated upstream
// Draw road image
=======
// Draw the road
>>>>>>> Stashed changes
>>>>>>> Stashed changes
function drawRoad() {
    ctx.drawImage(
        roadImage,
        0,
        0,
        canvas.width,
        canvas.height
    );
}

<<<<<<< Updated upstream
// Draw the player's car
=======

<<<<<<< Updated upstream
// Draw player car image
=======
// Draw the player's car
>>>>>>> Stashed changes
>>>>>>> Stashed changes
function drawCar() {
    ctx.drawImage(
        playerCarImage,
        carPositionX,
        carPositionY,
        carWidth,
        carHeight
    );
}

<<<<<<< Updated upstream
// Create a new obstacle in a random lane
=======

<<<<<<< Updated upstream
// Create enemy car in a random lane
=======
// Create an enemy car in a random lane
>>>>>>> Stashed changes
>>>>>>> Stashed changes
function createObstacle() {
    const lane = Math.floor(Math.random() * 3);

    obstacles.push({
        x: lanePositions[lane],
        y: -60,
        width: 40,
        height: 60
    });
}

<<<<<<< Updated upstream
// Draw all enemy cars
=======

// Draw enemy cars
>>>>>>> Stashed changes
function drawObstacles() {
    for (const obstacle of obstacles) {
        ctx.drawImage(
            enemyCarImage,
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
        );
    }
}

<<<<<<< Updated upstream
// Check whether the player's car hits an obstacle
=======

// Check collision between cars
>>>>>>> Stashed changes
function checkCollision(car, obstacle) {
    return (
        car.x < obstacle.x + obstacle.width &&
        car.x + car.width > obstacle.x &&
        car.y < obstacle.y + obstacle.height &&
        car.y + car.height > obstacle.y
    );
}

<<<<<<< Updated upstream
// Draw all game objects on the canvas
=======

<<<<<<< Updated upstream
// Draw complete game
=======
// Draw the complete game
>>>>>>> Stashed changes
>>>>>>> Stashed changes
function drawGame() {
    if (!imagesReady()) return;

    drawRoad();
    drawObstacles();
    drawCar();
}

<<<<<<< Updated upstream
// Get a new math puzzle from the Banana API
=======

// Load a puzzle from Banana API
>>>>>>> Stashed changes
async function loadBananaChallenge() {
    isRunning = false;
    isChallenging = true;

    bananaChallenge.style.display = "flex";
    bananaQuestion.style.display = "none";

    bananaAnswer.value = "";
    bananaMessage.textContent = "Loading puzzle...";

    submitBanana.disabled = true;
    bananaSolution = null;

    try {
        const response = await fetch(
            "https://marcconrad.com/uob/banana/api.php?out=json"
        );

        if (!response.ok) {
            throw new Error("Banana API request failed");
        }

        const data = await response.json();

<<<<<<< Updated upstream
        // Check whether the API returned a valid puzzle
=======
>>>>>>> Stashed changes
        if (!data.question || data.solution === undefined) {
            throw new Error("Invalid API response");
        }

<<<<<<< Updated upstream
        const solution = Number(data.solution);

        if (!Number.isFinite(solution)) {
            throw new Error("Invalid puzzle solution");
        }

        // Display the puzzle image
=======
        bananaSolution = Number(data.solution);

<<<<<<< Updated upstream
>>>>>>> Stashed changes
        bananaQuestion.onload = function() {
            bananaQuestion.style.display = "block";
        };

        bananaQuestion.onerror = function() {
<<<<<<< Updated upstream
            bananaMessage.textContent =
                "Could not load puzzle image. Try again.";

=======
            bananaMessage.textContent = "Could not load puzzle image.";
=======
        bananaQuestion.onload = function () {
            bananaQuestion.style.display = "block";
        };

        bananaQuestion.onerror = function () {
            bananaMessage.textContent =
                "Could not load puzzle image.";

>>>>>>> Stashed changes
>>>>>>> Stashed changes
            submitBanana.disabled = true;
            bananaSolution = null;
        };

        bananaQuestion.src = data.question;
<<<<<<< Updated upstream
        bananaSolution = solution;

        bananaMessage.textContent =
            "Solve the puzzle to continue!";

=======
<<<<<<< Updated upstream
=======

        bananaMessage.textContent =
            "Solve the puzzle to continue!";
>>>>>>> Stashed changes

        bananaMessage.textContent = "Solve the puzzle to continue!";
>>>>>>> Stashed changes
        submitBanana.disabled = false;

    } catch (error) {
        console.error("Banana API error:", error);

        bananaMessage.textContent =
<<<<<<< Updated upstream
            "Could not load the puzzle. Please try again.";
=======
            "Could not load the puzzle. Try again.";
>>>>>>> Stashed changes

        bananaSolution = null;
        submitBanana.disabled = true;
    }
}

<<<<<<< Updated upstream
// Check the answer entered by the player
=======

<<<<<<< Updated upstream
// Check Banana puzzle answer
=======
// Submit the final score and open the leaderboard
async function goToLeaderboard() {

    // Save this game's score for the leaderboard page
    sessionStorage.setItem("lastScore", String(score));

    const token = sessionStorage.getItem("token");

    if (token) {
        try {
            const response = await fetch(
                "http://localhost:5000/api/leaderboard/submit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        score: score
                    })
                }
            );

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();

            // Update Best with the value returned by MongoDB
            bestScore = Number(data.bestScore) || 0;
            bestText.textContent = bestScore;

        } catch (error) {
            console.error("Score submission error:", error);
        }
    }

    // Open the separate leaderboard page
    window.location.href = "leaderboard.html";
}


// Check the Banana puzzle answer
>>>>>>> Stashed changes
>>>>>>> Stashed changes
function checkBananaAnswer() {
    if (!isChallenging || bananaSolution === null) {
        return;
    }

    const answer = bananaAnswer.value.trim();

    if (answer === "") {
<<<<<<< Updated upstream
        bananaMessage.textContent = "Please enter your answer.";
=======
        bananaMessage.textContent =
            "Please enter your answer.";

>>>>>>> Stashed changes
        return;
    }

    submitBanana.disabled = true;

<<<<<<< Updated upstream
    // Award bonus points for a correct answer
    if (Number(answer) === bananaSolution) {
=======
    if (Number(answer) === bananaSolution) {

<<<<<<< Updated upstream
        // Correct answer
=======
        // Add bonus points for a correct answer
>>>>>>> Stashed changes
>>>>>>> Stashed changes
        score += bonusPoints;
        scoreText.textContent = score;

        bananaMessage.textContent =
            "Correct! +" + bonusPoints + " bonus points!";

<<<<<<< Updated upstream
        bananaSolution = null;

        // Continue the game after a short delay
=======
<<<<<<< Updated upstream
        bananaSolution = null;

>>>>>>> Stashed changes
        setTimeout(function() {
            bananaChallenge.style.display = "none";

            isChallenging = false;
            isRunning = true;

            drawGame();

            animationId = requestAnimationFrame(updateGame);
<<<<<<< Updated upstream
        }, 1200);

    } else {
        // End the game if the answer is incorrect
=======

        }, 1200);

    } else {

        // Incorrect answer
>>>>>>> Stashed changes
        bananaMessage.textContent = "Wrong answer! Game Over!";

        bananaSolution = null;

        setTimeout(function() {
            bananaChallenge.style.display = "none";
            endGame();
<<<<<<< Updated upstream
        }, 1200);
    }
}

// Main game loop
=======

        }, 1200);
=======
    } else {

        // Show an incorrect answer message
        bananaMessage.textContent =
            "Wrong answer! Game Over!";
>>>>>>> Stashed changes
    }

    // Prevent another answer from being submitted
    bananaSolution = null;

    // Wait 3 seconds before opening the leaderboard
    setTimeout(function () {
        bananaChallenge.style.display = "none";

        isChallenging = false;
        isRunning = false;

        goToLeaderboard();

    }, 3000);
}


<<<<<<< Updated upstream
// Update game
=======
// Update the game
>>>>>>> Stashed changes
>>>>>>> Stashed changes
function updateGame() {
    if (!isRunning) return;

    frame++;

<<<<<<< Updated upstream
    // Create a new obstacle every 60 frames
=======
<<<<<<< Updated upstream
    // Create enemy every 60 frames
=======
    // Create an enemy car every 60 frames
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    if (frame % 60 === 0) {
        createObstacle();
    }

<<<<<<< Updated upstream
    // Move obstacles down the road
=======
    // Move enemy cars
>>>>>>> Stashed changes
    for (const obstacle of obstacles) {
        obstacle.y += 4;
    }

<<<<<<< Updated upstream
    // Remove obstacles that have left the screen
=======
<<<<<<< Updated upstream
    // Remove enemies outside canvas
=======
    // Remove enemy cars outside the canvas
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    obstacles = obstacles.filter(
        obstacle => obstacle.y < canvas.height
    );

<<<<<<< Updated upstream
    // Increase the score as the player survives
=======
<<<<<<< Updated upstream
    // Increase normal score
=======
    // Increase the normal score
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    if (frame % 10 === 0) {
        score++;
        scoreText.textContent = score;
    }

<<<<<<< Updated upstream
    // Get the player's current position
=======
    // Player collision area
>>>>>>> Stashed changes
    const player = {
        x: carPositionX,
        y: carPositionY,
        width: carWidth,
        height: carHeight
    };

<<<<<<< Updated upstream
    // Check for collisions with enemy cars
    for (const obstacle of obstacles) {
        if (checkCollision(player, obstacle)) {
            cancelAnimationFrame(animationId);
            animationId = null;

            // Show the bonus level only once per game
=======
    // Check for collisions
    for (const obstacle of obstacles) {
        if (checkCollision(player, obstacle)) {

<<<<<<< Updated upstream
            // Pause game and open Banana challenge
            cancelAnimationFrame(animationId);
            animationId = null;

            loadBananaChallenge();
=======
            // Stop the game animation
            cancelAnimationFrame(animationId);
            animationId = null;

            // Open the bonus challenge only once
>>>>>>> Stashed changes
            if (!bonusLevelUsed) {
                bonusLevelUsed = true;
                loadBananaChallenge();
            } else {
                endGame();
            }

<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
            return;
        }
    }

<<<<<<< Updated upstream
    // Redraw the game and continue the loop
=======
>>>>>>> Stashed changes
    drawGame();

    animationId = requestAnimationFrame(updateGame);
}

<<<<<<< Updated upstream
// Move the player's car between lanes
=======

<<<<<<< Updated upstream
// Move player between three lanes
=======
// Move the player between three lanes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
function moveCar(direction) {
    if (!isRunning) return;

    carLane += direction;

<<<<<<< Updated upstream
    // Keep the car inside the road
=======
    // First lane boundary
>>>>>>> Stashed changes
    if (carLane < 0) {
        carLane = 0;
    }

<<<<<<< Updated upstream
=======
    // Third lane boundary
>>>>>>> Stashed changes
    if (carLane > 2) {
        carLane = 2;
    }

    carPositionX = lanePositions[carLane];

    drawGame();
}

<<<<<<< Updated upstream
// Start a new game
function startGame() {
    if (!imagesReady()) {
        message.textContent = "Loading images...";
        instructions.textContent =
            "Please check your assets folder.";

=======

<<<<<<< Updated upstream
// Start or restart game
=======
// Start or restart the game
>>>>>>> Stashed changes
function startGame() {
    if (!imagesReady()) {
        message.textContent = "Loading images...";

        instructions.textContent =
            "Please check your assets folder.";
>>>>>>> Stashed changes
        overlay.style.display = "flex";
        return;
    }

<<<<<<< Updated upstream
    // Stop any previous animation
=======
>>>>>>> Stashed changes
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

<<<<<<< Updated upstream
    // Reset the Banana challenge
    bananaChallenge.style.display = "none";
    bananaQuestion.src = "";

    bananaSolution = null;
    isChallenging = false;
    isRunning = true;

    bonusLevelUsed = false;

    // Reset the player's position and score
=======
    bananaChallenge.style.display = "none";
    bananaSolution = null;

    isChallenging = false;
    isRunning = true;

<<<<<<< Updated upstream
=======
    // Reset the game
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    carLane = 1;
    carPositionX = lanePositions[carLane];

    obstacles = [];
    score = 0;
    frame = 0;
<<<<<<< Updated upstream

    scoreText.textContent = score;

    // Update the starting screen
    message.textContent = "Game Started!";
    instructions.textContent =
        "Use ← → or A / D to move.";
=======
    bonusLevelUsed = false;

    scoreText.textContent = score;

    message.textContent = "Game Started!";
<<<<<<< Updated upstream
    instructions.textContent = "Use ← → or A / D to move.";
=======

    instructions.textContent =
        "Use ← → or A / D to move.";
>>>>>>> Stashed changes
>>>>>>> Stashed changes

    startButton.textContent = "Play Again";
    overlay.style.display = "none";

    drawGame();

<<<<<<< Updated upstream
    // Start the game loop
    animationId = requestAnimationFrame(updateGame);
}

// End the game and save the best score
=======
    animationId = requestAnimationFrame(updateGame);
}


<<<<<<< Updated upstream
// End game
=======
// End the game
>>>>>>> Stashed changes
>>>>>>> Stashed changes
function endGame() {
    isRunning = false;
    isChallenging = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

<<<<<<< Updated upstream
    // Update the best score if the current score is higher
    if (score > bestScore) {
        bestScore = score;

        localStorage.setItem("carDodgeBest", score);
        bestText.textContent = bestScore;
    }

    // Display the Game Over screen
    message.textContent = "Game Over!";
    instructions.textContent =
        "Your final score: " + score;
=======
<<<<<<< Updated upstream
    // Save best score
    if (score > bestScore) {
        bestScore = score;

        localStorage.setItem("carDodgeBest", bestScore);
        bestText.textContent = bestScore;
    }

    message.textContent = "Game Over!";
    instructions.textContent = "Your final score: " + score;
=======
    message.textContent = "Game Over!";

    instructions.textContent =
        "Your final score: " + score;
>>>>>>> Stashed changes
>>>>>>> Stashed changes

    startButton.textContent = "Play Again";
    overlay.style.display = "flex";
}

<<<<<<< Updated upstream
// Handle keyboard controls
document.addEventListener("keydown", function(event) {
=======

// Keyboard controls
<<<<<<< Updated upstream
document.addEventListener("keydown", function(event) {
=======
document.addEventListener("keydown", function (event) {
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    if (!isRunning) return;

    const key = event.key.toLowerCase();

    if (key === "arrowleft" || key === "a") {
        event.preventDefault();
        moveCar(-1);

    } else if (key === "arrowright" || key === "d") {
        event.preventDefault();
        moveCar(1);
    }
});

<<<<<<< Updated upstream
// Handle mobile left and right buttons
document.getElementById("leftButton")
    .addEventListener("click", function() {
        moveCar(-1);
    });

document.getElementById("rightButton")
    .addEventListener("click", function() {
        moveCar(1);
    });

// Handle Banana challenge submission
=======
<<<<<<< Updated upstream

// Mobile left button
document.getElementById("leftButton").addEventListener("click", function() {
    moveCar(-1);
});


// Mobile right button
document.getElementById("rightButton").addEventListener("click", function() {
    moveCar(1);
});


// Submit Banana answer
submitBanana.addEventListener("click", checkBananaAnswer);


// Start button
startButton.addEventListener("click", startGame);


// Allow Enter key to submit Banana answer
bananaAnswer.addEventListener("keydown", function(event) {
=======

// Mobile left button
document.getElementById("leftButton").addEventListener(
    "click",
    function () {
        moveCar(-1);
    }
);


// Mobile right button
document.getElementById("rightButton").addEventListener(
    "click",
    function () {
        moveCar(1);
    }
);


// Submit Banana answer
>>>>>>> Stashed changes
submitBanana.addEventListener(
    "click",
    checkBananaAnswer
);

<<<<<<< Updated upstream
// Allow the player to submit an answer using Enter
bananaAnswer.addEventListener("keydown", function(event) {
=======

// Start button
startButton.addEventListener(
    "click",
    startGame
);


// Allow Enter key to submit the Banana answer
bananaAnswer.addEventListener("keydown", function (event) {
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    if (event.key === "Enter") {
        checkBananaAnswer();
    }
});

<<<<<<< Updated upstream
// Start the game when the start button is clicked
startButton.addEventListener("click", startGame);

// Count successfully loaded images
=======

// Handle image loading errors
function handleImageError() {
    message.textContent = "Image could not be loaded";

    instructions.textContent =
        "Check road.png, player-car.png and enemy-car.png in assets.";

    overlay.style.display = "flex";
}


// Initial image loading
>>>>>>> Stashed changes
let loadedImages = 0;

function handleImageLoad() {
    loadedImages++;

    if (loadedImages === 3) {
        drawGame();
    }
}

<<<<<<< Updated upstream
// Display an error if a game image cannot load
function handleImageError() {
    message.textContent = "Image could not be loaded";

    instructions.textContent =
        "Check road.png, player-car.png and enemy-car.png in assets.";

    overlay.style.display = "flex";
}

// Register image loading and error events
=======
>>>>>>> Stashed changes
roadImage.onload = handleImageLoad;
playerCarImage.onload = handleImageLoad;
enemyCarImage.onload = handleImageLoad;

roadImage.onerror = handleImageError;
playerCarImage.onerror = handleImageError;
enemyCarImage.onerror = handleImageError;
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes

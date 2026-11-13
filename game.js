
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Get elements from the HTML page
const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");

const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const instructions = document.getElementById("instructions");
const startButton = document.getElementById("startButton");

const bananaChallenge = document.getElementById("bananaChallenge");
const bananaQuestion = document.getElementById("bananaQuestion");
const bananaAnswer = document.getElementById("bananaAnswer");
const submitBanana = document.getElementById("submitBanana");
const bananaMessage = document.getElementById("bananaMessage");

// Load game images
const roadImage = new Image();
roadImage.src = "assets/road.png";

const playerCarImage = new Image();
playerCarImage.src = "assets/player-car.png";

const enemyCarImage = new Image();
enemyCarImage.src = "assets/enemy-car.png";

// X positions of the three driving lanes
const lanePositions = [40, 160, 280];

// Game status variables
let isRunning = false;
let isChallenging = false;

let carLane = 1;
let carPositionX = lanePositions[carLane];

const carPositionY = 420;
const carWidth = 40;
const carHeight = 70;

// Score and obstacle variables
let obstacles = [];
let score = 0;
let frame = 0;
let animationId = null;

// Banana challenge variables
let bananaSolution = null;
const bonusPoints = 50;
let bonusLevelUsed = false;

// Get the saved best score from local storage
let bestScore = Number(localStorage.getItem("carDodgeBest")) || 0;
bestText.textContent = bestScore;

// Check whether all game images have loaded
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

// Draw the road background
function drawRoad() {
    ctx.drawImage(
        roadImage,
        0,
        0,
        canvas.width,
        canvas.height
    );
}

// Draw the player's car
function drawCar() {
    ctx.drawImage(
        playerCarImage,
        carPositionX,
        carPositionY,
        carWidth,
        carHeight
    );
}

// Create a new obstacle in a random lane
function createObstacle() {
    const lane = Math.floor(Math.random() * 3);

    obstacles.push({
        x: lanePositions[lane],
        y: -60,
        width: 40,
        height: 60
    });
}

// Draw all enemy cars
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

// Check whether the player's car hits an obstacle
function checkCollision(car, obstacle) {
    return (
        car.x < obstacle.x + obstacle.width &&
        car.x + car.width > obstacle.x &&
        car.y < obstacle.y + obstacle.height &&
        car.y + car.height > obstacle.y
    );
}

// Draw all game objects on the canvas
function drawGame() {
    if (!imagesReady()) return;

    drawRoad();
    drawObstacles();
    drawCar();
}

// Get a new math puzzle from the Banana API
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

        // Check whether the API returned a valid puzzle
        if (!data.question || data.solution === undefined) {
            throw new Error("Invalid API response");
        }

        const solution = Number(data.solution);

        if (!Number.isFinite(solution)) {
            throw new Error("Invalid puzzle solution");
        }

        // Display the puzzle image
        bananaQuestion.onload = function() {
            bananaQuestion.style.display = "block";
        };

        bananaQuestion.onerror = function() {
            bananaMessage.textContent =
                "Could not load puzzle image. Try again.";

            submitBanana.disabled = true;
            bananaSolution = null;
        };

        bananaQuestion.src = data.question;
        bananaSolution = solution;

        bananaMessage.textContent =
            "Solve the puzzle to continue!";

        submitBanana.disabled = false;

    } catch (error) {
        console.error("Banana API error:", error);

        bananaMessage.textContent =
            "Could not load the puzzle. Please try again.";

        bananaSolution = null;
        submitBanana.disabled = true;
    }
}

// Check the answer entered by the player
function checkBananaAnswer() {
    if (!isChallenging || bananaSolution === null) {
        return;
    }

    const answer = bananaAnswer.value.trim();

    if (answer === "") {
        bananaMessage.textContent = "Please enter your answer.";
        return;
    }

    submitBanana.disabled = true;

    // Award bonus points for a correct answer
    if (Number(answer) === bananaSolution) {
        score += bonusPoints;
        scoreText.textContent = score;

        bananaMessage.textContent =
            "Correct! +" + bonusPoints + " bonus points!";

        bananaSolution = null;

        // Continue the game after a short delay
        setTimeout(function() {
            bananaChallenge.style.display = "none";

            isChallenging = false;
            isRunning = true;

            drawGame();

            animationId = requestAnimationFrame(updateGame);
        }, 1200);

    } else {
        // End the game if the answer is incorrect
        bananaMessage.textContent = "Wrong answer! Game Over!";

        bananaSolution = null;

        setTimeout(function() {
            bananaChallenge.style.display = "none";
            endGame();
        }, 1200);
    }
}

// Main game loop
function updateGame() {
    if (!isRunning) return;

    frame++;

    // Create a new obstacle every 60 frames
    if (frame % 60 === 0) {
        createObstacle();
    }

    // Move obstacles down the road
    for (const obstacle of obstacles) {
        obstacle.y += 4;
    }

    // Remove obstacles that have left the screen
    obstacles = obstacles.filter(
        obstacle => obstacle.y < canvas.height
    );

    // Increase the score as the player survives
    if (frame % 10 === 0) {
        score++;
        scoreText.textContent = score;
    }

    // Get the player's current position
    const player = {
        x: carPositionX,
        y: carPositionY,
        width: carWidth,
        height: carHeight
    };

    // Check for collisions with enemy cars
    for (const obstacle of obstacles) {
        if (checkCollision(player, obstacle)) {
            cancelAnimationFrame(animationId);
            animationId = null;

            // Show the bonus level only once per game
            if (!bonusLevelUsed) {
                bonusLevelUsed = true;
                loadBananaChallenge();
            } else {
                endGame();
            }

            return;
        }
    }

    // Redraw the game and continue the loop
    drawGame();

    animationId = requestAnimationFrame(updateGame);
}

// Move the player's car between lanes
function moveCar(direction) {
    if (!isRunning) return;

    carLane += direction;

    // Keep the car inside the road
    if (carLane < 0) {
        carLane = 0;
    }

    if (carLane > 2) {
        carLane = 2;
    }

    carPositionX = lanePositions[carLane];

    drawGame();
}

// Start a new game
function startGame() {
    if (!imagesReady()) {
        message.textContent = "Loading images...";
        instructions.textContent =
            "Please check your assets folder.";

        overlay.style.display = "flex";
        return;
    }

    // Stop any previous animation
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    // Reset the Banana challenge
    bananaChallenge.style.display = "none";
    bananaQuestion.src = "";

    bananaSolution = null;
    isChallenging = false;
    isRunning = true;

    bonusLevelUsed = false;

    // Reset the player's position and score
    carLane = 1;
    carPositionX = lanePositions[carLane];

    obstacles = [];
    score = 0;
    frame = 0;

    scoreText.textContent = score;

    // Update the starting screen
    message.textContent = "Game Started!";
    instructions.textContent =
        "Use ← → or A / D to move.";

    startButton.textContent = "Play Again";
    overlay.style.display = "none";

    drawGame();

    // Start the game loop
    animationId = requestAnimationFrame(updateGame);
}

// End the game and save the best score
function endGame() {
    isRunning = false;
    isChallenging = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

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

    startButton.textContent = "Play Again";
    overlay.style.display = "flex";
}

// Handle keyboard controls
document.addEventListener("keydown", function(event) {
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
submitBanana.addEventListener(
    "click",
    checkBananaAnswer
);

// Allow the player to submit an answer using Enter
bananaAnswer.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkBananaAnswer();
    }
});

// Start the game when the start button is clicked
startButton.addEventListener("click", startGame);

// Count successfully loaded images
let loadedImages = 0;

function handleImageLoad() {
    loadedImages++;

    if (loadedImages === 3) {
        drawGame();
    }
}

// Display an error if a game image cannot load
function handleImageError() {
    message.textContent = "Image could not be loaded";

    instructions.textContent =
        "Check road.png, player-car.png and enemy-car.png in assets.";

    overlay.style.display = "flex";
}

// Register image loading and error events
roadImage.onload = handleImageLoad;
playerCarImage.onload = handleImageLoad;
enemyCarImage.onload = handleImageLoad;

roadImage.onerror = handleImageError;
playerCarImage.onerror = handleImageError;
enemyCarImage.onerror = handleImageError;

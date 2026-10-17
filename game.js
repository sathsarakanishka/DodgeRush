
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const instructions = document.getElementById("instructions");
const startButton = document.getElementById("startButton");

// Load the images
const roadImage = new Image();
roadImage.src = "assets/road.png";

const playerCarImage = new Image();
playerCarImage.src = "assets/player-car.png";

const enemyCarImage = new Image();
enemyCarImage.src = "assets/enemy-car.png";

// Three lane positions
const lanePositions = [40, 160, 280];

let isRunning = false;
let carLane = 1;
let carPositionX = lanePositions[carLane];

const carPositionY = 420;
const carWidth = 40;
const carHeight = 70;

let obstacles = [];
let score = 0;
let frame = 0;
let animationId = null;

// Load the saved best score
let bestScore = Number(localStorage.getItem("carDodgeBest")) || 0;
bestText.textContent = bestScore;


// Check that all images have loaded
function imagesReady() {
    return (
        roadImage.complete && roadImage.naturalWidth > 0 &&
        playerCarImage.complete && playerCarImage.naturalWidth > 0 &&
        enemyCarImage.complete && enemyCarImage.naturalWidth > 0
    );
}


// Draw the road image
function drawRoad() {
    ctx.drawImage(
        roadImage,
        0,
        0,
        canvas.width,
        canvas.height
    );
}


// Draw the player's car image
function drawCar() {
    ctx.drawImage(
        playerCarImage,
        carPositionX,
        carPositionY,
        carWidth,
        carHeight
    );
}


// Create an obstacle in a random lane
function createObstacle() {
    const lane = Math.floor(Math.random() * 3);

    obstacles.push({
        x: lanePositions[lane],
        y: -60,
        width: 40,
        height: 60
    });
}


// Draw enemy car images
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


// Check if two cars collide
function checkCollision(car, obstacle) {
    return (
        car.x < obstacle.x + obstacle.width &&
        car.x + car.width > obstacle.x &&
        car.y < obstacle.y + obstacle.height &&
        car.y + car.height > obstacle.y
    );
}


// Draw the complete game
function drawGame() {
    if (!imagesReady()) return;

    drawRoad();
    drawObstacles();
    drawCar();
}


// Update the game
function updateGame() {
    if (!isRunning) return;

    frame++;

    // Create an enemy every 60 frames
    if (frame % 60 === 0) {
        createObstacle();
    }

    // Move enemies down
    for (const obstacle of obstacles) {
        obstacle.y += 4;
    }

    // Remove enemies that leave the screen
    obstacles = obstacles.filter(
        obstacle => obstacle.y < canvas.height
    );

    // Increase score
    if (frame % 10 === 0) {
        score++;
        scoreText.textContent = score;
    }

    // Player's collision area
    const player = {
        x: carPositionX,
        y: carPositionY,
        width: carWidth,
        height: carHeight
    };

    // Check collisions
    for (const obstacle of obstacles) {
        if (checkCollision(player, obstacle)) {
            endGame();
            return;
        }
    }

    drawGame();

    animationId = requestAnimationFrame(updateGame);
}


// Move the player between the three lanes
function moveCar(direction) {
    if (!isRunning) return;

    carLane += direction;

    // Stay within the three lanes
    if (carLane < 0) carLane = 0;
    if (carLane > 2) carLane = 2;

    carPositionX = lanePositions[carLane];

    drawGame();
}


// Start or restart the game
function startGame() {
    if (!imagesReady()) {
        message.textContent = "Loading images...";
        instructions.textContent =
            "Check that all three images exist in the assets folder.";
        overlay.style.display = "flex";
        return;
    }

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    carLane = 1;
    carPositionX = lanePositions[carLane];

    obstacles = [];
    score = 0;
    frame = 0;
    isRunning = true;

    scoreText.textContent = score;
    message.textContent = "Game Started!";
    instructions.textContent = "Use ← → or A / D to move.";
    startButton.textContent = "Play Again";
    overlay.style.display = "none";

    drawGame();

    animationId = requestAnimationFrame(updateGame);
}


// End the game
function endGame() {
    isRunning = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("carDodgeBest", bestScore);
        bestText.textContent = bestScore;
    }

    message.textContent = "Game Over!";
    instructions.textContent = "Your score: " + score;
    startButton.textContent = "Play Again";
    overlay.style.display = "flex";
}


// Keyboard controls
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


// Mobile controls
document.getElementById("leftButton").addEventListener("click", function() {
    moveCar(-1);
});

document.getElementById("rightButton").addEventListener("click", function() {
    moveCar(1);
});


// Start button
startButton.addEventListener("click", startGame);


// Handle image loading errors
function handleImageError() {
    message.textContent = "Image could not be loaded";
    instructions.textContent =
        "Check assets/road.png, assets/player-car.png and assets/enemy-car.png.";
    overlay.style.display = "flex";
}

roadImage.onerror = handleImageError;
playerCarImage.onerror = handleImageError;
enemyCarImage.onerror = handleImageError;


// Draw the initial screen when all images are ready
let loadedImages = 0;

function handleImageLoad() {
    loadedImages++;

    if (loadedImages === 3) {
        drawGame();
    }
}

roadImage.onload = handleImageLoad;
playerCarImage.onload = handleImageLoad;
enemyCarImage.onload = handleImageLoad;

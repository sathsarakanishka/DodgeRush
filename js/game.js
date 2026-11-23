import {
    gameState,
    PLAYER,
    BONUS_INTERVAL
} from "./gameConfig.js";

import {
    drawGame,
    imagesReady,
    createObstacle,
    checkCollision
} from "./gameRenderer.js";

import {
    showBananaChallenge,
    checkBananaAnswer,
    hideBananaChallenge
} from "./bananaChallenge.js";

import {
    loadBestScore,
    submitScore
} from "./scoreService.js";

import { setupControls } from "./controls.js";

// HTML elements
const canvas = document.getElementById("gameCanvas");

const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");

const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const instructions = document.getElementById("instructions");
const startButton = document.getElementById("startButton");

const submitBanana = document.getElementById("submitBanana");
const bananaAnswer = document.getElementById("bananaAnswer");

let bestScore = null;

// Load the player's best score
async function initialiseGame() {

    bestText.textContent = "Loading...";

    bestScore = await loadBestScore();

    if (bestScore === null) {

        bestText.textContent = "Login required";

    } else {

        bestText.textContent = bestScore;

    }

    // Register keyboard and mobile controls
    setupControls();

}

// Start or restart the game
function startGame() {

    // Check whether game images have loaded
    if (!imagesReady()) {

        message.textContent = "Loading images...";

        instructions.textContent =
            "Please check your assets folder.";

        overlay.style.display = "flex";

        return;

    }

    // Stop any previous animation
    if (gameState.animationId !== null) {

        cancelAnimationFrame(gameState.animationId);

        gameState.animationId = null;

    }

    // Reset the Banana challenge
    hideBananaChallenge();

    // Reset game state
    gameState.isRunning = true;
    gameState.isChallenging = false;

    gameState.carLane = 1;
    gameState.carPositionX = 160;

    gameState.obstacles = [];

    gameState.score = 0;
    gameState.frame = 0;

    // First bonus challenge appears at 50 points
    gameState.nextBonusScore = BONUS_INTERVAL;

    scoreText.textContent = 0;

    // Update starting screen
    message.textContent = "Game Started!";

    instructions.textContent =
        "Use ← → or A / D to move.";

    startButton.textContent = "Play Again";

    overlay.style.display = "none";

    drawGame();

    // Start the game loop
    gameState.animationId =
        requestAnimationFrame(updateGame);
}

// Start a bonus challenge
function startBonusLevel() {

    gameState.isRunning = false;
    gameState.isChallenging = true;

    // Prepare the next bonus milestone
    gameState.nextBonusScore += BONUS_INTERVAL;

    // Pause the game animation
    if (gameState.animationId !== null) {

        cancelAnimationFrame(gameState.animationId);

        gameState.animationId = null;

    }

    // Display the Banana challenge
    showBananaChallenge(function (earnedPoints) {

        // Add the points earned from the challenge
        gameState.score += earnedPoints;

        scoreText.textContent = gameState.score;

        // Resume the game
        gameState.isChallenging = false;
        gameState.isRunning = true;

        drawGame();

        gameState.animationId =
            requestAnimationFrame(updateGame);

    });

}

// Main game loop
function updateGame() {

    if (!gameState.isRunning) return;

    gameState.frame++;

    // Create an enemy car every 60 frames
    if (gameState.frame % 60 === 0) {

        createObstacle();

    }

    // Move enemy cars
    for (const obstacle of gameState.obstacles) {

        obstacle.y += 4;

    }

    // Remove enemy cars outside the canvas
    gameState.obstacles = gameState.obstacles.filter(
        obstacle => obstacle.y < canvas.height
    );

    // Increase normal score
    if (gameState.frame % 10 === 0) {

        gameState.score++;

        scoreText.textContent = gameState.score;

    }

    // Player collision area
    const player = {

        x: gameState.carPositionX,
        y: PLAYER.y,

        width: PLAYER.width,
        height: PLAYER.height

    };

    // Check collision with enemy cars
    for (const obstacle of gameState.obstacles) {

        if (checkCollision(player, obstacle)) {

            endGame();

            return;

        }

    }

    // Check whether the player reached a bonus milestone
    if (gameState.score >= gameState.nextBonusScore) {

        startBonusLevel();

        return;

    }

    // Draw the game
    drawGame();

    // Continue the animation
    gameState.animationId =
        requestAnimationFrame(updateGame);

}

// End the game
async function endGame() {

    if (!gameState.isRunning) return;

    gameState.isRunning = false;
    gameState.isChallenging = false;

    // Stop the animation
    if (gameState.animationId !== null) {

        cancelAnimationFrame(gameState.animationId);

        gameState.animationId = null;

    }

    // Display Game Over screen
    message.textContent = "Game Over!";

    instructions.textContent =
        "Your final score: " + gameState.score;

    startButton.textContent = "Play Again";

    overlay.style.display = "flex";

    // Submit final score to MongoDB
    const result = await submitScore(gameState.score);

    // Update Best score using the database response
    if (result && result.bestScore !== undefined) {

        bestScore = Number(result.bestScore) || 0;

        bestText.textContent = bestScore;

    }

}

// Start button event
startButton.addEventListener("click", startGame);

// Submit Banana answer using button
submitBanana.addEventListener("click", function () {

    checkBananaAnswer();

});

// Submit Banana answer using Enter key
bananaAnswer.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        checkBananaAnswer();

    }

});

// Initialise the game
initialiseGame();
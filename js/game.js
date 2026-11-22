const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const instructions = document.getElementById("instructions");
const startButton = document.getElementById("startButton");

// Banana challenge elements
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

// Three lane positions
const lanePositions = [40, 160, 280];

let isRunning = false;
let isChallenging = false;

let carLane = 1;
let carPositionX = lanePositions[carLane];

const carPositionY = 420;
const carWidth = 40;
const carHeight = 70;

let obstacles = [];
let score = 0;
let frame = 0;
let animationId = null;

// Banana API variables
let bananaSolution = null;
const bonusPoints = 50;

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


// Check whether all images have loaded
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


// Draw the road
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


// Create an enemy car in a random lane
function createObstacle() {
    const lane = Math.floor(Math.random() * 3);

    obstacles.push({
        x: lanePositions[lane],
        y: -60,
        width: 40,
        height: 60
    });
}


// Draw enemy cars
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


// Check collision between cars
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


// Load a puzzle from Banana API
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

        if (!data.question || data.solution === undefined) {
            throw new Error("Invalid API response");
        }

        bananaSolution = Number(data.solution);
        console.log("Banana puzzle solution:", bananaSolution);

        bananaQuestion.onload = function () {
            bananaQuestion.style.display = "block";
        };

        bananaQuestion.onerror = function () {
            bananaMessage.textContent =
                "Could not load puzzle image.";

            submitBanana.disabled = true;
            bananaSolution = null;
        };

        bananaQuestion.src = data.question;

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
function checkBananaAnswer() {
    if (!isChallenging || bananaSolution === null) {
        return;
    }

    const answer = bananaAnswer.value.trim();

    if (answer === "") {
        bananaMessage.textContent =
            "Please enter your answer.";

        return;
    }

    submitBanana.disabled = true;

    if (Number(answer) === bananaSolution) {

        // Add bonus points for a correct answer
        score += bonusPoints;
        scoreText.textContent = score;

        bananaMessage.textContent =
            "Correct! +" + bonusPoints + " bonus points!";

    } else {

        // Show an incorrect answer message
        bananaMessage.textContent =
            "Wrong answer! Game Over!!!";
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

// Update the game
function updateGame() {
    if (!isRunning) return;

    frame++;

    // Create an enemy car every 60 frames
    if (frame % 60 === 0) {
        createObstacle();
    }

    // Move enemy cars
    for (const obstacle of obstacles) {
        obstacle.y += 4;
    }

    // Remove enemy cars outside the canvas
    obstacles = obstacles.filter(
        obstacle => obstacle.y < canvas.height
    );

    // Increase the normal score
    if (frame % 10 === 0) {
        score++;
        scoreText.textContent = score;
    }

    // Player collision area
    const player = {
        x: carPositionX,
        y: carPositionY,
        width: carWidth,
        height: carHeight
    };

    // Check for collisions
    for (const obstacle of obstacles) {
        if (checkCollision(player, obstacle)) {

            // Stop the game animation
            cancelAnimationFrame(animationId);
            animationId = null;

            // Open the bonus challenge only once
            if (!bonusLevelUsed) {
                bonusLevelUsed = true;
                loadBananaChallenge();
            } else {
                endGame();
            }

            return;
        }
    }

    drawGame();

    animationId = requestAnimationFrame(updateGame);
}


// Move the player between three lanes
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


// Start or restart the game
function startGame() {
    if (!imagesReady()) {
        message.textContent = "Loading images...";

        instructions.textContent =
            "Please check your assets folder.";

        overlay.style.display = "flex";
        return;
    }

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    bananaChallenge.style.display = "none";
    bananaSolution = null;

    isChallenging = false;
    isRunning = true;

    // Reset the game
    carLane = 1;
    carPositionX = lanePositions[carLane];

    obstacles = [];
    score = 0;
    frame = 0;
    bonusLevelUsed = false;

    scoreText.textContent = score;

    message.textContent = "Game Started!";

    instructions.textContent =
        "Use ← → or A / D to move.";

    startButton.textContent = "Play Again";
    overlay.style.display = "none";

    drawGame();

    animationId = requestAnimationFrame(updateGame);
}


// End the game
function endGame() {
    isRunning = false;
    isChallenging = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    message.textContent = "Game Over!";

    instructions.textContent =
        "Your final score: " + score;

    startButton.textContent = "Play Again";
    overlay.style.display = "flex";
}


// Keyboard controls
document.addEventListener("keydown", function (event) {
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
submitBanana.addEventListener(
    "click",
    checkBananaAnswer
);


// Start button
startButton.addEventListener(
    "click",
    startGame
);


// Allow Enter key to submit the Banana answer
bananaAnswer.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        checkBananaAnswer();
    }
});


// Handle image loading errors
function handleImageError() {
    message.textContent = "Image could not be loaded";

    instructions.textContent =
        "Check road.png, player-car.png and enemy-car.png in assets.";

    overlay.style.display = "flex";
}


// Initial image loading
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

roadImage.onerror = handleImageError;
playerCarImage.onerror = handleImageError;
enemyCarImage.onerror = handleImageError;
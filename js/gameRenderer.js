
import {
    gameState,
    PLAYER,
    LANE_POSITIONS
} from "./gameConfig.js";

// Canvas elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load game images
const roadImage = new Image();
roadImage.src = "assets/road.png";

const playerCarImage = new Image();
playerCarImage.src = "assets/player-car.png";

const enemyCarImage = new Image();
enemyCarImage.src = "assets/enemy-car.png";

// Check whether all images have loaded
export function imagesReady() {

    return (
        roadImage.complete &&
        roadImage.naturalWidth > 0 &&

        playerCarImage.complete &&
        playerCarImage.naturalWidth > 0 &&

        enemyCarImage.complete &&
        enemyCarImage.naturalWidth > 0
    );

}

// Draw the complete game
export function drawGame() {

    if (!imagesReady()) return;

    // Draw road background
    ctx.drawImage(
        roadImage,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Draw enemy cars
    for (const obstacle of gameState.obstacles) {

        ctx.drawImage(
            enemyCarImage,
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
        );

    }

    // Draw player's car
    ctx.drawImage(
        playerCarImage,
        gameState.carPositionX,
        PLAYER.y,
        PLAYER.width,
        PLAYER.height
    );

}

// Create an enemy car in a random lane
export function createObstacle() {

    const lane = Math.floor(
        Math.random() * LANE_POSITIONS.length
    );

    gameState.obstacles.push({

        x: LANE_POSITIONS[lane],
        y: -60,

        width: 40,
        height: 60

    });

}

// Check collision between two cars
export function checkCollision(car, obstacle) {

    return (

        car.x < obstacle.x + obstacle.width &&

        car.x + car.width > obstacle.x &&

        car.y < obstacle.y + obstacle.height &&

        car.y + car.height > obstacle.y

    );

}
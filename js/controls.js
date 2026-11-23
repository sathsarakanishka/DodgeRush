
import {
    gameState,
    LANE_POSITIONS
} from "./gameConfig.js";

import { drawGame } from "./gameRenderer.js";

// Move the player's car
export function moveCar(direction) {

    if (!gameState.isRunning) return;

    gameState.carLane += direction;

    // Keep the player inside the three lanes
    gameState.carLane = Math.max(
        0,
        Math.min(2, gameState.carLane)
    );

    gameState.carPositionX =
        LANE_POSITIONS[gameState.carLane];

    drawGame();

}

// Register keyboard and mobile controls
export function setupControls() {

    // Keyboard controls
    document.addEventListener("keydown", function (event) {

        if (!gameState.isRunning) return;

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
    document.getElementById("leftButton")
        .addEventListener("click", function () {

            moveCar(-1);

        });

    // Mobile right button
    document.getElementById("rightButton")
        .addEventListener("click", function () {

            moveCar(1);

        });

}
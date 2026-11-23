
import {
    BONUS_POINTS,
    BONUS_TIME
} from "./gameConfig.js";

// Banana challenge elements
const bananaChallenge = document.getElementById("bananaChallenge");
const bananaQuestion = document.getElementById("bananaQuestion");
const bananaAnswer = document.getElementById("bananaAnswer");
const submitBanana = document.getElementById("submitBanana");
const bananaMessage = document.getElementById("bananaMessage");
const bananaTimer = document.getElementById("bananaTimer");

// Challenge variables
let bananaSolution = null;
let countdownInterval = null;
let completionCallback = null;
let challengeFinished = false;
let finishDelay = null;

// Load a new puzzle from Banana API
export async function showBananaChallenge(onComplete) {

    // Store the callback that resumes the game
    completionCallback = onComplete;

    challengeFinished = false;
    bananaSolution = null;

    // Display the challenge
    bananaChallenge.style.display = "flex";
    bananaQuestion.style.display = "none";

    bananaQuestion.onload = null;
    bananaQuestion.onerror = null;

    bananaAnswer.value = "";

    bananaMessage.textContent = "Loading puzzle...";

    bananaTimer.textContent = BONUS_TIME;

    submitBanana.disabled = true;

    try {

        // Request a puzzle from Banana API
        const response = await fetch(
            "https://marcconrad.com/uob/banana/api.php?out=json"
        );

        if (!response.ok) {
            throw new Error("Banana API request failed");
        }

        const data = await response.json();

        // Check the API response
        if (!data.question || data.solution === undefined) {
            throw new Error("Invalid Banana API response");
        }

        bananaSolution = Number(data.solution);

        // Display the puzzle after its image loads
        bananaQuestion.onload = function () {

            if (challengeFinished) return;

            bananaQuestion.style.display = "block";

            bananaMessage.textContent =
                "Solve the puzzle before time runs out!";

            submitBanana.disabled = false;

            // Start countdown after the image loads
            startCountdown();

        };

        // Handle puzzle image errors
        bananaQuestion.onerror = function () {

            bananaMessage.textContent =
                "Could not load puzzle. No bonus points.";

            finishChallenge(false);

        };

        bananaQuestion.src = data.question;

    } catch (error) {

        console.error("Banana API error:", error);

        bananaMessage.textContent =
            "Could not load puzzle. Continuing game...";

        finishChallenge(false);

    }

}

// Start the countdown timer
function startCountdown() {

    let remainingTime = BONUS_TIME;

    bananaTimer.textContent = remainingTime;

    clearInterval(countdownInterval);

    countdownInterval = setInterval(function () {

        remainingTime--;

        bananaTimer.textContent = remainingTime;

        if (remainingTime <= 0) {

            bananaMessage.textContent =
                "Time is up! No bonus points.";

            finishChallenge(false);

        }

    }, 1000);

}

// Check the player's answer
export function checkBananaAnswer() {

    if (challengeFinished || bananaSolution === null) {
        return;
    }

    const answer = bananaAnswer.value.trim();

    // Check for an empty answer
    if (answer === "") {

        bananaMessage.textContent =
            "Please enter your answer.";

        return;

    }

    if (Number(answer) === bananaSolution) {

        // Correct answer
        bananaMessage.textContent =
            `Correct! +${BONUS_POINTS} bonus points!`;

        finishChallenge(true);

    } else {

        // Incorrect answer
        bananaMessage.textContent =
            "Wrong answer! No bonus points.";

        finishChallenge(false);

    }

}

// Finish the challenge and return to the game
function finishChallenge(correct) {

    // Prevent multiple submissions
    if (challengeFinished) return;

    challengeFinished = true;

    clearInterval(countdownInterval);
    countdownInterval = null;

    bananaSolution = null;

    submitBanana.disabled = true;

    // Award points only for a correct answer
    const earnedPoints = correct ? BONUS_POINTS : 0;

    // Keep the result visible briefly
    finishDelay = setTimeout(function () {

        bananaChallenge.style.display = "none";

        if (completionCallback) {

            completionCallback(earnedPoints);

            completionCallback = null;

        }

        finishDelay = null;

    }, 1000);

}

// Hide and reset the challenge
export function hideBananaChallenge() {

    clearInterval(countdownInterval);
    countdownInterval = null;

    clearTimeout(finishDelay);
    finishDelay = null;

    challengeFinished = true;
    bananaSolution = null;
    completionCallback = null;

    bananaQuestion.onload = null;
    bananaQuestion.onerror = null;
    bananaQuestion.src = "";

    bananaAnswer.value = "";

    bananaChallenge.style.display = "none";

    submitBanana.disabled = true;

}

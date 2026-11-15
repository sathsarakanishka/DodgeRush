const leaderboardBody = document.getElementById("leaderboardBody");
const leaderboardMessage = document.getElementById("leaderboardMessage");

const playerNameText = document.getElementById("playerName");
const playerScoreText = document.getElementById("playerScore");

const playAgainButton = document.getElementById("playAgainButton");
const loginButton = document.getElementById("loginButton");

// Get player information from the current session
const playerName = sessionStorage.getItem("playerName");
const playerScore = sessionStorage.getItem("lastScore");

// Display the player's result
playerNameText.textContent = playerName || "Guest";

if (playerScore !== null) {
    playerScoreText.textContent = playerScore;
} else {
    playerScoreText.textContent = "Not available";
}

// Hide the login button if the player is already logged in
if (sessionStorage.getItem("token")) {
    loginButton.style.display = "none";
}


// Load leaderboard from MongoDB
async function loadLeaderboard() {
    leaderboardMessage.textContent = "Loading leaderboard...";

    try {
        const response = await fetch(
            "http://localhost:5000/api/leaderboard/top"
        );

        if (!response.ok) {
            throw new Error("Could not load leaderboard");
        }

        const data = await response.json();

        // Clear existing rows
        leaderboardBody.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            leaderboardMessage.textContent =
                "No scores available yet.";

            return;
        }

        leaderboardMessage.textContent = "";

        // Display the top 10 players
        data.forEach(function (player, index) {

            const row = document.createElement("tr");

            // Highlight the current player
            if (
                playerName &&
                player.username === playerName
            ) {
                row.classList.add("current-player");
            }

            const rankCell = document.createElement("td");
            rankCell.textContent = index + 1;

            const nameCell = document.createElement("td");
            nameCell.textContent = player.username;

            const scoreCell = document.createElement("td");
            scoreCell.textContent = player.score;

            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(scoreCell);

            leaderboardBody.appendChild(row);
        });

    } catch (error) {
        console.error("Leaderboard error:", error);

        leaderboardMessage.textContent =
            "Could not load leaderboard. Please try again.";
    }
}


// Play again
playAgainButton.addEventListener("click", function () {
    window.location.href = "index.html";
});


// Login
loginButton.addEventListener("click", function () {
    window.location.href = "login.html";
});


// Load leaderboard when the page opens
loadLeaderboard();
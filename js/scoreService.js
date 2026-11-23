
const API_URL = "http://localhost:5000/api/leaderboard";

// Get the player's best score from MongoDB
export async function loadBestScore() {

    const token = sessionStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {

        const response = await fetch(
            `${API_URL}/best`,
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

        return Number(data.bestScore) || 0;

    } catch (error) {

        console.error("Best score error:", error);

        return null;

    }

}

// Submit the final score to MongoDB
export async function submitScore(score) {

    const token = sessionStorage.getItem("token");

    // Save the score for the leaderboard page
    sessionStorage.setItem("lastScore", String(score));

    if (!token) {
        return null;
    }

    try {

        const response = await fetch(
            `${API_URL}/submit`,
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
            throw new Error("Score submission failed");
        }

        const data = await response.json();

        return data;

    } catch (error) {

        console.error("Score submission error:", error);

        return null;

    }

}

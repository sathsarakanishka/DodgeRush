const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const loginMessage = document.getElementById("loginMessage");

    loginMessage.textContent = "Checking login details...";

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        // Save login session
        sessionStorage.setItem("token", data.token);

        sessionStorage.setItem(
            "playerEmail",
            data.user.email
        );

        sessionStorage.setItem(
            "playerName",
            data.user.username
        );

        loginMessage.textContent = "Login successful!";

        // Open game
        window.location.href = "index.html";

    } catch (error) {

        loginMessage.textContent = error.message;

        console.error("Login error:", error);
    }

});
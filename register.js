
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const registerMessage = document.getElementById("registerMessage");
    const registerButton = document.getElementById("registerButton");

    // Password strength requirements
    const strongPassword = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9\s]).{8,}$/;

    // Check password confirmation
    if (password !== confirmPassword) {
        registerMessage.textContent = "Passwords do not match.";
        registerMessage.style.color = "#fca5a5";
        return;
    }

    // Check password strength
    if (!strongPassword.test(password)) {
        registerMessage.textContent =
            "Password must be at least 8 characters and contain one uppercase letter and one special symbol.";

        registerMessage.style.color = "#fca5a5";
        return;
    }

    registerButton.disabled = true;
    registerMessage.textContent = "Creating your account...";
    registerMessage.style.color = "#cbd5e1";

    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed.");
        }

        registerMessage.textContent =
            "Registration successful! Redirecting to login...";

        registerMessage.style.color = "#86efac";

        // Redirect to login page
        setTimeout(function() {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        registerMessage.textContent = error.message;
        registerMessage.style.color = "#fca5a5";

        console.error("Registration error:", error);

    } finally {
        registerButton.disabled = false;
    }
});

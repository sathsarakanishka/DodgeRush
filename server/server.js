const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

<<<<<<< Updated upstream
// Authentication routes
app.use("/api/auth", require("./routes/auth"));
=======
// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/leaderboard", require("./routes/leaderboard"));
>>>>>>> Stashed changes

// Leaderboard routes
app.use("/api/leaderboard", require("./routes/leaderboard"));

// Test route
app.get("/", (req, res) => {
    res.send("Car Dodge API is running!");
});

<<<<<<< Updated upstream
// Connect to MongoDB
=======
<<<<<<< Updated upstream
// Connect MongoDB
=======
// Connect to MongoDB
>>>>>>> Stashed changes
>>>>>>> Stashed changes
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

<<<<<<< Updated upstream
        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
=======
        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
>>>>>>> Stashed changes
    });
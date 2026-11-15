<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

<<<<<<< Updated upstream
module.exports = mongoose.model("Score", scoreSchema);
=======
module.exports = mongoose.model("Score", scoreSchema);
>>>>>>> Stashed changes

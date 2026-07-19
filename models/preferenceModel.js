const mongoose = require('mongoose');

const userPrefernceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
            unique: true,
        },

        category: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
); 

module.exports = mongoose.model("Prefrence", userPrefernceSchema);
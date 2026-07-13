const User = require("../models/userModel");

const updatePreference = async (req, res) => {
    try {
        const { preferences } = req.body;

        if (!preferences || !Array.isArray(preferences)) {
            return res.status(400).json({
                message: "Preferences must be provided as an array",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { preferences },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Preferences updated successfully",
            preferences: updatedUser.preferences,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getPreference = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Preferences fetched successfully",
            preferences: user.preferences || [],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    updatePreference,
    getPreference,
};
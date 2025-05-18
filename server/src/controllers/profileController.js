const User = require("../models/userModels");
const { handleUserProfile } = require("../utils/profile/userProfileHandlers");
const { handleProfileUpdate } = require("../utils/profile/userProfileHandlers");
const { generateUpdateMessage } = require("../utils/profile/messageGenerators");
const { USER_NOT_FOUND_MSG, GOOGLE_AUTH_MSG } = require("../utils/profile/userProfileHandlers");

const SERVER_ERROR_MSG = "Server error";

exports.getUserProfile = async (req, res) => {
    try {
        const profile = await handleUserProfile(req.user.id);
        res.json(profile);
    } catch (err) {
        res.status(err.message === USER_NOT_FOUND_MSG ? 404 : 500).json({ message: err.message || SERVER_ERROR_MSG });
    }
};

exports.updateProfile = async (req, res) => {
    const { email, username, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) throw new Error(USER_NOT_FOUND_MSG);

        const updatedFields = await handleProfileUpdate(user, email, username, oldPassword, newPassword);
        const message = generateUpdateMessage(updatedFields);
        res.json({ message });
    } catch (err) {
        console.error(err);
        const clientErrorMessages = new Set([
            "Invalid email format",
            "Email is already in use",
            "Old password is incorrect",
            "Same old and new password provided.",
            `${GOOGLE_AUTH_MSG} email.`,
            `${GOOGLE_AUTH_MSG} password.`,
        ]);
        const statusCode = clientErrorMessages.has(err.message) ? 400 : 500;
        res.status(statusCode).json({ message: err.message || SERVER_ERROR_MSG });
    }
};

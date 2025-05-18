const User = require("../../models/userModels");
const { updateUserEmail } = require("../email/emailHelpers");
const { updateUserPassword } = require("./passwordHelpers");
const { hasAuthService } = require("./authServices");

const USER_NOT_FOUND_MSG = "User not found";
const GOOGLE_AUTH_MSG = "You've previously logged in using an external service. You cannot change your";

exports.handleUserProfile = async (userId) => {
    const user = await User.findById(userId).select("-_id username email connectServices");
    if (!user) throw new Error(USER_NOT_FOUND_MSG);

    return {
        ...user._doc,
        connectServices: Array.from(user.connectServices.keys()),
    };
};

exports.handleProfileUpdate = async (user, email, username, oldPassword, newPassword) => {
    const updatedFields = [];
    const hasGoogleAuth = hasAuthService(user, "google");

    if (username && username !== user.username) {
        user.username = username;
        updatedFields.push("Username");
    }
    if (email && email !== user.email) {
        if (hasGoogleAuth) throw new Error(`${GOOGLE_AUTH_MSG} email.`);
        await updateUserEmail(user, email);
        updatedFields.push("Email");
    }
    if (oldPassword && newPassword) {
        if (oldPassword === newPassword) throw new Error("Same old and new password provided.");
        if (hasGoogleAuth) throw new Error(`${GOOGLE_AUTH_MSG} password.`);
        await updateUserPassword(user, oldPassword, newPassword);
        updatedFields.push("Password");
    }
    await user.save();
    return updatedFields;
};

exports.USER_NOT_FOUND_MSG = USER_NOT_FOUND_MSG;
exports.GOOGLE_AUTH_MSG = GOOGLE_AUTH_MSG;

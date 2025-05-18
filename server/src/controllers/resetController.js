const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const { sendPasswordResetMail } = require("../utils/email/emailHelpers");

const SERVER_ERROR_MSG = "Server error";
const INVALID_TOKEN_MSG = "Password reset token is invalid or has expired.";

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.password) {
            return res.status(400).json({
                message: "You authenticated using OAuth2. Please login using your OAuth2 service.",
            });
        }
        user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        sendPasswordResetMail(email, user.resetPasswordToken);
        res.json({ message: "Reset link email sent" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

exports.displayResetForm = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) return res.status(400).send(INVALID_TOKEN_MSG);
        res.redirect(`https://techparisarea.com/reset-password?token=${token}`);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

exports.updatePassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required." });
    }
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ message: INVALID_TOKEN_MSG });
        user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: "Password has been updated!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

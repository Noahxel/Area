const User = require("../models/userModels");
const hashPassword = require("../utils/auth/password");
const { generateUserToken } = require("../utils/token/userTokenUtils");
const { verifyUserPassword } = require("../utils/auth/userAuth");
const { isValidEmail, sendConfirmationMail } = require("../utils/email/emailHelpers");
const { generateConfirmationToken } = require("../utils/token/userTokenUtils");
const { getGoogleUserProfile, getGoogleAccessToken } = require("../utils/auth/googleAuth");
const { findUserByExternalId, createNewExternalUser } = require("../utils/auth/externalUserService");

exports.sign_up = async (req, res, next) => {
    if (!isValidEmail(req.body.email)) return res.status(400).json({ message: "Invalid email format" });
    if (!req.body.username) return res.status(400).json({ message: "Username is required" });
    if (!req.body.authProvider && !req.body.password) return res.status(400).json({ message: "Password is required" });
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(409).json({ message: "User already exists" });
        const user = new User(req.body);
        user.username = req.body.username;
        if (req.body.password) user.password = await hashPassword(req.body.password);
        user.confirmationToken = generateConfirmationToken();
        await user.save();
        sendConfirmationMail(user.email, user.confirmationToken);
        res.status(200).json({ message: "User registered. Please confirm your email." });
    } catch (err) {
        next(err);
    }
};

exports.confirm = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate({ confirmationToken: req.params.token }, { confirmed: true, confirmationToken: undefined });
        if (!user) return res.status(400).json({ message: "Invalid token" });
        res.status(200).json({ message: "Account confirmed successfully" });
    } catch (err) {
        next(err);
    }
};

exports.confirmEmailChange = async (req, res) => {
    try {
        const user = await User.findOne({ emailChangeToken: req.params.token });
        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }
        if (user.pendingEmail) {
            user.email = user.pendingEmail;
            user.pendingEmail = undefined;
        }
        user.emailChangeToken = undefined;
        await user.save();
        res.status(200).json({ message: "Email changed successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.sign_in = async (req, res, next) => {
    try {
        const user = await verifyUserPassword(req.body.email, req.body.password);
        if (!user) return res.status(401).json({ message: "User does not exist or invalid credentials" });
        if (!user.confirmed) return res.status(400).json({ message: "Please confirm your account first" });
        const token = await generateUserToken(user._id);
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};

exports.redirectToGoogle = (req, res) => {
    const redirectUri = "https://api.techparisarea.com/auth/google/callback";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&scope=profile%20email`;
    res.redirect(authUrl);
};

exports.handleGoogleCallback = async (req, res) => {
    const code = req.query.code;
    const redirectUri = "https://api.techparisarea.com/auth/google/callback";

    try {
        const { data } = await getGoogleAccessToken(code, redirectUri);
        const { access_token } = data;
        const profileResponse = await getGoogleUserProfile(access_token);
        const email = profileResponse.data.email;
        let user = await findUserByExternalId("google", email);
        if (!user) user = await createNewExternalUser("google", email);
        const token = await generateUserToken(user._id);
        res.status(200).redirect(`https://techparisarea.com/applets?token=${token}`);
    } catch (error) {
        console.error("Error during Google authentication:", error);
        res.status(500).redirect("https://techparisarea.com/login");
    }
};

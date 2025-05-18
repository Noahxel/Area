const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../models/userModels");
const { genericRefreshToken } = require("./genericTokenRefresher");
const { SERVICES } = require("../../config/serviceConfig");

const isTokenExpired = function (user, serviceName) {
    const serviceData = user.connectServices.get(serviceName);
    if (!serviceData) {
        return { found: false, expired: true, timeRemaining: 0, serviceName };
    }

    const { tokenIssuedAt, expires_in } = serviceData;
    const currentAdjustedTime = Date.now();
    const expirationTime = tokenIssuedAt + expires_in * 1000;
    const timeRemaining = expirationTime - currentAdjustedTime;

    return {
        found: true,
        expired: timeRemaining <= 0,
        timeRemaining: Math.max(timeRemaining / 1000, 0),
        serviceName,
    };
};

exports.refreshTokensForAllUsers = async function () {
    try {
        console.log("Starting to refresh tokens for all users");
        const users = await User.find();
        for (const user of users) {
            console.log(`Refreshing tokens for user: ${user._id}`);
            await refreshAllServiceTokens(user._id);
        }
        console.log("Finished refreshing tokens for all users");
    } catch (error) {
        console.error("Error while refreshing tokens for all users:", error);
    }
};

const refreshAllServiceTokens = async function (userId) {
    try {
        console.log(`Looking up user by ID: ${userId}`);
        const user = await User.findById(userId);
        if (!user) {
            console.log(`User not found with ID: ${userId}`);
            return;
        }

        for (let serviceName of Object.keys(SERVICES)) {
            if (serviceName === "github") continue;
            console.log(`Checking token expiration for service: ${serviceName}`);
            if (isTokenExpired(user, serviceName)) {
                console.log(`Token expired for service: ${serviceName}, refreshing now`);
                await refreshServiceTokenForUser(user, serviceName);
            }
            console.log(`Token not expired for service: ${serviceName}`);
        }
    } catch (error) {
        console.error(`Error while refreshing tokens for user ID ${userId}:`, error);
    }
};

const refreshServiceTokenForUser = async function (user, serviceName) {
    try {
        console.log(`Refreshing token for user: ${user._id} and service: ${serviceName}`);
        const serviceData = user.connectServices.get(serviceName);
        if (!serviceData) {
            console.log(`No service data found for service: ${serviceName}`);
            return;
        }
        const refreshToken = serviceData.refresh_token;
        if (!refreshToken) {
            console.log(`No refresh token found for service: ${serviceName}`);
            return;
        }
        const newAccessToken = await genericRefreshToken(refreshToken, serviceName);
        user.connectServices.get(serviceName).access_token = newAccessToken;
        user.connectServices.get(serviceName).tokenIssuedAt = Date.now();
        await user.save();
        console.log(`Token refreshed for user: ${user._id} and service: ${serviceName}`);
    } catch (error) {
        console.error(`Error while refreshing token for user: ${user._id} and service: ${serviceName}:`, error);
    }
};

exports.generateUserToken = async function (userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
};

exports.generateConfirmationToken = function () {
    return crypto.randomBytes(20).toString("hex");
};

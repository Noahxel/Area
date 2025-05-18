const User = require("../../models/userModels");

async function getServiceToken(userId, serviceName) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error(`User not found for ID ${userId}.`);
    }
    if (!user.connectServices || !user.connectServices.get(serviceName)) {
        throw new Error(`${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} service not connected for user.`);
    }
    return user.connectServices.get(serviceName).access_token;
}

exports.getDropboxToken = (userId) => getServiceToken(userId, "dropbox");
exports.getGithubToken = (userId) => getServiceToken(userId, "github");
exports.getSpotifyToken = (userId) => getServiceToken(userId, "spotify");
exports.getTwitchToken = (userId) => getServiceToken(userId, "twitch");
exports.getYouTubeToken = (userId) => getServiceToken(userId, "youtube");
exports.getGmailToken = (userId) => getServiceToken(userId, "gmail");

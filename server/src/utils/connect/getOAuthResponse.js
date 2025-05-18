const { getServiceConstants } = require("../../config/serviceConfig");
const OAuthSession = require("../../models/OAuthSessionModels");

exports.getOAuthResponse = async function (userId, serviceName) {
    const oAuthSessionId = await registerOAuthSession(userId, serviceName);
    if (!oAuthSessionId) {
        throw new Error("Failed to initiate OAuth session.");
    }
    const constants = getServiceConstants(serviceName);
    return {
        ...constants,
        oAuthSessionId: oAuthSessionId,
    };
};

async function registerOAuthSession(userId, service) {
    try {
        const oAuthSession = await OAuthSession.create({
            userId,
            service,
        });
        return oAuthSession._id.toString();
    } catch (err) {
        console.error("Failed to create OAuthSession:", err);
        return null;
    }
}

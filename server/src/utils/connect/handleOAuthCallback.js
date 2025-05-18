const OAuthSession = require("../../models/OAuthSessionModels");
const User = require("../../models/userModels");

exports.verifyOAuthSession = async function (sessionId, service) {
    try {
        const oAuthSession = await OAuthSession.findByIdAndDelete(sessionId);
        if (oAuthSession?.service === service) {
            const user = await User.findById(oAuthSession.userId);
            return {
                user,
            };
        }
        console.error("Invalid OAuthSession.");
    } catch (err) {
        console.error("Failed to verify OAuthSession:", err);
    }
    return { user: null };
};

exports.handleOAuthCallback = async function (serviceName, oAuthSessionIdFromState, serviceData) {
    const { user } = await exports.verifyOAuthSession(oAuthSessionIdFromState, serviceName);

    if (!user) {
        throw new Error("Invalid state or session expired");
    }
    const serviceObj = {
        access_token: serviceData.accessToken,
        refresh_token: serviceData.refreshToken || serviceData.accessToken,
        expires_in: (serviceData.expiresIn ? serviceData.expiresIn * 1000 : null),
        tokenIssuedAt: Date.now(),
        data: serviceData.profile,
    };
    user.connectServices.set(serviceName, serviceObj);
    await user.save();
    return {
        status: "success",
        message: `Successfully connected with ${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}.`,
    };
};

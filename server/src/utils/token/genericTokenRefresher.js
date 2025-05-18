const axios = require("axios");
const { SERVICES } = require("../../config/serviceConfig");

function getServiceCredentials(serviceName) {
    const service = SERVICES[serviceName];
    if (!service) {
        throw new Error(`Service ${serviceName} not found.`);
    }
    return {
        clientId: process.env[service.clientId],
        clientSecret: process.env[service.clientSecret],
        redirectUri: service.redirectUri,
        scopes: service.scopes,
    };
}

exports.genericRefreshToken = async function (refreshToken, serviceName) {
    try {
        const { clientId, clientSecret } = getServiceCredentials(serviceName);
        const { url, formatter } = SERVICES[serviceName];

        const data = {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
        };

        const response = await axios.post(url, formatter(data), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        return response.data.access_token;
    } catch (error) {
        console.error(`Error refreshing token for service ${serviceName}:`, error);
        throw error;
    }
};

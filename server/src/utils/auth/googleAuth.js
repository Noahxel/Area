const axios = require("axios");

exports.getGoogleUserProfile = async function (accessToken) {
    return axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: "Bearer " + accessToken },
    });
};

exports.getGoogleAccessToken = async function (code, redirectUri) {
    return axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
    });
};

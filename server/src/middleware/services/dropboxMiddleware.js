const axios = require("axios");

async function dropboxOAuthMiddleware(req, res, next) {
    const code = req.query.code;
    const redirectUri = "https://api.techparisarea.com/connect/dropbox/callback";
    const clientId = process.env.DROPBOX_CLIENT_ID;
    const clientSecret = process.env.DROPBOX_CLIENT_SECRET;

    try {
        const response = await axios.post(
            "https://api.dropboxapi.com/oauth2/token",
            `client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(
                redirectUri
            )}&grant_type=authorization_code`,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        const { access_token, refresh_token, expires_in } = response.data;
        const profileResponse = await axios.post("https://api.dropboxapi.com/2/users/get_current_account", null, {
            headers: {
                Authorization: "Bearer " + access_token,
                "Content-Type": "application/json"
            },
        });
        const profile = profileResponse.data;
        req.dropboxData = {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
            profile: profile,
        };
        next();
    } catch (error) {
        console.error("Error during token exchange or profile fetching:", error.response.data);
        return res.status(500).redirect("https://techparisarea.com/create?connect=error");
    }
}

module.exports = dropboxOAuthMiddleware;

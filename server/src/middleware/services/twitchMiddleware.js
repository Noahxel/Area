const axios = require('axios');

async function twitchOAuthMiddleware(req, res, next) {
    const code = req.query.code;
    const redirectUri = "https://api.techparisarea.com/connect/twitch/callback";
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            }
        });
        const { access_token, refresh_token, expires_in } = response.data;
        const profileResponse = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Client-ID': clientId
            }
        });
        const profile = profileResponse.data.data[0];
        req.twitchData = {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
            profile: profile,
        };
        next();
    } catch (error) {
        console.error("Error during token exchange:", error);
        return res.status(500).redirect("https://techparisarea.com/create?connect=error");
    }
}

module.exports = twitchOAuthMiddleware;

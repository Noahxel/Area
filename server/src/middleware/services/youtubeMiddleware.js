const axios = require('axios');

async function youtubeOAuthMiddleware(req, res, next) {
    const code = req.query.code;
    const redirectUri = "https://api.techparisarea.com/connect/youtube/callback";
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        });
        const { access_token, refresh_token, expires_in } = response.data;
        const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': 'Bearer ' + access_token,
            }
        });
        const profile = profileResponse.data;
        req.youtubeData = {
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

module.exports = youtubeOAuthMiddleware;

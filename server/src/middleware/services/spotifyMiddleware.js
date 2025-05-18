const axios = require('axios');

async function spotifyOAuthMiddleware(req, res, next) {
    const code = req.query.code;
    const redirectUri = "https://api.techparisarea.com/connect/spotify/callback";
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri,
            },
            headers: {
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        const { access_token, refresh_token, expires_in } = response.data;
        const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + access_token,
            }
        });
        const profile = profileResponse.data;
        req.spotifyData = {
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

module.exports = spotifyOAuthMiddleware;

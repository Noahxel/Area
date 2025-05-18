const axios = require('axios');

async function githubOAuthMiddleware(req, res, next) {
    const code = req.query.code;
    const redirectUri = "https://api.techparisarea.com/connect/github/callback";
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri
        }, {
            headers: {
                'Accept': 'application/json',
            }
        });
        const { access_token } = response.data;
        const profileResponse = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': 'Bearer ' + access_token,
            }
        });
        const profile = profileResponse.data;
        req.githubData = {
            accessToken: access_token,
            profile: profile,
        };
        next();
    } catch (error) {
        console.error("Error during token exchange:", error);
        return res.status(500).redirect("https://techparisarea.com/create?connect=error");
    }
}

module.exports = githubOAuthMiddleware;

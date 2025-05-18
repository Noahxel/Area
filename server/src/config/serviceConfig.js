const qs = require("qs");

const SERVICES = {
    spotify: {
        url: "https://accounts.spotify.com/api/token",
        clientId: "SPOTIFY_CLIENT_ID",
        clientSecret: "SPOTIFY_CLIENT_SECRET",
        formatter: (data) => qs.stringify(data),
        redirectUri: "https://api.techparisarea.com/connect/spotify/callback",
        scopes: [
            "user-library-read",
            "user-read-recently-played",
            "playlist-read-private",
            "playlist-modify-private",
            "playlist-modify-public",
            "user-library-modify",
            "user-follow-modify",
        ],
        middleware: require("../middleware/services/spotifyMiddleware"),
        dataKey: "spotifyData",
    },
    youtube: {
        url: "https://oauth2.googleapis.com/token",
        clientId: "GOOGLE_CLIENT_ID",
        clientSecret: "GOOGLE_CLIENT_SECRET",
        formatter: (data) => data,
        redirectUri: "https://api.techparisarea.com/connect/youtube/callback",
        scopes: ["profile", "https://www.googleapis.com/auth/youtube.readonly", "https://www.googleapis.com/auth/youtube.force-ssl"],
        middleware: require("../middleware/services/youtubeMiddleware"),
        dataKey: "youtubeData",
    },
    gmail: {
        url: "https://oauth2.googleapis.com/token",
        clientId: "GOOGLE_CLIENT_ID",
        clientSecret: "GOOGLE_CLIENT_SECRET",
        formatter: (data) => data,
        redirectUri: "https://api.techparisarea.com/connect/gmail/callback",
        scopes: ["profile", "email", "https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send"],
        middleware: require("../middleware/services/gmailMiddleware"),
        dataKey: "gmailData",
    },
    twitch: {
        url: "https://id.twitch.tv/oauth2/token",
        clientId: "TWITCH_CLIENT_ID",
        clientSecret: "TWITCH_CLIENT_SECRET",
        formatter: (data) => data,
        redirectUri: "https://api.techparisarea.com/connect/twitch/callback",
        scopes: ["user:read:follows", "moderator:read:followers", "channel:read:subscriptions"],
        middleware: require("../middleware/services/twitchMiddleware"),
        dataKey: "twitchData",
    },
    dropbox: {
        url: "https://api.dropboxapi.com/oauth2/token",
        clientId: "DROPBOX_CLIENT_ID",
        clientSecret: "DROPBOX_CLIENT_SECRET",
        formatter: (data) => qs.stringify(data),
        redirectUri: "https://api.techparisarea.com/connect/dropbox/callback",
        scopes: [],
        middleware: require("../middleware/services/dropboxMiddleware"),
        dataKey: "dropboxData",
    },
    github: {
        url: "https://github.com/login/oauth/access_token",
        clientId: "GITHUB_CLIENT_ID",
        clientSecret: "GITHUB_CLIENT_SECRET",
        formatter: (data) => qs.stringify(data),
        redirectUri: "https://api.techparisarea.com/connect/github/callback",
        scopes: ["repo", "read:org", "admin:org", "user", "read:user", "user:email"],
        middleware: require("../middleware/services/githubMiddleware"),
        dataKey: "githubData",
    },
};

function getServiceConstants(serviceName) {
    const service = SERVICES[serviceName];
    if (!service) {
        throw new Error(`Service ${serviceName} not found.`);
    }
    return {
        clientId: process.env[service.clientId],
        redirectUri: service.redirectUri,
        scopes: service.scopes,
    };
}

module.exports = {
    SERVICES,
    getServiceConstants,
};

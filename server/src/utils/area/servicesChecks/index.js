const { checkSpotifyParameters } = require("./spotify");
const { checkDatetimeParameters } = require("./dateTime");
const { checkOpenWeatherParameters } = require("./openWeather");
const { checkTwitchParameters } = require("./twitch");
const { checkYoutubeParameters } = require("./youtube");
const { checkGmailParameters } = require("./gmail");
const { checkGithubParameters } = require("./github");
const { checkDropboxParameters } = require("./dropbox");

module.exports = {
    spotify: checkSpotifyParameters,
    dateTime: checkDatetimeParameters,
    openWeather: checkOpenWeatherParameters,
    twitch: checkTwitchParameters,
    youtube: checkYoutubeParameters,
    gmail: checkGmailParameters,
    github: checkGithubParameters,
    dropbox: checkDropboxParameters,
};

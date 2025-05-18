const axios = require("axios");
const { getYouTubeToken } = require("../../token/servicesTokenUtils");

async function checkYoutubeEntityExists(accessToken, entityType, entityId) {
    const baseUrl = "https://www.googleapis.com/youtube/v3";
    let url = "";
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    if (entityType === "video") {
        url = `${baseUrl}/videos?part=id&id=${entityId}`;
    } else if (entityType === "channel") {
        url = `${baseUrl}/channels?part=id&id=${entityId}`;
    } else {
        throw new Error("Invalid entity type provided");
    }

    try {
        const response = await axios.get(url, { headers });
        const items = response.data.items;
        return items && items.length > 0;
    } catch (error) {
        console.error("Error fetching YouTube entity:", error);
        return false;
    }
}

exports.checkYoutubeParameters = async function (userId, parameters, actionName) {
    const youtube = await getYouTubeToken(userId);

    if (actionName === "like_video" && parameters.some((param) => param.input.startsWith("<") && param.input.endsWith(">"))) {
        throw new Error(`Ingredients wrapped in <> are not allowed for the ${actionName} action.`);
    }
    for (let param of parameters) {
        if (param.name === "channel_id" && !(await checkYoutubeEntityExists(youtube, "channel", param.input))) {
            throw new Error(`Invalid channel ID provided`);
        }
        if (param.name === "video_id" && !(await checkYoutubeEntityExists(youtube, "video", param.input))) {
            throw new Error(`Invalid video ID provided`);
        }
    }
    return true;
};

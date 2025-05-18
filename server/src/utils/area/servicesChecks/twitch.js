const axios = require("axios");
const { getTwitchToken } = require("../../token/servicesTokenUtils");
const User = require("../../../models/userModels");

async function getAllFollowedChannels(userId, accessToken) {
    try {
        const user = await User.findById(userId);
        const headers = {
            "Client-ID": process.env.TWITCH_CLIENT_ID,
            Authorization: `Bearer ${accessToken}`,
        };
        let allFollowedChannels = [];
        let cursor = null;

        do {
            const params = cursor ? { after: cursor } : {};
            const response = await axios.get(`https://api.twitch.tv/helix/channels/followed?user_id=${user.connectServices.get("twitch").data.id}`, {
                headers: headers,
                params: params,
            });
            allFollowedChannels = allFollowedChannels.concat(response.data.data);
            cursor = response.data.pagination.cursor;
        } while (cursor);
        return allFollowedChannels;
    } catch (error) {
        console.error("Failed to get all followed channels:", error);
        return [];
    }
}

exports.checkTwitchParameters = async function (userId, parameters) {
    const accessToken = await getTwitchToken(userId);

    for (let param of parameters) {
        if (param.name === "channel_name") {
            const followedChannels = await getAllFollowedChannels(userId, accessToken);
            const isFollowedChannel = followedChannels.some((channel) => channel.broadcaster_login === param.input.toLowerCase());
            if (!isFollowedChannel) {
                throw new Error("Invalid or unfollowed channel name provided");
            }
        }
    }
    return true;
};

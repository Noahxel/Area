const axios = require("axios");

exports.fetchLiveStreams = async function (userAccessToken, twitchUserId) {
    const url = "https://api.twitch.tv/helix/streams/followed";
    const headers = {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${userAccessToken}`,
    };
    const params = {
        user_id: twitchUserId,
    };

    try {
        const response = await axios.get(url, { headers: headers, params: params });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch live streams:", error.response ? error.response.data : error.message);
        throw error;
    }
};

exports.fetchAllFollowedChannels = async function (userAccessToken, twitchUserId) {
    const url = `https://api.twitch.tv/helix/channels/followed`;
    let allFollowedChannels = [];
    let cursor = null;

    try {
        while (true) {
            const headers = {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${userAccessToken}`,
            };
            const params = { user_id: twitchUserId, ...(cursor && { after: cursor }) };
            const response = await axios.get(url, { headers, params });
            allFollowedChannels = allFollowedChannels.concat(response.data.data);
            cursor = response.data.pagination && response.data.pagination.cursor;
            if (!cursor) {
                break;
            }
        }
        return allFollowedChannels;
    } catch (error) {
        console.error("Failed to get all followed channels:", error.response ? error.response.data : error.message);
        throw error;
    }
};

exports.fetchAllChannelFollowers = async function (accessToken, broadcasterId) {
    const url = "https://api.twitch.tv/helix/channels/followers";
    let allFollowers = [];
    let cursor = null;

    try {
        do {
            const response = await axios.get(url, {
                headers: {
                    "Client-Id": process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    broadcaster_id: broadcasterId,
                    ...(cursor ? { after: cursor } : {}),
                },
            });
            allFollowers = allFollowers.concat(response.data.data);
            cursor = response.data.pagination.cursor;
        } while (cursor);

        return allFollowers;
    } catch (error) {
        console.error("Failed to get all channel followers:", error.response ? error.response.data : error.message);
        throw error;
    }
};

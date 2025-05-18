const axios = require("axios");
const { makeApiCall } = require("./apiUtils");

exports.fetchLikedVideosPlaylistId = async function (accessToken) {
    try {
        const url = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true";
        const headers = { Authorization: `Bearer ${accessToken}` };
        const channelResponse = await makeApiCall(url, "GET", headers);
        return channelResponse.items[0].contentDetails.relatedPlaylists.likes;
    } catch (error) {
        console.error("Error fetching liked videos playlist ID:", error);
        throw error;
    }
};

exports.fetchPlaylistItems = async function (accessToken, playlistId, maxResults = 1) {
    try {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}`;
        const headers = { Authorization: `Bearer ${accessToken}` };
        return await makeApiCall(url, "GET", headers);
    } catch (error) {
        console.error("Error fetching playlist items:", error);
        throw error;
    }
};

exports.fetchTotalPlaylistItems = async function (accessToken, playlistId) {
    try {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=id&playlistId=${playlistId}&maxResults=0`;
        const headers = { Authorization: `Bearer ${accessToken}` };
        const totalResponse = await makeApiCall(url, "GET", headers);
        return totalResponse.pageInfo.totalResults;
    } catch (error) {
        console.error("Error fetching total playlist items:", error);
        throw error;
    }
};

exports.fetchChannelDetails = async function (accessToken, channelId) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&maxResults=1`;
    const headers = { Authorization: `Bearer ${accessToken}` };
    try {
        const response = await makeApiCall(url, "GET", headers);
        if (response.items && response.items.length > 0) {
            return response.items[0].contentDetails.relatedPlaylists.uploads;
        } else {
            throw new Error("No channel details found.");
        }
    } catch (error) {
        console.error("Error fetching channel details:", error);
        throw error;
    }
};

exports.fetchTotalVideosForPlaylist = async function (accessToken, playlistId) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=id&playlistId=${playlistId}&maxResults=0`;
    const headers = { Authorization: `Bearer ${accessToken}` };
    try {
        const response = await makeApiCall(url, "GET", headers);
        if (response.pageInfo && response.pageInfo.totalResults !== undefined) {
            return response.pageInfo.totalResults;
        } else {
            throw new Error("No playlist details found.");
        }
    } catch (error) {
        console.error("Error fetching total videos for playlist:", error);
        throw error;
    }
};

exports.fetchRecentVideoByChannel = async function (accessToken, channelId) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=1&order=date&type=video`;
    const headers = { Authorization: `Bearer ${accessToken}` };
    try {
        const response = await makeApiCall(url, "GET", headers);
        return response;
    } catch (error) {
        console.error("Error fetching recent video by channel:", error);
        throw error;
    }
};

exports.fetchSubscription = async function (accessToken) {
    const url = `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet,contentDetails&mine=true&maxResults=1&order=date`;
    const headers = { Authorization: `Bearer ${accessToken}` };
    try {
        const response = await makeApiCall(url, "GET", headers);
        if (response.items && response.items.length > 0) {
            return response.items[0].snippet;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching recent subscription:", error);
        throw error;
    }
};

exports.fetchLikeVideo = async function (accessToken, videoId) {
    const url = `https://www.googleapis.com/youtube/v3/videos/rate`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
    };
    const params = {
        id: videoId,
        rating: "like",
    };

    try {
        await axios.post(url, null, { headers: headers, params: params });
        return true;
    } catch (error) {
        console.error("Failed to like video:", error);
        throw error;
    }
};

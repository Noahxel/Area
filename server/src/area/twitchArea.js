const User = require("../models/userModels");
const { getTwitchToken } = require("../utils/token/servicesTokenUtils");
const { processTriggerDataLiveTwitch, processTriggerDataTotal } = require("../utils/area/areaValidation");
const { updateIngredients } = require("../utils/ingredients/ingredientsHelper");
const { fetchAllFollowedChannels, fetchLiveStreams, fetchAllChannelFollowers } = require("../utils/API/twitchAPI");

exports.streamGoingLiveForChannel = async function (areaEntry) {
    try {
        const userAccessToken = await getTwitchToken(areaEntry.userId);
        const user = await User.findById(areaEntry.userId);
        const twitchUserId = user.connectServices.get("twitch").data.id;
        const response = await fetchLiveStreams(userAccessToken, twitchUserId);
        const liveStreams = response.data;
        let isChannelLive = false;
        const targetedChannelName = areaEntry.trigger.parameters[0].input.toLowerCase();
        const liveStream = liveStreams.find((stream) => stream.user_name.toLowerCase() === targetedChannelName);

        if (liveStream) {
            isChannelLive = true;
            if (await processTriggerDataLiveTwitch(areaEntry, "streamStatus", isChannelLive)) {
                updateIngredients(areaEntry, [
                    { name: "twitch_stream_title", value: liveStream.title },
                    { name: "twitch_streamer_name", value: liveStream.user_name },
                    { name: "twitch_stream_url", value: `https://www.twitch.tv/${liveStream.user_name}` },
                    { name: "twitch_viewers_count", value: liveStream.viewer_count.toString() },
                    { name: "twitch_stream_started_at", value: liveStream.started_at.split("T")[0] },
                    { name: "twitch_game_name", value: liveStream.game_name },
                ]);
                return true;
            }
        }
        await processTriggerDataLiveTwitch(areaEntry, "streamStatus", isChannelLive);
        return false;
    } catch (error) {
        console.error("Error in streamGoingLiveForChannel function:", error);
        return false;
    }
};

exports.youFollowNewChannel = async function (areaEntry) {
    try {
        const userAccessToken = await getTwitchToken(areaEntry.userId);
        const user = await User.findById(areaEntry.userId);
        const twitchUserId = user.connectServices.get("twitch").data.id;
        const allFollowedChannels = await fetchAllFollowedChannels(userAccessToken, twitchUserId);
        if (!allFollowedChannels) return await processTriggerDataTotal(areaEntry, "followedChannelId", "", 0);
        const sortedChannels = allFollowedChannels.sort((a, b) => new Date(b.followed_at) - new Date(a.followed_at));
        const newFollow = sortedChannels[0];

        if (await processTriggerDataTotal(areaEntry, "followedChannelId", newFollow.broadcaster_id, allFollowedChannels.length)) {
            updateIngredients(areaEntry, [
                { name: "twitch_channel_name", value: newFollow.broadcaster_name },
                { name: "twitch_channel_url", value: `https://www.twitch.tv/${newFollow.broadcaster_name}` },
                { name: "twitch_followed_date", value: newFollow.followed_at.split("T")[0] },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in youFollowNewChannel function:", error);
        return false;
    }
};

exports.newFollowerOnYourChannel = async function (areaEntry) {
    try {
        const userAccessToken = await getTwitchToken(areaEntry.userId);
        const user = await User.findById(areaEntry.userId);
        const twitchUserId = user.connectServices.get("twitch").data.id;
        const allFollowers = await fetchAllChannelFollowers(userAccessToken, twitchUserId);
        if (!allFollowers) return await processTriggerDataTotal(areaEntry, "followerId", "", 0);
        const sortedFollowers = allFollowers.sort((a, b) => new Date(b.followed_at) - new Date(a.followed_at));
        const newFollower = sortedFollowers[0];
        const totalFollowers = allFollowers.length;

        if (await processTriggerDataTotal(areaEntry, "followerId", newFollower.user_id, totalFollowers)) {
            updateIngredients(areaEntry, [
                { name: "twitch_follower_username", value: newFollower.user_name },
                { name: "twitch_follower_profile_url", value: `https://www.twitch.tv/${newFollower.from_name}` },
                { name: "twitch_followed_date", value: newFollower.followed_at.split("T")[0] },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in newFollowerOnYourChannel function:", error);
        return false;
    }
};

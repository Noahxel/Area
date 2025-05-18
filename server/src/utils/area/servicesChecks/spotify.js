const axios = require("axios");
const User = require("../../../models/userModels");
const { getSpotifyToken } = require("../../token/servicesTokenUtils");
const { isIngredient } = require("../../ingredients/ingredientsHelper");

const ALLOWED_INGREDIENTS_FOR_ACTIONS = {
    add_track_to_playlist_by_id: ["song_id"],
    save_track: ["song_id"],
    follow_playlist: [],
};

async function checkEntityExists(entityType, entityId, accessToken) {
    try {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(`https://api.spotify.com/v1/${entityType}/${entityId}`, { headers });
        return response.status === 200;
    } catch {
        return false;
    }
}

async function checkPlaylistPermissions(userId, playlistId, accessToken) {
    try {
        const user = await User.findById(userId);
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, { headers });
        if (response.status === 200) {
            const isCollaborative = response.data.collaborative;
            const isOwner = response.data.owner.id === user.connectServices.get("spotify").get("data").id;
            return isCollaborative || isOwner;
        }
    } catch {
        return false;
    }
    return false;
}

exports.checkSpotifyParameters = async function (userId, parameters, actionOrTriggerName) {
    const accessToken = await getSpotifyToken(userId);
    const allowedIngredients = ALLOWED_INGREDIENTS_FOR_ACTIONS[actionOrTriggerName];

    for (let param of parameters) {
        if (isIngredient(param.input)) {
            const ingredientName = param.input.slice(1, -1);

            if (allowedIngredients && !allowedIngredients.includes(ingredientName)) {
                throw new Error(`Invalid ingredient provided`);
            }
        } else {
            if (param.name === "playlist_id" || param.name === "target_playlist_id") {
                if (actionOrTriggerName == "follow_playlist" || actionOrTriggerName == "new_track_added_to_playlist") continue;
                await checkPlaylistPermissions(userId, param.input, accessToken, userId);
                throw new Error("Invalid playlist ID provided or insufficient permissions");
            }
            if (param.name === "track_id" && !(await checkEntityExists("tracks", param.input, accessToken))) {
                throw new Error("Invalid track ID provided");
            }
        }
    }
    return true;
};

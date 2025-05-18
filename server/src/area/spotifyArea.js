const { updateIngredients } = require("../utils/ingredients/ingredientsHelper");
const { processTriggerData, processTriggerDataTotal } = require("../utils/area/areaValidation");
const { getSpotifyToken } = require("../utils/token/servicesTokenUtils");
const {
    fetchTotalSavedTracks,
    fetchSavedTracks,
    fetchTotalSavedAlbums,
    fetchSavedAlbums,
    fetchRecentlyPlayedTracks,
    fetchLatestTrackFromPlaylist,
    fetchPlaylistDetails,
    fetchFollowPlaylist,
    fetchAddToPlaylistById,
    fetchSaveTrack,
} = require("../utils/API/spotifyAPI");

exports.newSavedTrack = async function (areaEntry) {
    try {
        const accessToken = await getSpotifyToken(areaEntry.userId);
        const totalTracks = await fetchTotalSavedTracks(accessToken);
        const savedTracks = await fetchSavedTracks(accessToken);
        if (!savedTracks) return await processTriggerDataTotal(areaEntry, "trackId", "", 0);
        const recentTrack = savedTracks[0].track;

        if (await processTriggerDataTotal(areaEntry, "trackId", recentTrack.id, totalTracks)) {
            updateIngredients(areaEntry, [
                { name: "song_name", value: recentTrack.name },
                { name: "song_id", value: recentTrack.id },
                { name: "artist", value: recentTrack.artists.map((artist) => artist.name).join(", ") },
                { name: "trackURL", value: recentTrack.external_urls.spotify },
                { name: "coverURL", value: recentTrack.album.images[0].url },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in newSavedTrack function:", error);
        return false;
    }
};

exports.newSavedAlbum = async function (areaEntry) {
    try {
        const accessToken = await getSpotifyToken(areaEntry.userId);
        const totalAlbums = await fetchTotalSavedAlbums(accessToken);
        const savedAlbums = await fetchSavedAlbums(accessToken);
        if (!savedAlbums) return await processTriggerDataTotal(areaEntry, "albumId", "", 0);
        const recentAlbum = savedAlbums[0].album;

        if (await processTriggerDataTotal(areaEntry, "albumId", recentAlbum.id, totalAlbums)) {
            updateIngredients(areaEntry, [
                { name: "album_name", value: recentAlbum.name },
                { name: "album_id", value: recentAlbum.id },
                { name: "artist", value: recentAlbum.artists.map((artist) => artist.name).join(", ") },
                { name: "albumURL", value: recentAlbum.external_urls.spotify },
                { name: "coverURL", value: recentAlbum.images[0].url },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in newSavedAlbum function:", error);
        return false;
    }
};

exports.newRecentlyPlayedTrack = async function (areaEntry) {
    try {
        const accessToken = await getSpotifyToken(areaEntry.userId);
        const recentlyPlayedTracks = await fetchRecentlyPlayedTracks(accessToken);
        if (!recentlyPlayedTracks) return await processTriggerDataTotal(areaEntry, "recentTrackId", "", 0);
        const recentTrack = recentlyPlayedTracks[0].track;

        if (await processTriggerData(areaEntry, "recentTrackId", recentTrack.id)) {
            updateIngredients(areaEntry, [
                { name: "song_name", value: recentTrack.name },
                { name: "song_id", value: recentTrack.id },
                { name: "artist", value: recentTrack.artists.map((artist) => artist.name).join(", ") },
                { name: "trackURL", value: recentTrack.external_urls.spotify },
                { name: "coverURL", value: recentTrack.album.images[0].url },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in newRecentlyPlayedTrack function:", error);
        return false;
    }
};

exports.newTrackAddedToPlaylist = async function (areaEntry) {
    try {
        const playlistId = areaEntry.trigger.parameters[0].input;
        const accessToken = await getSpotifyToken(areaEntry.userId);
        const playlistDetails = await fetchPlaylistDetails(accessToken, playlistId);
        const totalTracks = playlistDetails.totalTracks;
        const playlistName = playlistDetails.playlistName;
        const recentAddedTrack = await fetchLatestTrackFromPlaylist(accessToken, playlistId, totalTracks);
        if (!recentAddedTrack) return await processTriggerDataTotal(areaEntry, "newPlaylistTrackId", "", 0);;

        if (await processTriggerDataTotal(areaEntry, "newPlaylistTrackId", recentAddedTrack.id, totalTracks)) {
            updateIngredients(areaEntry, [
                { name: "song_name", value: recentAddedTrack.name },
                { name: "song_id", value: recentAddedTrack.id },
                { name: "artist", value: recentAddedTrack.artists.map((artist) => artist.name).join(", ") },
                { name: "trackURL", value: recentAddedTrack.external_urls.spotify },
                { name: "coverURL", value: recentAddedTrack.album.images[0].url },
                { name: "playlist_name", value: playlistName },
                { name: "playlist_id", value: playlistId },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in newTrackAddedToPlaylist function:", error);
        return false;
    }
};

exports.followPlaylist = async function (userId, playlistId) {
    try {
        const accessToken = await getSpotifyToken(userId);
        await fetchFollowPlaylist(accessToken, playlistId);
        return { success: true };
    } catch (error) {
        console.error("Error in followPlaylist function:", error);
        throw error;
    }
};

exports.addToPlaylistById = async function (userId, playlistId, trackId) {
    try {
        const accessToken = await getSpotifyToken(userId);
        await fetchAddToPlaylistById(accessToken, playlistId, trackId);
        return { success: true };
    } catch (error) {
        console.error("Error in addToPlaylistById function:", error);
        throw error;
    }
};

exports.saveTrack = async function (userId, trackId) {
    try {
        const accessToken = await getSpotifyToken(userId);
        await fetchSaveTrack(accessToken, trackId);
        return { success: true };
    } catch (error) {
        console.error("Error in saveTrack function:", error);
        throw error;
    }
};

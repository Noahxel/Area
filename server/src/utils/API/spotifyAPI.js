const { makeApiCall } = require("./apiUtils");

exports.fetchTotalSavedTracks = async function (accessToken) {
    try {
        const totalTracksUrl = "https://api.spotify.com/v1/me/tracks";
        const headers = { Authorization: `Bearer ${accessToken}` };
        const totalTracksResponse = await makeApiCall(totalTracksUrl, "GET", headers);
        return totalTracksResponse.total;
    } catch (error) {
        console.error("Error fetching total saved tracks:", error);
        throw error;
    }
};

exports.fetchSavedTracks = async function (accessToken) {
    try {
        const trackUrl = "https://api.spotify.com/v1/me/tracks?limit=1";
        const headers = { Authorization: `Bearer ${accessToken}` };
        const savedTracksResponse = await makeApiCall(trackUrl, "GET", headers);
        return savedTracksResponse.items;
    } catch (error) {
        console.error("Error fetching saved tracks:", error);
        throw error;
    }
};

exports.fetchTotalSavedAlbums = async function (accessToken) {
    try {
        const totalAlbumsUrl = "https://api.spotify.com/v1/me/albums";
        const headers = { Authorization: `Bearer ${accessToken}` };
        const totalAlbumsResponse = await makeApiCall(totalAlbumsUrl, "GET", headers);
        return totalAlbumsResponse.total;
    } catch (error) {
        console.error("Error fetching total saved albums:", error);
        throw error;
    }
};

exports.fetchSavedAlbums = async function (accessToken) {
    try {
        const albumUrl = "https://api.spotify.com/v1/me/albums?limit=1";
        const headers = { Authorization: `Bearer ${accessToken}` };
        const savedAlbumsResponse = await makeApiCall(albumUrl, "GET", headers);
        return savedAlbumsResponse.items;
    } catch (error) {
        console.error("Error fetching saved albums:", error);
        throw error;
    }
};

exports.fetchRecentlyPlayedTracks = async function (accessToken) {
    try {
        const url = "https://api.spotify.com/v1/me/player/recently-played?limit=1";
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const recentlyPlayedResponse = await makeApiCall(url, "GET", headers);
        return recentlyPlayedResponse.items;
    } catch (error) {
        console.error("Error fetching recently played tracks:", error);
        throw error;
    }
};

exports.fetchPlaylistDetails = async function (accessToken, playlistId) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}`;
    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
        const response = await makeApiCall(url, "GET", headers);
        return {
            totalTracks: response.tracks.total,
            playlistName: response.name,
        };
    } catch (error) {
        console.error(`Error fetching playlist details: ${error}`);
        throw error;
    }
};

exports.fetchLatestTrackFromPlaylist = async function (accessToken, playlistId, totalTracks) {
    const offset = totalTracks > 0 ? totalTracks - 1 : 0;
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=1&offset=${offset}`;
    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
        const response = await makeApiCall(url, "GET", headers);
        if (response.items && response.items.length > 0) {
            return response.items[0].track;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching latest track from playlist: ${error}`);
        throw error;
    }
};

exports.fetchFollowPlaylist = async function (accessToken, playlistId) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
    const body = {};

    try {
        return await makeApiCall(url, "PUT", headers, body);
    } catch (error) {
        console.error("Failed to follow playlist:", error);
        throw error;
    }
};

exports.fetchAddToPlaylistById = async function (accessToken, playlistId, trackId) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=spotify:track:${trackId}`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };

    try {
        return await makeApiCall(url, "POST", headers);
    } catch (error) {
        console.error("Failed to add to playlist by ID:", error);
        throw error;
    }
};

exports.fetchSaveTrack = async function (accessToken, trackId) {
    const url = `https://api.spotify.com/v1/me/tracks?ids=${trackId}`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };

    try {
        return await makeApiCall(url, "PUT", headers);
    } catch (error) {
        console.error("Failed to save track:", error);
        throw error;
    }
};

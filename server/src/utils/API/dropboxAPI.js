const { makeApiCall, makeContentApiCall } = require("./apiUtils");
let fetch;

(async () => {
    fetch = (await import("node-fetch")).default;
})();

exports.fetchFilesInFolder = async function (accessToken, folderPath) {
    let files = [];
    let hasMore = true;
    let cursor = null;

    try {
        while (hasMore) {
            const body = cursor ? { cursor } : { path: folderPath };
            const response = await makeApiCall(
                "https://api.dropboxapi.com/2/files/list_folder" + (cursor ? "/continue" : ""),
                "POST",
                {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
                body
            );

            files = files.concat(response.entries);
            hasMore = response.has_more;
            cursor = response.cursor;
        }
    } catch (error) {
        console.error("Failed to fetch files in folder:", error);
        throw error;
    }
    return files;
};

exports.fetchAllSharedLinks = async function (accessToken) {
    let allLinks = [];
    let cursor = null;
    let hasMore = true;

    try {
        while (hasMore) {
            const body = cursor ? { cursor } : {};
            const response = await makeApiCall(
                "https://api.dropboxapi.com/2/sharing/list_shared_links",
                "POST",
                {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body
            );

            allLinks = allLinks.concat(response.links);
            hasMore = response.has_more;
            cursor = response.cursor;
        }
    } catch (error) {
        console.error("Failed to fetch all shared links:", error);
        throw error;
    }
    return allLinks;
};

exports.fetchUploadFile = async function (accessToken, fileData, fileName, filePath) {
    const url = "https://content.dropboxapi.com/2/files/upload";
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/octet-stream",
        "Dropbox-API-Arg": JSON.stringify({
            path: filePath !== "/" ? `${filePath}/${fileName}` : `/${fileName}`,
            mode: "add",
            autorename: true,
            mute: false,
            strict_conflict: false,
        }),
    };

    try {
        return await makeContentApiCall(url, "POST", headers, fileData);
    } catch (error) {
        console.error("Failed to upload file to Dropbox:", error);
        throw error;
    }
};
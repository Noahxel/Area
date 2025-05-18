const { getDropboxToken } = require("../utils/token/servicesTokenUtils");
const { updateIngredients } = require("../utils/ingredients/ingredientsHelper");
const { processTriggerDataTotal } = require("../utils/area/areaValidation");
const { fetchUploadFile, fetchFilesInFolder, fetchAllSharedLinks } = require("../utils/API/dropboxAPI");

exports.newFileInFolder = async function (areaEntry) {
    try {
        const folderPath = areaEntry.trigger.parameters[0].input === "/" ? "" : areaEntry.trigger.parameters[0].input;
        const accessToken = await getDropboxToken(areaEntry.userId);
        const folderList = await fetchFilesInFolder(accessToken, folderPath);
        if (folderList.length === 0) return await processTriggerDataTotal(areaEntry, "newFileInFolder", "", 0);
        const filesInFolderList = folderList.filter((link) => link[".tag"] === "file");
        const recentFile = filesInFolderList[filesInFolderList.length - 1];

        if (await processTriggerDataTotal(areaEntry, "newFileInFolder", recentFile.id, filesInFolderList.length)) {
            updateIngredients(areaEntry, [
                { name: "file_name", value: recentFile.name },
                { name: "folder_path", value: folderPath === "" ? "/" : folderPath },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Failed in newFileInFolder function:", error);
        throw error;
    }
};

exports.newSharedFileLink = async function (areaEntry) {
    try {
        const accessToken = await getDropboxToken(areaEntry.userId);
        const allLinks = await fetchAllSharedLinks(accessToken);
        const fileLinks = allLinks.filter((link) => link[".tag"] === "file");
        if (fileLinks.length === 0) return await processTriggerDataTotal(areaEntry, "newSharedFileLink", "", 0);
        const recentFileLink = fileLinks[0];

        if (await processTriggerDataTotal(areaEntry, "newSharedFileLink", recentFileLink.id, fileLinks.length)) {
            updateIngredients(areaEntry, [
                { name: "file_url", value: recentFileLink.url },
                { name: "file_name", value: recentFileLink.name },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Failed in newSharedFileLink function:", error);
        throw error;
    }
};

exports.uploadFileFromURL = async function (userId, fileUrl, fileName, filePath) {
    try {
        const accessToken = await getDropboxToken(userId);
        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch file from URL: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const fileData = Buffer.from(buffer);
        const uploadResult = await fetchUploadFile(accessToken, fileData, fileName, filePath);
        return uploadResult;
    } catch (error) {
        console.error("Error in uploadFileFromURL function:", error);
        throw error;
    }
};

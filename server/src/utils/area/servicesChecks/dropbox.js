const axios = require("axios");
const https = require("https");
const { isIngredient } = require("../../ingredients/ingredientsHelper");
const { getDropboxToken } = require("../../token/servicesTokenUtils");

const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tiff",
    ".ico",
    ".webp",
    ".heic",
    ".txt",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".odt",
    ".ods",
    ".odp",
    ".csv",
    ".rtf",
    ".tex",
    ".md",
    ".mp3",
    ".wav",
    ".ogg",
    ".m4a",
    ".flac",
    ".mp4",
    ".avi",
    ".mkv",
    ".mov",
    ".flv",
    ".wmv",
    ".webm",
    ".zip",
    ".rar",
    ".7z",
    ".tar",
    ".gz",
    ".bz2",
    ".html",
    ".htm",
    ".xml",
    ".css",
    ".js",
    ".php",
    ".py",
    ".java",
    ".c",
    ".cpp",
    ".h",
    ".hpp",
    ".sh",
    ".go",
    ".swift",
    ".sql",
    ".db",
    ".dbf",
    ".mdb",
    ".ttf",
    ".otf",
    ".fon",
    ".woff",
    ".json",
    ".yml",
    ".yaml",
    ".svg",
    ".eps",
    ".ai",
    ".psd",
    ".indd",
    ".acsm",
];

async function checkPathExists(token, path) {
    if (path === "/") {
        return true;
    }
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "api.dropboxapi.com",
            path: "/2/files/get_metadata",
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                if (res.statusCode === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
        req.on("error", (e) => {
            reject(e);
        });
        req.write(JSON.stringify({ path: path }));
        req.end();
    });
}

function checkPathSyntax(path) {
    const dropboxPathPattern = /^\/([^/]*\/?)*$/;
    return dropboxPathPattern.test(path);
}

async function isValidURL(url) {
    try {
        const extension = (url.match(/\.([a-zA-Z0-9]+)(?:[\?\#]|$)/) || [])[1];
        if (!extension || !allowedExtensions.includes("." + extension.toLowerCase())) {
            throw new Error(`Invalid file extension`);
        }
        const response = await axios.head(url);
        return response.status === 200;
    } catch {
        return false;
    }
}

exports.checkDropboxParameters = async function (userId, parameters, actionName) {
    const token = await getDropboxToken(userId);
    for (let param of parameters) {
        const inputValue = param.input;
        switch (param.name) {
            case "folder_path":
                if (!checkPathSyntax(inputValue)) {
                    throw new Error(`Invalid folder path syntax`);
                }
                const folderExists = await checkPathExists(token, inputValue);
                if (!folderExists) {
                    throw new Error(`Folder path does not exist`);
                }
                break;
            case "file_to_upload_url":
                if (inputValue !== "<coverURL>") {
                    const isValid = await isValidURL(inputValue);
                    if (!isValid) {
                        throw new Error(`Invalid file URL provided`);
                    }
                }
                break;
            case "file_to_upload_name":
                const ingredientWithExtensionPattern = /^(?:(?!<|>).)*(<([a-zA-Z0-9_]+)>)(?:(?!<|>).)*(\.[0-9a-z]+)$/i;
                const invalidFileNameChars = [":", '"', "/", "\\", "|", "?", "*"];
                const matches = inputValue.match(ingredientWithExtensionPattern);
                if (matches) {
                    const extension = matches[3].toLowerCase();
                    if (!allowedExtensions.includes(extension)) {
                        throw new Error(`Invalid file extension`);
                    }
                } else {
                    if (invalidFileNameChars.some((char) => inputValue.includes(char)) || !inputValue.includes(".")) {
                        throw new Error(`Invalid filename provided ensure includes a valid extension.`);
                    }
                }
                break;
        }
    }
    return true;
};

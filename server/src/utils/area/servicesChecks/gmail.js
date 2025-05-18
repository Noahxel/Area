const axios = require("axios");
const { isMultValidEmail } = require("../../email/emailHelpers");
const { isIngredient } = require("../../ingredients/ingredientsHelper");

async function isValidURL(url) {
    if (isIngredient(url)) {
        return true;
    }
    try {
        const response = await axios.head(url);
        return response.status === 200;
    } catch {
        return false;
    }
}

exports.checkGmailParameters = async function (userId, parameters) {
    for (let param of parameters) {
        if (!param) continue;

        switch (param.name) {
            case "to_address":
                if (!isMultValidEmail(param.input)) {
                    throw new Error(`Invalid 'To address' email address provided`);
                }
                break;
            case "cc_address":
            case "bcc_address":
                if (isIngredient(param.input)) {
                    throw new Error(`Invalid use of ingredient in '${param.name.replace("_", " ")}'`);
                }
                if (param.input && !isMultValidEmail(param.input)) {
                    throw new Error(`Invalid '${param.name.replace("_", " ")}' email address provided`);
                }
                break;
            case "attachment_url":
                if (param.input === "") {
                    continue;
                }

                if (isIngredient(param.input)) {
                    const ingredientPattern = /^<[\w]+>$/;
                    if (!ingredientPattern.test(param.input)) {
                        throw new Error("Invalid format for attachment URL.");
                    }
                    continue;
                }

                if (!isValidURL(param.input)) {
                    throw new Error("Invalid or not accessible URL");
                }

                break;
            case "subject":
            case "body":
                if (!param.input || param.input.trim() === "") {
                    throw new Error(`${param.name.charAt(0).toUpperCase() + param.name.slice(1)} cannot be empty`);
                }
                break;
        }
    }
    return true;
};

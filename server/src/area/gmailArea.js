const User = require("../models/userModels");
const { makeApiCall } = require("../utils/API/apiUtils");
const { getGmailToken } = require("../utils/token/servicesTokenUtils");

function constructEmailBody(to, cc, bcc, subject, body, attachmentUrl) {
    const boundary = "foo_bar_baz";
    const AREASlogoURL = "https://i.postimg.cc/qvS2KvVs/area-logo-120x120.png";

    to = to.split(/[\s,]+/);
    cc = cc && cc.trim() ? cc.split(/[\s,]+/) : [];
    bcc = bcc && bcc.trim() ? bcc.split(/[\s,]+/) : [];

    function isImageUrl(url) {
        const imageExtensionRegex = /\.(jpeg|jpg|gif|png)$/i;
        const imageDomainRegex = /^https?:\/\/i\.scdn\.co\/image\//i;
        return imageExtensionRegex.test(url) || imageDomainRegex.test(url);
    }
    let attachmentHtml = "";
    if (attachmentUrl && attachmentUrl.trim()) {
        if (isImageUrl(attachmentUrl)) {
            attachmentHtml =
                `<div style="text-align: center; margin-bottom: 30px;">` +
                `<img src="${attachmentUrl}" alt="Attachment Image" style="max-width: 100%; border: none; border-radius: 5px;">` +
                `</div>`;
        } else {
            attachmentHtml =
                `<div style="text-align: center; margin-bottom: 30px;">` +
                `<a href="${attachmentUrl}" target="_blank" style="background-color: #000000; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Web Attachment</a>` +
                `</div>`;
        }
    }
    let emailLines = [
        `MIME-Version: 1.0`,
        `To: ${to.join(", ")}`,
        `Subject: ${subject}`,
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/html; charset=UTF-8`,
        ``,
        `<html><body>`,
        `<div style="font-family: 'Archivo', Arial, sans-serif; padding: 40px; font-size: 16px; background-color: #f5f5f5;">`,
        `<div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">`, // Ensure everything in this div is centered
        `<img src="${AREASlogoURL}" alt="AREAS Logo" style="max-width: 250px; border: none;">`,
        `<div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">`,
        `<p style="font-size: 20px;">${body}</p>`,
        `</div>`,
        attachmentHtml,
        `<h2 style="font-weight: bold; font-size: 24px; margin-bottom: 10px;"><a href="https://techparisarea.com/" style="color: #000000; text-decoration: none;">Visit AREAS Website</a></h2>`,
        `<p style="font-weight: bold; color: #666666;">14-16 Rue Voltaire, 94270 Le Kremlin-Bicêtre</p>`,
        `<p style="color: #999999;">&copy; ${new Date().getFullYear()} AREAS. All rights reserved. <a href="https://techparisarea.com/privacy-policy" style="color: #000000; text-decoration: none;">Privacy Policy</a></p>`,
        `</div>`,
        `</div>`,
        `</body></html>`,
        `--${boundary}--`,
    ];
    if (cc.length > 0) emailLines.splice(2, 0, `Cc: ${cc.join(", ")}`);
    if (bcc.length > 0) emailLines.splice(3, 0, `Bcc: ${bcc.join(", ")}`);

    const emailBody = emailLines.join("\r\n").trim();
    const encodedEmail = Buffer.from(emailBody).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return encodedEmail;
}

exports.sendEmail = async function (userId, to, cc, bcc, subject, body, attachmentUrl) {
    const accessToken = await getGmailToken(userId);
    const raw = constructEmailBody(to, cc, bcc, subject, body, attachmentUrl);
    const url = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
    const data = { raw };
    return makeApiCall(url, "POST", headers, data);
};

exports.sendEmailToSelf = async function (userId, subject, body, attachmentUrl, ingredients) {
    const user = await User.findById(userId);
    if (user && user.email) {
        return exports.sendEmail(userId, user.connectServices.get("gmail").data.email, "", "", subject, body, attachmentUrl, ingredients);
    }
    throw new Error("User email not found.");
};

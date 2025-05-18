const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../../models/userModels");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const AREASlogoURL = "https://i.postimg.cc/qvS2KvVs/area-logo-120x120.png";
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendEmail = (mailOptions) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
};

exports.isMultValidEmail = (emailString) => {
    return emailString.split(/[\s,]+/).every((email) => emailRegex.test(email));
};

exports.isValidEmail = (email) => {
    return emailRegex.test(email);
};

exports.updateUserEmail = async (user, newEmail) => {
    if (!exports.isValidEmail(newEmail)) {
        throw new Error("Invalid email format");
    }
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && String(existingUser._id) !== String(user._id)) {
        throw new Error("Email is already in use");
    }
    const emailChangeToken = crypto.randomBytes(32).toString("hex");
    user.pendingEmail = newEmail;
    user.emailChangeToken = emailChangeToken;
    await sendEmailChangeConfirmationMail(newEmail, emailChangeToken);
};

const generateButton = (url, text) => {
    return `
      <div style="text-align: center; margin-top: 20px;">
        <a href="${url}" target="_blank" style="background-color: #000000; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-family: 'Archivo', Arial, sans-serif; font-size: 16px;">
          ${text}
        </a>
      </div>
    `;
};

const generateMailTemplate = (bodyContent) => {
    return `
      <div style="font-family: 'Archivo', Arial, sans-serif; padding: 40px; font-size: 16px; background-color: #f5f5f5; text-align: center;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); margin: auto; max-width: 600px;">
              <div style="margin-bottom: 30px;">
                  <img src="${AREASlogoURL}" alt="AREAS Logo" style="max-width: 250px; border: none;">
              </div>
              <div style="font-weight: bold; color: #000000;">${bodyContent}</div>
          </div>
          <div style="padding-top: 30px;">
              <h2 style="font-weight: bold; font-size: 24px; margin-bottom: 10px;"><a href="https://techparisarea.com/" style="color: #000000; text-decoration: none;">Visit AREAS Website</a></h2>
              <p style="font-weight: bold; color: #000000;">14-16 Rue Voltaire, 94270 Le Kremlin-Bicêtre</p>
              <p style="font-weight: bold; color: #000000;">&copy; ${new Date().getFullYear()} AREAS. All rights reserved. <a href="https://techparisarea.com/privacy-policy" style="color: #000000; text-decoration: none;">Privacy Policy</a></p>
          </div>
      </div>
    `;
};

exports.sendConfirmationMail = async (email, confirmationToken) => {
    const bodyContent = `
    <p>To confirm your email, please click the button below</p>
    ${generateButton("https://techparisarea.com/auth/confirm/" + confirmationToken, "Confirm Your Email")}
    `;

    const mailOptions = {
        from: `"AREAS" <${process.env.EMAIL}>`,
        to: email,
        subject: "[AREAS] Please confirm your email",
        html: generateMailTemplate(bodyContent),
    };
    sendEmail(mailOptions);
};

const sendEmailChangeConfirmationMail = async (email, emailChangeToken) => {
    const bodyContent = `
      <p>To confirm, please click the link below</p>
      ${generateButton("https://techparisarea.com/auth/confirm-email-change/" + emailChangeToken, "Confirm New Email")}
    `;

    const mailOptions = {
        from: `"AREAS" <${process.env.EMAIL}>`,
        to: email,
        subject: "[AREAS] Please confirm your email change",
        html: generateMailTemplate(bodyContent),
    };
    sendEmail(mailOptions);
};

exports.sendPasswordResetMail = async (email, resetToken) => {
    const bodyContent = `
      <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the button below to complete the process within one hour:</p>
      ${generateButton("https://api.techparisarea.com/reset/password/" + resetToken, "Reset Your Password")}
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "[AREAS] Password Reset Request",
        html: generateMailTemplate(bodyContent),
    };
    sendEmail(mailOptions);
};

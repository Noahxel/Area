const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           description: The access token for the service.
 *         refresh_token:
 *           type: string
 *           description: The refresh token for the service.
 *         expires_in:
 *           type: integer
 *           description: The expiration time of the token in seconds.
 *         tokenIssuedAt:
 *           type: integer
 *           description: The timestamp when the token was issued.
 *         data:
 *           type: object
 *           description: Additional data related to the service.
 */
const ServiceSchema = new Schema({
    access_token: {
        type: String,
        default: "",
    },
    refresh_token: {
        type: String,
        default: "",
    },
    expires_in: {
        type: Number,
        default: null,
    },
    tokenIssuedAt: {
        type: Number,
        default: Date.now,
    },
    data: {
        type: Object,
        default: {},
    },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ExternalAuthService:
 *       type: object
 *       properties:
 *         service:
 *           type: string
 *           description: The name of the external authentication service.
 *         serviceId:
 *           type: string
 *           description: The unique identifier for the user in the external service.
 */
const ExternalAuthServiceSchema = new Schema({
    service: String,
    serviceId: String,
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         password:
 *           type: string
 *           description: The password of the user (hashed).
 *         pendingEmail:
 *           type: string
 *           description: The pending email address if the user is changing email.
 *         emailChangeToken:
 *           type: string
 *           description: The token for email change verification.
 *         confirmed:
 *           type: boolean
 *           description: Whether the user's email is confirmed.
 *         confirmationToken:
 *           type: string
 *           description: The token for email confirmation.
 *         resetPasswordToken:
 *           type: string
 *           description: The token for password reset.
 *         resetPasswordExpires:
 *           type: string
 *           format: date-time
 *           description: The expiration time for the reset password token.
 *         connectServices:
 *           type: object
 *           additionalProperties:
 *             $ref: '#/components/schemas/Service'
 *           description: The services connected to the user's account.
 *         externalAuth:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ExternalAuthService'
 *           description: External authentication services linked to the user's account.
 */
const userSchema = new mongoose.Schema({
    username: { type: String, default: "" },
    email: { type: String, required: true },
    password: { type: String },
    pendingEmail: { type: String },
    emailChangeToken: { type: String },
    confirmed: { type: Boolean, default: false },
    confirmationToken: { type: String },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
    },
    connectServices: {
        type: Map,
        of: ServiceSchema,
        default: {},
    },
    externalAuth: [ExternalAuthServiceSchema],
});

module.exports = mongoose.model("User", userSchema);

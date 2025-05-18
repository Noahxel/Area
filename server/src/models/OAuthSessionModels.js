const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 * OAuthSession:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The user's unique identifier.
 *         service:
 *           type: string
 *           description: The name of the service.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation time of the session.
 *
 */
const OAuthSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    service: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
});

const OAuthSession = mongoose.model('OAuthSession', OAuthSessionSchema);

module.exports = OAuthSession;

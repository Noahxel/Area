const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Retrieve the profile of the authenticated user
 *     tags: [profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's profile
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                 email:
 *                   type: string
 *                   description: The email of the user.
 *                 connectServices:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The list of connected services by the user.
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/", profileController.getUserProfile);

/**
 * @swagger
 * /profile/update:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated profile information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The new email. If changed, a confirmation link will be sent to this address.
 *               username:
 *                 type: string
 *                 description: The new username.
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 description: The current password, required if changing the password.
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password.
 *     responses:
 *       200:
 *         description: Profile update status. The response message details which fields were changed or if no fields were changed at all. If the email was altered, a note about the confirmation link sent to the new address will be included.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Request error, e.g. invalid email format, email already in use, incorrect old password, same old and new password provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Unauthorized action, e.g., trying to modify the email or password after authenticating via an external service.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put("/update", profileController.updateProfile);

module.exports = router;

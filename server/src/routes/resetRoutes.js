const express = require("express");
const router = express.Router();
const resetController = require("../controllers/resetController");

/**
 * @swagger
 * /reset/request-password-reset:
 *   post:
 *     summary: Sends a password reset link to the user's email
 *     tags: [reset]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user requesting a password reset.
 *                 required: true
 *     responses:
 *       200:
 *         description: Reset link email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reset link email sent
 *       400:
 *         description: User authenticated with OAuth2 and hasn't set a password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You authenticated using OAuth2 and haven't set a password on this account. Please login using your OAuth2 service.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.post("/request-password-reset", resetController.requestPasswordReset);

/**
 * @swagger
 * /reset/password/{token}:
 *   get:
 *     summary: Display the form (or page) for the user to set a new password.
 *     tags: [reset]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token received in the email link.
 *     responses:
 *       200:
 *         description: Successfully fetched the password reset form/page.
 *       400:
 *         description: Invalid or expired token.
 *       500:
 *         description: Server error.
 */
router.get("/password/:token", resetController.displayResetForm);

/**
 * @swagger
 * /reset/password:
 *   post:
 *     summary: Updates the user's password using the provided token and new password.
 *     tags: [reset]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token received in the email link.
 *                 required: true
 *               newPassword:
 *                 type: string
 *                 description: The new password the user wants to set.
 *                 required: true
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad Request (e.g., Missing token or new password).
 *       500:
 *         description: Server error.
 */
router.post("/password", resetController.updatePassword);

module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     summary: sign up a new user
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username.
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: User sign up successfully. Please confirm your email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       400:
 *         description: Bad request. This response can occur if the email format is invalid or empty password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       409:
 *         description: Conflict. This response occurs if the user already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
router.post("/sign-up", authController.sign_up);

/**
 * @swagger
 * /auth/confirm/{token}:
 *   get:
 *     summary: Confirm a user's registration
 *     tags: [auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Confirmation token
 *     responses:
 *       200:
 *         description: Account confirmed successfully
 *       400:
 *         description: Invalid token
 *       500:
 *         description: Server error
 */
router.get("/confirm/:token", authController.confirm);

/**
 * @swagger
 * /auth/confirm-email-change/{token}:
 *   get:
 *     summary: Confirm a user's email change
 *     tags: [auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Email change confirmation token
 *     responses:
 *       200:
 *         description: Email changed successfully
 *       400:
 *         description: Invalid token
 *       500:
 *         description: Server error
 */
router.get('/confirm-email-change/:token', authController.confirmEmailChange);

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     summary: Login a user
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: User sign in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token for user authentication.
 *       400:
 *         description: Invalid credentials or account not confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       401:
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
router.post("/sign-in", authController.sign_in);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Redirect the user to the Google authentication page
 *     tags: [auth]
 *     responses:
 *       302:
 *         description: Redirect to the Google authentication page.
 */
router.get("/google", authController.redirectToGoogle);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Handle the callback from Google after user authentication
 *     tags: [auth]
 *     responses:
 *       200:
 *         description: Successfully authenticated and JWT token returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Authentication failed.
 *       500:
 *         description: Server error.
 */
router.get("/google/callback", authController.handleGoogleCallback);

module.exports = router;

const express = require("express");
const router = express.Router();
const connectController = require("../controllers/connectController");
const ensureAuthenticated = require("../middleware/general/authenticationMiddleware");
const { SERVICES } = require('../config/serviceConfig');

Object.keys(SERVICES).forEach((serviceName) => {
    const capitalizedServiceName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1);

    /**
     * @swagger
     * /connect/get${capitalizedServiceName}OAuthConstants:
     *   get:
     *     tags:
     *       - connect
     *     security:
     *       - bearerAuth: []
     *     description: Fetches ${capitalizedServiceName} OAuth constants
     *     responses:
     *       200:
     *         description: Returns ${capitalizedServiceName} OAuth constants.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 clientId:
     *                   type: string
     *                   description: The client ID for ${capitalizedServiceName} API.
     *                 redirectUri:
     *                   type: string
     *                   description: The redirect URI for ${capitalizedServiceName} authentication callback.
     *                 scopes:
     *                   type: array
     *                   items:
     *                     type: string
     *                   description: The scopes required for ${capitalizedServiceName} authentication.
     */
    router.get(`/get${capitalizedServiceName}OAuthConstants`, ensureAuthenticated, connectController.getOAuthConstants.bind(null, serviceName));

    /**
     * @swagger
     * /connect/${serviceName}/callback:
     *   get:
     *     tags:
     *       - connect
     *     description: Callback from ${capitalizedServiceName} authentication
     *     responses:
     *       200:
     *         description: ${capitalizedServiceName} connection successful.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                 message:
     *                   type: string
     *       401:
     *         description: Authentication failed.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                 message:
     *                   type: string
     *       500:
     *         description: Internal server error or failed to save user data.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                 message:
     *                   type: string
     */
    router.get(`/${serviceName}/callback`, SERVICES[serviceName].middleware, connectController.callback.bind(null, serviceName));
});

module.exports = router;

const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/aboutController");

/**
 * @swagger
 * /about.json:
 *   get:
 *     summary: Retrieve information about the server and supported services.
 *     description: Provides details on the server, such as the client's IP address, current server time, and a list of all available triggers and actions for each service.
 *     tags: [About]
 *     responses:
 *       200:
 *         description: Information about the server and its services.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client:
 *                   type: object
 *                   properties:
 *                     host:
 *                       type: string
 *                       description: IP address of the client.
 *                 server:
 *                   type: object
 *                   properties:
 *                     current_time:
 *                       type: integer
 *                       description: Current server time in UNIX timestamp format.
 *                     services:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Name of the service.
 *                           color:
 *                             type: string
 *                             description: Color associated with the service.
 *                           triggers:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                 description:
 *                                   type: string
 *                                 parameters:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                           actions:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                 description:
 *                                   type: string
 *                                 parameters:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *       500:
 *         description: Unexpected error occurred on the server side.
 */
router.get("/", aboutController.getInfo);

module.exports = router;

const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete the logged-in user
 *     tags: [users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/delete", usersController.deleteLoggedInUser);

/**
 * @swagger
 * /users/disconnect/{service_name}:
 *   delete:
 *     summary: Disconnect a user from a specific service. If any of the user's areas are linked with this service, they will be deactivated.
 *     tags: [users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: service_name
 *         required: true
 *         description: Name of the service to disconnect (e.g., "github", "spotify", "twitch", "youtube", "gmail")
 *         schema:
 *           type: string
 *           enum: [github, spotify, twitch, youtube, gmail]
 *     responses:
 *       200:
 *         description: Successfully disconnected from the service and related areas have been deactivated.
 *       400:
 *         description: Service name not provided or user is not connected to the service.
 *       500:
 *         description: Server error.
 */
router.delete("/disconnect/:service_name", usersController.disconnectService);

module.exports = router;

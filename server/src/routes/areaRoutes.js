const express = require("express");
const router = express.Router();
const areaController = require("../controllers/areaController");

/**
 * @swagger
 * components:
 *   schemas:
 *     AreaWithoutUserId:
 *       type: object
 *       properties:
 *         trigger:
 *           $ref: '#/components/schemas/Trigger'
 *         actions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Action'
 *         isActive:
 *           type: boolean
 *           description: Indicates if the area is active or not.
 *         area_description:
 *           type: string
 *           description: Description of the area.
 * /areas:
 *   get:
 *     summary: Retrieve all areas associated with the authenticated user, excluding the userId field
 *     tags: [areas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all areas returned successfully for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AreaWithoutUserId'
 *       500:
 *         description: Server error
 */
router.get("/", areaController.listAllAreas);

/**
 * @swagger
 * /areas:
 *   post:
 *     summary: Create a new area by specifying the services, names, and parameters for action and reactions
 *     tags: [areas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trigger:
 *                 type: object
 *                 properties:
 *                   service:
 *                     type: string
 *                     description: The name of the service for the trigger (e.g., "github", "spotify")
 *                   name:
 *                     type: string
 *                     description: The name of the selected trigger within the trigger service
 *                   parameters:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         input:
 *                           type: string
 *                     description: The parameters required for the selected trigger
 *               actions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     service:
 *                       type: string
 *                       description: The name of the service for the action (e.g., "github", "spotify")
 *                     name:
 *                       type: string
 *                       description: The name of the selected action within the action service
 *                     parameters:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           input:
 *                             type: string
 *                       description: The parameters required for the selected action
 *     responses:
 *       200:
 *         description: Area created successfully
 *       400:
 *         description: Bad Request. Possible reasons include specified service/action does not exist, invalid parameters, or a specific validation error regarding a parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A specific error message regarding the parameter validation failure.
 *       404:
 *         description: User not found
 *       409:
 *         description: Area with these parameters already exists
 *       500:
 *         description: Server error
 */
router.post("/", areaController.createArea);

/**
 * @swagger
 * /areas/{id}/switch_activation:
 *   put:
 *     summary: Toggle the activation status of an area by its ID
 *     tags: [areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the area
 *     responses:
 *       200:
 *         description: Area activation status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Area activated successfully"
 *       404:
 *         description: Area not found for the given ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Area not found."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.put("/:id/switch_activation", areaController.switchAreaActivationStatus);

/**
 * @swagger
 * /areas/{id}:
 *   get:
 *     summary: Get a specific area by its ID
 *     tags: [areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the area
 *     responses:
 *       200:
 *         description: Area details returned successfully
 *       404:
 *         description: Area not found for the given ID
 *       500:
 *         description: Server error
 */
router.get("/:id", areaController.getAreaById);

/**
 * @swagger
 * /areas/{id}:
 *   delete:
 *     summary: Delete an area by its ID
 *     tags: [areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the area
 *     responses:
 *       200:
 *         description: Area deleted successfully
 *       404:
 *         description: Area not found for the given ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", areaController.deleteAreaById);

module.exports = router;

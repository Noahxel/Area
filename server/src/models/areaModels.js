const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the ingredient.
 *         value:
 *           type: string
 *           description: The value of the ingredient.
 */
const IngredientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Data:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           description: The data's key.
 *         value:
 *           type: string
 *           description: The data's value.
 */
const DataSchema = new Schema({
    key: {
        type: String,
        required: true,
    },
    value: {
        type: Schema.Types.Mixed,
        required: true,
    },
    total: {
        type: Schema.Types.Mixed,
    },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Parameter:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the parameter.
 *         input:
 *           type: string
 *           description: The input value of the parameter.
 *         optional:
 *           type: boolean
 *           default: false
 *           description: Indicates if the parameter is optional.
 */
const ParameterSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    input: {
        type: String,
    },
    optional: {
        type: Boolean,
        default: false,
        description: "Indicates if the parameter is optional.",
    },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Trigger:
 *       type: object
 *       properties:
 *         service:
 *           type: string
 *           description: The service name.
 *         name:
 *           type: string
 *           description: The name of the trigger.
 *         parameters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Parameter'
 *         ingredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ingredient'
 */
const TriggerSchema = new Schema({
    service: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    parameters: [ParameterSchema],
    data: DataSchema,
    ingredients: [IngredientSchema]
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Action:
 *       type: object
 *       properties:
 *         service:
 *           type: string
 *           description: The service name.
 *         name:
 *           type: string
 *           description: The name of the action.
 *         parameters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Parameter'
 */
const ActionSchema = new Schema({
    service: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    parameters: [ParameterSchema],
    data: DataSchema,
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Area:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The user's unique identifier.
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
 */
const AreaSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    trigger: TriggerSchema,
    actions: [ActionSchema],
    isActive: {
        type: Boolean,
        default: true,
    },
    area_description: {
        type: String,
        default: "",
    },
});

module.exports.Area = mongoose.model("Area", AreaSchema);
module.exports.Trigger = mongoose.model("Trigger", TriggerSchema);
module.exports.Action = mongoose.model("Action", ActionSchema);
module.exports.Parameter = mongoose.model("Parameter", ParameterSchema);
module.exports.Data = mongoose.model("Data", DataSchema);

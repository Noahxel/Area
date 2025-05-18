const mongoose = require("mongoose");
const { AREAS } = require("./areaServices");
const { replacePlaceholdersWithIngredients, isIngredient } = require("../utils/ingredients/ingredientsHelper");

async function executeReaction(areaEntry, action, associatedReaction, reactionParameters) {
    let paramsValues = action.parameters || [];
    let replacedParamsValues = paramsValues.map((param) => {
        if (isIngredient(param.input)) {
            const replaced = replacePlaceholdersWithIngredients(param.input, areaEntry.trigger.ingredients);
            return replaced;
        }
        return param.input;
    });
    try {
        await associatedReaction.actionFunction(areaEntry.userId, ...replacedParamsValues, ...reactionParameters);
        console.log(`Successfully executed reaction for area ID: ${areaEntry._id}`);
    } catch (error) {
        console.error(`Failed to execute reaction for area ID: ${areaEntry._id}`, error);
    }
}

exports.checkAndReact = async () => {
    try {
        const activeServiceAreas = await mongoose.model("Area").find({ isActive: true });
        console.log(`Found ${activeServiceAreas.length} active service areas.`);
        for (const areaEntry of activeServiceAreas) {
            console.log("Evaluating area:", areaEntry._id);
            const triggerService = AREAS[areaEntry.trigger.service];
            if (!triggerService) {
                console.warn(`Trigger Service not found for ${areaEntry.trigger.service} in area ID: ${areaEntry._id}`);
                continue;
            }
            const detectedTrigger = triggerService.triggers.find((t) => t.name === areaEntry.trigger.name);
            if (!detectedTrigger) {
                console.warn(`Trigger not found for ${areaEntry.trigger.name} in area ID: ${areaEntry._id}`);
                continue;
            }
            const hasTriggered = await detectedTrigger.triggerFunction(areaEntry);
            console.log(`Trigger ${areaEntry.trigger.name} has been ${hasTriggered ? "detected" : "not detected"} for area ID: ${areaEntry._id}`);
            if (!hasTriggered) continue;
            for (const action of areaEntry.actions) {
                const actionService = AREAS[action.service];
                if (!actionService) {
                    console.warn(`Action Service not found for ${action.service} in area ID: ${areaEntry._id}`);
                    continue;
                }
                const associatedReaction = actionService.actions.find((r) => r.name === action.name);
                if (!associatedReaction) {
                    console.warn(`Reaction not found for ${action.name} in area ID: ${areaEntry._id}`);
                    continue;
                }
                try {
                    const reactionParameters = action.parameters.length > 0 ? action.parameters : [];
                    await executeReaction(areaEntry, action, associatedReaction, reactionParameters);
                } catch (reactionError) {
                    console.error(`Error during reaction execution for area ID: ${areaEntry._id}:`, reactionError);
                }
            }
        }
    } catch (error) {
        console.error("Error during overall trigger evaluation:", error);
    }
};

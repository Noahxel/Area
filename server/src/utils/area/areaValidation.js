const { AREAS } = require("../../core/areaServices");
const { Area } = require("../../models/areaModels");

exports.doesDuplicateActionExist = (actions) => {
    const actionStrings = actions.map((a) => {
        return JSON.stringify({
            service: a.service,
            name: a.name,
            parameters: a.parameters,
        });
    });
    return new Set(actionStrings).size !== actionStrings.length;
};

exports.isExistingArea = async (user, trigger, actions) => {
    const potentialAreas = await Area.find({
        userId: user._id,
        "trigger.service": trigger.service,
        "trigger.name": trigger.name,
    });

    const isSameParameter = (param1, param2) => {
        return param1.name === param2.name && param1.input === param2.input;
    };

    const isSameAction = (action1, action2) => {
        return (
            action1.service === action2.service &&
            action1.name === action2.name &&
            action1.parameters.length === action2.parameters.length &&
            action1.parameters.every((p, index) => isSameParameter(p, action2.parameters[index]))
        );
    };

    const existingArea = potentialAreas.find(
        (area) =>
            area.actions.length === actions.length &&
            area.actions.every((a, index) => isSameAction(a, actions[index])) &&
            trigger.parameters.every((p, index) => isSameParameter(p, area.trigger.parameters[index]))
    );

    return !!existingArea;
};

exports.isValidTriggerService = (trigger) => {
    const triggerServiceObj = AREAS[trigger.service];
    if (!triggerServiceObj) {
        return false;
    }
    const triggerObj = triggerServiceObj.triggers.find((t) => t.name === trigger.name);
    return !!triggerObj;
};

exports.processTrigger = async (areaEntry, key, value) => {
    areaEntry.trigger.data = { key, value };
    await areaEntry.save();
    return true;
};

exports.processTriggerDataLiveTwitch = async (areaEntry, key, value) => {
    if (!areaEntry.trigger.data || value != areaEntry.trigger.data.value) {
        areaEntry.trigger.data = { key, value };
        await areaEntry.save();
        return true;
    }
};

exports.processTriggerData = async (areaEntry, key, value) => {
    if (!areaEntry.trigger.data) {
        areaEntry.trigger.data = { key, value };
        await areaEntry.save();
        return false;
    } else if (areaEntry.trigger.data.value !== value) {
        areaEntry.trigger.data = { key, value };
        await areaEntry.save();
        return true;
    }
    return false;
};

exports.processTriggerDataTotal = async (areaEntry, key, value, total) => {
    let isNewAssignment = false;

    if (!areaEntry.trigger.data || total === 0) {
        areaEntry.trigger.data = { key, value, total };
        await areaEntry.save();
        return isNewAssignment;
    }

    if (total > areaEntry.trigger.data.total) {
        isNewAssignment = true;
    } else if (total < areaEntry.trigger.data.total) {
        isNewAssignment = false;
    } else if (value !== areaEntry.trigger.data.value) {
        isNewAssignment = true;
    }

    areaEntry.trigger.data.key = key;
    areaEntry.trigger.data.value = value;
    areaEntry.trigger.data.total = total;
    await areaEntry.save();

    return isNewAssignment;
};

const formatTrigger = require("./triggerFormatters").formatTrigger;
const formatAction = require("./actionFormatters").formatAction;

exports.formatService = (areaKey, area) => {
    if (!area.triggers || !area.actions) return null;

    return {
        name: areaKey,
        color: area.color,
        triggers: area.triggers.map(formatTrigger),
        actions: area.actions.map(formatAction),
    };
};

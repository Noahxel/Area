const { AREAS } = require("../../../core/areaServices");

exports.isParameterOptional = function (service, actionOrTriggerName, paramName) {
    const area = AREAS[service];
    if (!area) return false;

    const findParam = (arr) => {
        for (const item of arr) {
            if (item.name === actionOrTriggerName) {
                return item.parameters.find((p) => p.name === paramName);
            }
        }
        return null;
    };

    const param = findParam(area.triggers) || findParam(area.actions);
    return param ? param.optional : false;
};

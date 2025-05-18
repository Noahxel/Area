const serviceCheckFunctions = require("../servicesChecks");
const { isParameterOptional } = require("./isParameterOptional");

const validateParam = (param, service, actionOrTriggerName) => {
    if (param === null || Object.keys(param).length === 0) return;

    const isOptional = isParameterOptional(service, actionOrTriggerName, param.name);
    const isIngredient = param.input && param.input.startsWith("<") && param.input.endsWith(">");

    if ((!param.name || !param.input) && !isOptional) {
        throw new Error(`Missing name or input for parameter ${JSON.stringify(param)}`);
    }

    if (!isOptional && !isIngredient && !param.input) {
        throw new Error(`Expected ingredient but got ${JSON.stringify(param)}`);
    }
};

const checkServiceFunctions = async (userId, service, parameters, actionOrTriggerName) => {
    try {
        if (service === "openWeather") {
            await serviceCheckFunctions[service](parameters);
        } else if (service === "dateTime") {
            await serviceCheckFunctions[service](actionOrTriggerName, parameters);
        } else {
            await serviceCheckFunctions[service](userId, parameters, actionOrTriggerName);
        }
    } catch (error) {
        throw error;
    }
};

const checkParam = async (userId, parameters, service, actionOrTriggerName) => {
    if (!Array.isArray(parameters)) {
        throw new Error(`Parameters is not an array: ${JSON.stringify(parameters)}`);
    }
    parameters.forEach((param) => {
        console.log(`Checking parameter: ${JSON.stringify(param)}`);
        validateParam(param, service, actionOrTriggerName);
    });
    await checkServiceFunctions(userId, service, parameters, actionOrTriggerName);
    return true;
};

exports.checkParameters = async function (userId, trigger, actions) {
    await checkParam(userId, trigger.parameters, trigger.service, trigger.name);
    for (const action of actions) {
        await checkParam(userId, action.parameters, action.service, action.name);
    }
    return true;
};

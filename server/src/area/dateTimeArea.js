const moment = require("moment-timezone");
const { updateIngredients } = require("../utils/ingredients/ingredientsHelper");
const { processTrigger } = require("../utils/area/areaValidation");

const getCurrentTimeInZone = () => moment().tz("Europe/Paris").add(1, "hours");

const findParameter = (parameters, name) => {
    const parameter = parameters.find((p) => p.name === name);
    return parameter ? parseInt(parameter.input, 10) : null;
};

const fillDateTimeIngredients = (date) => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = days[date.getDay()];
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return [
        { name: "date", value: `${year}-${month}-${day}` },
        { name: "day", value: dayOfWeek },
        { name: "month", value: month },
        { name: "year", value: year },
        { name: "hour", value: hour },
        { name: "minute", value: minute },
    ];
};

exports.everyDayAt = async (areaEntry) => {
    const now = getCurrentTimeInZone().toDate();
    const targetHour = findParameter(areaEntry.trigger.parameters, "target_hour");
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${targetHour}-${targetMinute}`;

    if (now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.data || areaEntry.trigger.data.value !== uniqueIdentifier) {
            await updateIngredients(areaEntry, fillDateTimeIngredients(now));
            return await processTrigger(areaEntry, "lastTriggeredDay", uniqueIdentifier);
        }
    }
    return false;
};

exports.everyHourAt = async function (areaEntry) {
    const validMinutes = [0, 15, 30, 45];
    const now = getCurrentTimeInZone().toDate();
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}`;

    if (validMinutes.includes(targetMinute) && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.data || areaEntry.trigger.data.value !== uniqueIdentifier) {
            updateIngredients(areaEntry, fillDateTimeIngredients(now));
            return await processTrigger(areaEntry, "lastTriggeredHour", uniqueIdentifier);
        }
    }
    return false;
};

exports.everyDayOfTheWeekAt = async function (areaEntry) {
    const now = getCurrentTimeInZone().toDate();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[now.getDay()];
    const targetHour = findParameter(areaEntry.trigger.parameters, "target_hour");
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${currentDay}-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    const daysArray = areaEntry.trigger.parameters.filter((p) => p.name === "days_array").flatMap((p) => p.input.split(/\s+/));

    if (daysArray.includes(currentDay) && now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.data || areaEntry.trigger.data.value !== uniqueIdentifier) {
            updateIngredients(areaEntry, fillDateTimeIngredients(now));
            return await processTrigger(areaEntry, "lastTriggeredDayOfWeek", uniqueIdentifier);
        }
    }
    return false;
};

exports.everyMonthOnThe = async function (areaEntry) {
    const now = getCurrentTimeInZone().toDate();
    const targetDay = findParameter(areaEntry.trigger.parameters, "target_day");
    const targetHour = findParameter(areaEntry.trigger.parameters, "target_hour");
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${now.getFullYear()}-${now.getMonth() + 1}-${targetDay}`;

    if (now.getDate() === targetDay && now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.data || areaEntry.trigger.data.value !== uniqueIdentifier) {
            updateIngredients(areaEntry, fillDateTimeIngredients(now));
            return await processTrigger(areaEntry, "lastTriggeredMonth", uniqueIdentifier);
        }
    }
    return false;
};

exports.everyYearOn = async function (areaEntry) {
    const now = getCurrentTimeInZone().toDate();
    const targetMonth = findParameter(areaEntry.trigger.parameters, "target_month");
    const targetDay = findParameter(areaEntry.trigger.parameters, "target_day");
    const targetHour = findParameter(areaEntry.trigger.parameters, "target_hour");
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${now.getFullYear()}-${targetMonth}-${targetDay}`;

    if (now.getMonth() + 1 === targetMonth && now.getDate() === targetDay && now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.data || areaEntry.trigger.data.value !== uniqueIdentifier) {
            updateIngredients(areaEntry, fillDateTimeIngredients(now));
            return await processTrigger(areaEntry, "lastTriggeredYear", uniqueIdentifier);
        }
    }
    return false;
};

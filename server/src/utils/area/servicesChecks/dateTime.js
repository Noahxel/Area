const VALID_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const triggerValidations = {
    every_day_at: {
        target_hour: validateRange(0, 23),
        target_minute: validateRange(0, 59),
    },
    every_hour_at: {
        target_minute: (input) => {
            input = String(input).padStart(2, "0");
            if (!["00", "15", "30", "45"].includes(input)) {
                throw new Error(`Invalid target_minute provided. Must be "00", "15", "30", "45".`);
            }
            return input;
        },
    },
    every_day_of_the_week_at: {
        days_array: formatAndValidateDaysArray,
        target_hour: validateRange(0, 23),
        target_minute: validateRange(0, 59),
    },
    every_month_on_the: {
        target_day: validateRange(1, 31),
        target_hour: validateRange(0, 23),
        target_minute: validateRange(0, 59),
    },
    every_year_on: {
        target_month: validateRange(1, 12),
        target_day: validateRange(1, 31),
        target_hour: validateRange(0, 23),
        target_minute: validateRange(0, 59),
    },
};

function validateRange(min, max) {
    return (value) => {
        value = String(value).padStart(2, "0");
        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue < min || parsedValue > max) {
            throw new Error(`Value ${value} is out of range`);
        }
        return parsedValue < 10 ? `0${parsedValue}` : `${parsedValue}`;
    };
}

function formatAndValidateDaysArray(input) {
    const days = input
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((day) => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase());
    if (days.some((day) => !VALID_DAYS.includes(day))) {
        throw new Error(`Invalid days provided`);
    }
    return days.join(" ");
}

exports.checkDatetimeParameters = function (triggerType, parameters) {
    const validations = triggerValidations[triggerType];
    if (!validations) {
        throw new Error(`Unrecognized trigger type: ${triggerType}`);
    }
    for (let param of parameters) {
        const validate = validations[param.name];
        if (!validate) {
            throw new Error(`Validation for parameter ${param.name} not found.`);
        }
        if (!validate(param.input)) {
            console.log(`Validation failed for ${param.name} with value ${param.input}`);
            throw new Error(`Invalid ${param.name} provided`);
        }
        param.input = validate(param.input);
    }
    return true;
};

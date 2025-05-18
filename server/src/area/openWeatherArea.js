const { fetchWeatherData } = require("../utils/API/openWeatherAPI");
const { processTrigger } = require("../utils/area/areaValidation");
const { updateIngredients } = require("../utils/ingredients/ingredientsHelper");

exports.sunny_weather = async function (areaEntry) {
    try {
        const weatherData = await fetchWeatherData(areaEntry.trigger.parameters[0].input);
        const weatherConditions = weatherData.weather.map((condition) => condition.main);
        const isSunny = weatherConditions.includes("Clear");
        if (!areaEntry.trigger.data) await processTrigger(areaEntry, "weather", "");

        const lastCondition = areaEntry.trigger.data.value;
        if (isSunny && lastCondition !== "Clear") {
            updateIngredients(areaEntry, [
                { name: "city", value: weatherData.name },
                { name: "description", value: weatherData.weather[0].description },
                { name: "temperature", value: weatherData.main.temp },
            ]);
            return await processTrigger(areaEntry, "weather", "Clear");
        } else if (!isSunny && lastCondition === "Clear") {
            await processTrigger(areaEntry, "weather", weatherConditions);
        }
        return false;
    } catch (error) {
        console.error("Error in sunny_weather function:", error);
        return false;
    }
};

exports.cloudy_weather = async function (areaEntry) {
    try {
        const weatherData = await fetchWeatherData(areaEntry.trigger.parameters[0].input);
        const weatherConditions = weatherData.weather.map((condition) => condition.main);
        const isCloudy = weatherConditions.includes("Clouds");
        if (!areaEntry.trigger.data) await processTrigger(areaEntry, "weather", "");
        const lastCondition = areaEntry.trigger.data.value;

        if (isCloudy && lastCondition !== "Clouds") {
            updateIngredients(areaEntry, [
                { name: "city", value: areaEntry.parameters.city },
                { name: "description", value: weatherData.weather[0].description },
                { name: "temperature", value: weatherData.main.temp },
            ]);
            return await processTrigger(areaEntry, "weather", "Clouds");
        } else if (!isCloudy && lastCondition === "Clouds") {
            await processTrigger(areaEntry, "weather", weatherConditions);
        }
        return false;
    } catch (error) {
        console.error("Error in cloudy_weather function:", error);
        return false;
    }
};

exports.rainy_weather = async function (areaEntry) {
    try {
        const weatherData = await fetchWeatherData(areaEntry.trigger.parameters[0].input);
        const weatherConditions = weatherData.weather.map((condition) => condition.main);
        const isRaining = weatherConditions.includes("Rain");
        if (!areaEntry.trigger.data) await processTrigger(areaEntry, "weather", "");
        const lastCondition = areaEntry.trigger.data.value;

        if (isRaining && lastCondition !== "Rain") {
            updateIngredients(areaEntry, [
                { name: "city", value: areaEntry.parameters.city },
                { name: "description", value: weatherData.weather[0].description },
                { name: "temperature", value: weatherData.main.temp },
            ]);
            return await processTrigger(areaEntry, "weather", "Rain");
        } else if (!isRaining && lastCondition === "Rain") {
            await processTrigger(areaEntry, "weather", weatherConditions);
        }
        return false;
    } catch (error) {
        console.error("Error in rainy_weather function:", error);
        return false;
    }
};

exports.thunderstorm_weather = async function (areaEntry) {
    try {
        const weatherData = await fetchWeatherData(areaEntry.trigger.parameters[0].input);
        const weatherConditions = weatherData.weather.map((condition) => condition.main);
        const isThunderstorm = weatherConditions.includes("Thunderstorm");
        if (!areaEntry.trigger.data) await processTrigger(areaEntry, "weather", "");

        const lastCondition = areaEntry.trigger.data.value;
        if (isThunderstorm && lastCondition !== "Thunderstorm") {
            updateIngredients(areaEntry, [
                { name: "city", value: areaEntry.parameters.city },
                { name: "description", value: weatherData.weather[0].description },
                { name: "temperature", value: weatherData.main.temp },
            ]);
            return await processTrigger(areaEntry, "weather", "Thunderstorm");
        } else if (!isThunderstorm && lastCondition === "Thunderstorm") {
            await processTrigger(areaEntry, "weather", weatherConditions);
        }
        return false;
    } catch (error) {
        console.error("Error in thunderstorm_weather function:", error);
        return false;
    }
};

exports.snow_weather = async function (areaEntry) {
    try {
        const weatherData = await fetchWeatherData(areaEntry.trigger.parameters[0].input);
        const weatherConditions = weatherData.weather.map((condition) => condition.main);
        const isSnowing = weatherConditions.includes("Snow");
        if (!areaEntry.trigger.data) await processTrigger(areaEntry, "weather", "");

        const lastCondition = areaEntry.trigger.data.value;
        if (isSnowing && lastCondition !== "Snow") {
            updateIngredients(areaEntry, [
                { name: "city", value: areaEntry.parameters.city },
                { name: "description", value: weatherData.weather[0].description },
                { name: "temperature", value: weatherData.main.temp },
            ]);
            return await processTrigger(areaEntry, "weather", "Snow");
        } else if (!isSnowing && lastCondition === "Snow") {
            await processTrigger(areaEntry, "weather", weatherConditions);
        }
        return false;
    } catch (error) {
        console.error("Error in snow_weather function:", error);
        return false;
    }
};

exports.temperature_change = async function (areaEntry) {
    try {
        const weatherData = await fetchWeatherData(areaEntry.trigger.parameters[0].input);
        const currentTemperature = weatherData.main.temp;
        const threshold = parseFloat(areaEntry.trigger.parameters[1].input);
        const lastTemperature = areaEntry.trigger.data ? areaEntry.trigger.data.value : null;
        const hasCrossedThreshold =
            lastTemperature !== null ? (threshold >= lastTemperature && currentTemperature > threshold) || (threshold <= lastTemperature && currentTemperature < threshold) : false;

        if (hasCrossedThreshold) {
            updateIngredients(areaEntry, [
                { name: "city", value: weatherData.name },
                { name: "description", value: `Temperature crossed the threshold of ${threshold}°C` },
                { name: "temperature", value: currentTemperature },
            ]);
            await processTrigger(areaEntry, "temperature", currentTemperature);
            return true;
        }
        if (lastTemperature !== currentTemperature) {
            await processTrigger(areaEntry, "temperature", currentTemperature);
        }
        return false;
    } catch (error) {
        console.error("Error in temperature_change function:", error);
        return false;
    }
};

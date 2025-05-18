const axios = require("axios");
const { isIngredient } = require("../../ingredients/ingredientsHelper");
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

async function checkCityWeather(city) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}`);
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        return false;
    }
}

exports.checkOpenWeatherParameters = async function (parameters) {
    for (let param of parameters) {
        if (isIngredient(param.input)) {
            throw new Error(`Ingredients not allowed for OpenWeather`);
        }
        if (param.name === "city") {
            const cityExists = await checkCityWeather(param.input);
            if (!cityExists) {
                throw new Error(`Invalid city provided`);
            }
        }
        if (param.name === "threshold") {
            const threshold = parseInt(param.input, 10);
            if (!Number.isInteger(threshold) || threshold < -100 || threshold > 100) {
                throw new Error(`Invalid threshold provided, integer between -100 and 100 required`);
            }
        }
    }
    return true;
};

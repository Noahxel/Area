const { makeApiCall } = require("./apiUtils");

exports.fetchWeatherData = async function (city) {
    try {
        const openWeatherAPI_key = process.env.OPENWEATHERMAP_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${openWeatherAPI_key}`;
        const data = await makeApiCall(url);
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw new Error("Failed to fetch weather data.");
    }
};

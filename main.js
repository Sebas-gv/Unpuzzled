
// These are the weather codes returned by Open-Meteo.
// We convert them into readable weather conditions.

const weatherCodes = {
    0: "Clear",
    1: "Mostly Clear",
    2: "Partly Cloudy",
    3: "Cloudy",
    61: "Rainy",
    71: "Snowy"
};

// This function gets the current weather information
// for Calgary and displays it in the footer

async function loadFooterWeather() {

    // Calgary coordinates are already included in the URL
    const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=51.0501&longitude=-114.0853&hourly=is_day&current=temperature_2m,weather_code&timezone=auto&forecast_days=1";

    try {

        // Send the request and wait for the API response
        const response = await fetch(apiUrl);

        // Stop here if the request failed
        if (!response.ok) {
            throw new TypeError("Unable to retrieve weather data");
        }

        // Turn the response into a JavaScript object
        const data = await response.json();

        console.log(data);

        // Get the current temperature
        const temperature = data.current.temperature_2m;

        // Convert the weather code into a readable condition
        const condition = weatherCodes[data.current.weather_code] || "Unknown";

        // The API returns a date and time like:
        // 2026-10-17T16:30
        const currentTime = data.current.time;

        // Keep only the HH:MM portion
        const displayTime = currentTime.slice(11, 16);

        // Create a timestamp that matches the hourly data
        const currentHour = currentTime.slice(0, 13) + ":00";

        // Find the matching hour in the hourly array
        const index = data.hourly.time.indexOf(currentHour);

        // Check whether the current hour is daytime or nighttime
        const isDay = data.hourly.is_day[index];

        // Show the temperature in the footer
        document.getElementById("footerTemperature").textContent = `🌡️${temperature}°C`;

        // Show the weather condition
        document.getElementById("footerCondition").textContent = `☁️ ${condition}`;

        // Show the current time
        document.getElementById("footerTime").textContent = `🕒 ${displayTime}`;

        // Display a simple day/night message
        const dayNightElement =
            document.getElementById("footerDayNight");

        if (isDay === 1) {
            dayNightElement.textContent ="☀️ Daytime";
        } else {
            dayNightElement.textContent ="🌙 Nighttime";
        }

    } catch (error) {

        console.error(error);

        // Show a fallback message if something goes wrong
        document.getElementById("footerTemperature").textContent = "Weather unavailable";
    }
}

// Automatically update the copyright year

document.getElementById("year").textContent =
    new Date().getFullYear();

// Load the weather when the page opens

loadFooterWeather();
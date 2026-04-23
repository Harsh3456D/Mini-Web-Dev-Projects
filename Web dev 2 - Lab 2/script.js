document.addEventListener('DOMContentLoaded', () => {
    const weatherForm = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const weatherResult = document.getElementById('weather-result');

    weatherForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (!city) return;

        try {
            weatherResult.innerHTML = 'Loading...';
            // First get coordinates from geocoding API
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                weatherResult.innerHTML = '<p>City not found.</p>';
                return;
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            // Then get weather using coordinates
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const weatherData = await weatherRes.json();

            const current = weatherData.current_weather;
            weatherResult.innerHTML = `
                <h2>${name}, ${country}</h2>
                <p>Temperature: ${current.temperature}°C</p>
                <p>Wind Speed: ${current.windspeed} km/h</p>
            `;
        } catch (error) {
            console.error('Error fetching weather:', error);
            weatherResult.innerHTML = '<p>Failed to fetch weather data.</p>';
        }
    });
});
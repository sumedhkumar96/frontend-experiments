async function fetchDataFromAPI(city) {
    try {
        const apiKey = '28b86f831cb14fbd89630839230310';
        const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data.');
        }

        const data = await response.json();
        const weatherData = new WeatherData(
            data.location.name,
            data.current.temp_f + ' F',
            data.current.condition.text
        );

        // Store data in IndexedDB
        const transaction = db.transaction(['weatherData'], 'readwrite');
        const objectStore = transaction.objectStore('weatherData');
        objectStore.put(weatherData);

        const weatherDataArray = [];
        weatherDataArray.push(weatherData);
        return weatherDataArray;
    } catch (error) {
        console.error(error);
        alert('Failed to fetch weather data.');
    }
}
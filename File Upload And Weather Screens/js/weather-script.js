// Define a class to hold weather data
class WeatherData {
    constructor(city, temperature, description) {
        this.city = city;
        this.temperature = temperature;
        this.description = description;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const apiSearchInput = document.getElementById('api-search-input');
    const apiSearchButton = document.getElementById('api-search-button');
    const dbSearchInput = document.getElementById('db-search-input');
    const dbSearchButton = document.getElementById('db-search-button');
    const searchResultsApi = document.getElementById('search-results-api');
    const searchResultsDb = document.getElementById('search-results-db');
    const allDataSection = document.getElementById('all-db-data');
    const allDataContainer = document.getElementById('all-data');

    let db; // IndexedDB reference

    // Initialize IndexedDB
    const request = indexedDB.open('WeatherDataDB', 1);

    request.onerror = function(event) {
        console.error('Failed to open IndexedDB:', event.target.error);
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        displayAllData();
    };

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        const objectStore = db.createObjectStore('weatherData', { keyPath: 'city' });
    };

    apiSearchButton.addEventListener('click', () => {
        const keyword = apiSearchInput.value.trim().toLowerCase();
        if (keyword) {
            searchWeatherDataFromAPI(keyword);
        } else {
            searchResultsApi.innerHTML = '';
        }
    });

    dbSearchButton.addEventListener('click', () => {
        const keyword = dbSearchInput.value.trim().toLowerCase();
        if (keyword) {
            searchWeatherDataFromDB(keyword);
        } else {
            searchResultsDb.innerHTML = '';
        }
    });

    async function searchWeatherDataFromAPI(city) {
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
            displaySearchResults(weatherDataArray, 'search-results-api');
        } catch (error) {
            console.error(error);
            alert('Failed to fetch weather data.');
        }
    }

    function searchWeatherDataFromDB(keyword) {
        const transaction = db.transaction(['weatherData'], 'readonly');
        const objectStore = transaction.objectStore('weatherData');
        const index = objectStore.index('city');

        const results = [];

        index.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                const city = cursor.value.city.toLowerCase();
                if (city.includes(keyword)) {
                    results.push(cursor.value);
                }
                cursor.continue();
            } else {
                displaySearchResults(results, 'search-results-db');
            }
        };
    }

    function displayAllData() {
        const transaction = db.transaction(['weatherData'], 'readonly');
        const objectStore = transaction.objectStore('weatherData');
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            const data = event.target.result;
            displaySearchResults(data, 'all-data');
        };
    }

    function displaySearchResults(results, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        results.forEach((result) => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result');
            resultItem.innerHTML = `
                <p><strong>City:</strong> ${result.city}</p>
                <p><strong>Temperature:</strong> ${result.temperature}</p>
                <p><strong>Description:</strong> ${result.description}</p>
            `;
            container.appendChild(resultItem);
        });
    }
});

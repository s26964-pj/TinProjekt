const apiKey = '5f82816ae5f6e914aea705bf5d99f1d7';

// Funkcja do pobierania prognozy pogody na 5 dni
function getWeather() {
    // Pobieranie nazwę miasta z pola tekstowego
    const cityName = $('#city').val();

    // Sprawdzanie, czy użytkownik wprowadził nazwę miasta
    if (!cityName) {
        alert('Please enter a city name');
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    // Wysyłanie zapytania AJAX do API OpenWeatherMap
    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function (data) {
            // Sprawdzanie, czy uzyskano poprawne dane prognozy
            if (data && data.list && data.list.length > 0) {
                // Wywołanie funkcji do wyświetlania prognozy
                displayWeatherForecast(data);
            } else {
                // Wyświetlanie alertu w przypadku błędu pobierania danych
                alert('Error retrieving weather data. Please try again.');
            }
        },
        error: function (error) {
            // Logowanie błędu w konsoli oraz wyświetlanie alertu o błędzie
            console.log('Error:', error);
            alert('Error retrieving weather data. Please try again.');
        }
    });
}

function displayWeatherForecast(data) {
    // Czyszczenie kontenerów przed dodaniem nowych danych
    $('#weather-section').empty();

    // Obiekt, który będzie przechowywał prognozę dla każdego dnia
    const dailyForecast = {};

    // Przetwarzanie danych prognozy
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.getDate();

        // Sprawdzanie, czy już istnieje prognoza dla tego dnia
        if (!dailyForecast[day]) {
            dailyForecast[day] = {
                date: date,
                temperatures: {
                    day: [],
                    night: []
                },
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                sunrise: new Date(data.city.sunrise * 1000),
                sunset: new Date(data.city.sunset * 1000),
                hourlyForecast: []
            };
        }

        // Określanie, czy to dzień czy noc
        const isDay = date.getHours() >= 6 && date.getHours() < 18;

        // Dodawanie temperatury do odpowiedniej tablicy
        if (isDay) {
            dailyForecast[day].temperatures.day.push(item.main.temp);
        } else {
            dailyForecast[day].temperatures.night.push(item.main.temp);
        }

        // Prognoza godzinowa
        dailyForecast[day].hourlyForecast.push({
            hour: date.getHours(),
            temperature: item.main.temp,
            description: item.weather[0].description,
            icon: item.weather[0].icon
        });
    });

    function roundToHalfDegrees(degrees) {
        return Math.round(degrees * 2) / 2;
    }

    // Pobieranie sekcji, gdzie wyświetlamy prognozę
    const weatherSection = $('#weather-section');

    // Sortowanie daty przed wyświetleniem
    const sortedDays = Object.keys(dailyForecast).sort((a, b) => dailyForecast[a].date - dailyForecast[b].date);

    // Iterowanie przez dni prognozy i wypełnianie kontenerów
    sortedDays.forEach(day => {
        const dayData = dailyForecast[day];
        const containerId = `day${day}`;

        // Tworzenie elementu HTML
        const container = $(`<div id="${containerId}" class="day-forecast"></div>`);
        const date = $(`<h3 id="date-${day}">${dayData.date.toLocaleDateString()}</h3>`);
        const description = $(`<p id="description-${day}">${dayData.description}</p>`);
        const icon = $(`<img id="weather-icon-${day}" src="https://openweathermap.org/img/wn/${dayData.icon}.png" alt="Weather Icon">`);

        // Liczenie średniej temperatury dla dnia i nocy
        const avgTemperatureDay = dayData.temperatures.day.length > 0 ? dayData.temperatures.day.reduce((a, b) => a + b, 0) / dayData.temperatures.day.length : null;
        const avgTemperatureNight = dayData.temperatures.night.length > 0 ? dayData.temperatures.night.reduce((a, b) => a + b, 0) / dayData.temperatures.night.length : null;

        // Tworzenie elementu HTML dla temperatury
        const temperatureDay = avgTemperatureDay !== null ? $(`<p id="temperature-day-${day}">Day Temperature: ${roundToHalfDegrees(avgTemperatureDay)}°C</p>`) : null;
        const temperatureNight = avgTemperatureNight !== null ? $(`<p id="temperature-night-${day}">Night Temperature: ${roundToHalfDegrees(avgTemperatureNight)}°C</p>`) : null;

        // Tworzenie elementu HTML dla prognozy godzinowej
        const hourlyForecastContainer = $(`<div id="hourly-forecast-${day}" class="hourly-forecast"></div>`);
        const hourlyForecastTitle = $('<h4>Hourly Forecast</h4>');

        // Iterowanie przez prognozę godzinową i tworzenie elementu HTML
        dayData.hourlyForecast.forEach(hourlyData => {
            const hourlyItem = $(`
                <div class="hourly-item">
                    <p>${hourlyData.hour}:00</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyData.icon}.png" alt="Hourly Weather Icon">
                    <p>${roundToHalfDegrees(hourlyData.temperature)}°C</p>
                    <p>${hourlyData.description}</p>
                </div>
            `);
            hourlyForecastContainer.append(hourlyItem);
        });

        // Nasłuchiwanie na kliknięcie lub dotknięcie kontenera
        container.on('click tap', function (event) {
            event.preventDefault();
            hourlyForecastContainer.slideToggle();
        });

        // Dodanie elementów do kontenera
        container.append(date, description, icon, temperatureDay, temperatureNight, hourlyForecastTitle, hourlyForecastContainer);

        // Dodanie kontenera do sekcji prognozy
        weatherSection.append(container);
    });
}

// Odświeżanie danych co minutę
function refreshData() {
    getWeather();
}

// Obsługa zdarzenia kliknięcia przycisku "Search"
$(document).ready(function () {
    $('#search-btn').on('click', function () {
        getWeather();
    });

    // Animacja fadeIn dla powitania
    $('#welcome-message').addClass('fadeIn');

    // Odświeżanie danych
    setInterval(refreshData, 60000);
});
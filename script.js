const apiKey = '5f82816ae5f6e914aea705bf5d99f1d7';

// Funkcja do pobierania prognozy pogody na 5 dni
function getWeather() {
    const cityName = $('#city').val();

    if (!cityName) {
        alert('Please enter a city name');
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function (data) {
            if (data && data.list && data.list.length > 0) {
                displayWeatherForecast(data);
            } else {
                alert('Error retrieving weather data. Please try again.');
            }
        },
        error: function (error) {
            console.log('Error:', error);
            alert('Error retrieving weather data. Please try again.');
        }
    });
}

function displayWeatherForecast(data) {
    // Oczyść kontenery przed dodaniem nowych danych
    $('#weather-section').empty();

    // Obiekt, który będzie przechowywał prognozę dla każdego dnia
    const dailyForecast = {};

    // Przetwarzamy dane prognozy
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.getDate();

        // Sprawdzamy, czy już istnieje prognoza dla tego dnia
        if (!dailyForecast[day]) {
            dailyForecast[day] = {
                date: date,
                temperatures: {
                    day: [], // Tablica temperatur dla dnia
                    night: [] // Tablica temperatur dla nocy
                },
                description: item.weather[0].description,
                icon: item.weather[0].icon, // Dodajemy informację o ikonie
                sunrise: new Date(data.city.sunrise * 1000), // Dodajemy czas wschodu słońca
                sunset: new Date(data.city.sunset * 1000), // Dodajemy czas zachodu słońca
                hourlyForecast: [] // Tablica prognozy godzinowej
            };
        }

        // Określamy, czy to dzień czy noc (możesz dostosować to do swojej lokalnej strefy czasowej)
        const isDay = date.getHours() >= 6 && date.getHours() < 18;

        // Dodajemy temperaturę do odpowiedniej tablicy
        if (isDay) {
            dailyForecast[day].temperatures.day.push(item.main.temp);
        } else {
            dailyForecast[day].temperatures.night.push(item.main.temp);
        }

        // Dodajemy prognozę godzinową
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

    // Pobieramy sekcję, gdzie chcemy wyświetlić prognozę
    const weatherSection = $('#weather-section');

    // Sortujemy daty przed wyświetleniem
    const sortedDays = Object.keys(dailyForecast).sort((a, b) => dailyForecast[a].date - dailyForecast[b].date);

    // Iterujemy przez dni prognozy i wypełniamy kontenery
    sortedDays.forEach(day => {
        const dayData = dailyForecast[day];
        const containerId = `day${day}`;

        // Tworzymy elementy HTML
        const container = $(`<div id="${containerId}" class="day-forecast"></div>`);
        const date = $(`<h3 id="date-${day}">${dayData.date.toLocaleDateString()}</h3>`);
        const description = $(`<p id="description-${day}">${dayData.description}</p>`);
        const icon = $(`<img id="weather-icon-${day}" src="http://openweathermap.org/img/wn/${dayData.icon}.png" alt="Weather Icon">`);

        // Liczymy średnią temperaturę dla dnia i nocy
        const avgTemperatureDay = dayData.temperatures.day.length > 0 ? dayData.temperatures.day.reduce((a, b) => a + b, 0) / dayData.temperatures.day.length : null;
        const avgTemperatureNight = dayData.temperatures.night.length > 0 ? dayData.temperatures.night.reduce((a, b) => a + b, 0) / dayData.temperatures.night.length : null;

        // Tworzymy elementy HTML dla temperatury
        const temperatureDay = avgTemperatureDay !== null ? $(`<p id="temperature-day-${day}">Day Temperature: ${roundToHalfDegrees(avgTemperatureDay)}°C</p>`) : null;
        const temperatureNight = avgTemperatureNight !== null ? $(`<p id="temperature-night-${day}">Night Temperature: ${roundToHalfDegrees(avgTemperatureNight)}°C</p>`) : null;

        // Tworzymy elementy HTML dla prognozy godzinowej
        const hourlyForecastContainer = $(`<div id="hourly-forecast-${day}" class="hourly-forecast"></div>`);
        const hourlyForecastTitle = $('<h4>Hourly Forecast</h4>');

        // Iterujemy przez prognozę godzinową i tworzymy elementy HTML
        dayData.hourlyForecast.forEach(hourlyData => {
            const hourlyItem = $(`
                <div class="hourly-item">
                    <p>${hourlyData.hour}:00</p>
                    <img src="http://openweathermap.org/img/wn/${hourlyData.icon}.png" alt="Hourly Weather Icon">
                    <p>${roundToHalfDegrees(hourlyData.temperature)}°C</p>
                    <p>${hourlyData.description}</p>
                </div>
            `);
            hourlyForecastContainer.append(hourlyItem);
        });

        // Dodajemy obsługę zdarzenia najechania na div
        container.hover(
            function () {
                // Pokazujemy prognozę godzinową po najechaniu
                hourlyForecastContainer.slideDown();
            },
            function () {
                // Chowamy prognozę godzinową po opuszczeniu diva
                hourlyForecastContainer.slideUp();
            }
        );

        // Dodajemy elementy do kontenera
        container.append(date, description, icon, temperatureDay, temperatureNight, hourlyForecastTitle, hourlyForecastContainer);

        // Dodajemy kontener do sekcji prognozy
        weatherSection.append(container);
    });
}

// Dodajemy obsługę zdarzenia kliknięcia przycisku
$(document).ready(function () {
    $('#search-btn').on('click', function () {
        getWeather();
    });

    // Dodajemy animację fadeIn dla powitania
    $('#welcome-message').addClass('fadeIn');
});
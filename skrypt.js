const apiKey = '5f82816ae5f6e914aea705bf5d99f1d7';

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
    // 'data.list' zawiera prognozę pogody na 5 dni z interwałem co 3 godziny

    // Obliczamy dzień dla pierwszego wpisu
    const firstDate = new Date(data.list[0].dt * 1000); // Timestamp w sekundach
    const currentDay = firstDate.getDate();

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
                temperature: item.main.temp,
                description: item.weather[0].description
            };
        }
    });
    displayDailyForecast(dailyForecast);
    // Wyświetlamy prognozy na stronie
}

function displayDailyForecast(dailyForecast) {
    
}
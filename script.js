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
    const firstDate = new Date(data.list[0].dt * 1000);
    const currentDay = firstDate.getDate();

    const dailyForecast = ["abc","aaa","xyz"];
    // Przetwarzamy dane prognozy
    // data.list.forEach(item => {
    //     const date = new Date(item.dt * 1000);
    //     const day = date.getDate();

    //     // Sprawdzamy, czy już istnieje prognoza dla tego dnia
    //     if (!dailyForecast[day]) {
    //             dailyForecast[day] = {
    //             date: date,
    //             temperature: item.main.temp,
    //             description: item.weather[0].description
    //         };
    //     }
    // });
    dailyForecast.forEach(displayDailyForecast)
    console.log(dailyForecast);
    //displayDailyForecast(dailyForecast);
    // Wyświetlamy prognozy na stronie
}

function displayDailyForecast(day) {
    document.getElementById('section1').innerHTML = "abc";
}
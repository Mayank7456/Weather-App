const apiKey = "3f3038354a507b175a0d24224194aba7";
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const weatherResult = document.getElementById("weather-result");
const cityName = document.getElementById("city-name");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weather-icon");
const errorMessage = document.getElementById("error-message");


function getWeatherData(city) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `https://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                console.log(data);

                if (data.success === false) {
                    reject("Invalid API key or request error.");
                } else {
                    resolve(data);
                }
            } else {
                reject("Error fetching weather data. Please try again.");
            }
        };
        xhr.onerror = () => reject("Network error. Check your internet connection.");
        xhr.send();
    });
}


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    weatherResult.classList.add("hidden");
}


form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (!city) return;

    errorMessage.classList.add("hidden");

    getWeatherData(city)
        .then((data) => {
            if (data.current) {
                cityName.textContent = data.location.name;
                temp.textContent = Math.round(data.current.temperature);
                humidity.textContent = data.current.humidity;
                condition.textContent = data.current.weather_descriptions[0];
                weatherIcon.src = data.current.weather_icons[0];

                weatherResult.classList.remove("hidden");
            } else {
                showError("Unexpected API response. Please try again.");
            }
        })
        .catch((error) => showError(error));
});

const apiKey = "90e0680e27f8a3b20688bd344112120f"; 
// Replace with your OpenWeatherMap API key
        const apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
        const searchBox = document.querySelector(".search input");
        const searchBtn = document.querySelector("#getWeatherBtn");
        const searchGeoBtn = document.querySelector("#getGeoWeatherBtn");
        const weatherIcon = document.querySelector(".weather-icon");
        const errorMessage = document.querySelector(".error .errorMessage");
        const unitSelector = document.getElementById("unitSelector");

        // Function to fetch weather data by city name
        async function getWeatherByCity(city, unit) {
            const response = await fetch(`${apiUrl}q=${city}&units=${unit}&appid=${apiKey}`);
            if (response.status === 404) {
                //errorMessage.style.display = "block";
                document.querySelector(".error").style.display="block";
                document.querySelector(".weather").style.display="none";
                //document.querySelector(".weather").style.display = "none";
            } else {
                const data = await response.json();
                updateWeatherData(data);

            }
        }

        // Function to fetch weather data by geolocation
        async function getWeatherByGeolocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const unit = unitSelector.value;
                    const response = await fetch(`${apiUrl}lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`);
                    if (response.status === 404) {
                        errorMessage.style.display = "block";
                        document.querySelector(".weather").style.display = "none";
                    } else {
                        const data = await response.json();
                        updateWeatherData(data);
                    }
                }, function (error) {
                    console.error(error);
                });
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        }

        // Function to update weather data on the page
        function updateWeatherData(data) {
            errorMessage.style.display = "none";
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°" + unitSelector.options[unitSelector.selectedIndex].text;
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/hr";
            if (data.weather[0].main === "Clouds") {
                weatherIcon.src = "clouds.png";
            } else if (data.weather[0].main === "Clear") {
                weatherIcon.src = "clear.png";
            } else if (data.weather[0].main === "Rain") {
                weatherIcon.src = "rain.png";
            } else if (data.weather[0].main === "Drizzle") {
                weatherIcon.src = "drizzle.png";
            } else if (data.weather[0].main === "Mist") {
                weatherIcon.src = "mist.png";
            }
            document.querySelector(".weather").style.display = "block";
           
            document.querySelector(".error").style.display="none";
        }

        // Event listener for city name search
        searchBtn.addEventListener("click", () => {
            const unit = unitSelector.value;
            getWeatherByCity(searchBox.value, unit);
        });

        // Event listener for geolocation weather
        searchGeoBtn.addEventListener("click", () => {
            getWeatherByGeolocation();
        });

        // Event listener for unit selector change
        unitSelector.addEventListener("change", () => {
            const unit = unitSelector.value;
            if (searchBox.value) {
                getWeatherByCity(searchBox.value, unit);
            }
        });

        // Get the initial weather by geolocation
        getWeatherByGeolocation();
        
    
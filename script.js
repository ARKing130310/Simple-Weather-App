
const cityEl = document.querySelector(".city");
const conditionEl = document.querySelector(".condition-icon");
const conditionE2 = document.querySelector(".condition");
const temperatureEl = document.querySelector(".temperature");
const forecastContainer = document.querySelector(".forecast");
//main js

//City Name
async function getCoordinates(cityName) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`);
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    alert("City not found!");
    return null;
  }
  return {
    lat: data.results[0].latitude,
    lon: data.results[0].longitude,
    name: data.results[0].name
  };
};

// Weather
async function getWeatherByCoordinates(lat, lon, cityName) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m`;
  const res = await fetch(url);
  const data = await res.json();
  console.log("Weather Data:", data);

  // Current values
  const temp = data.current.temperature_2m;
  const feelsLike = data.current.apparent_temperature;
  const humidity = data.current.relative_humidity_2m;
  const windSpeed = data.current.wind_speed_10m;

  // Update DOM
  cityEl.textContent = cityName;
  temperatureEl.textContent = `${Math.round(temp)}°C`;
const temper = parseFloat(temperatureEl.textContent); 
if (temper >= 25) {
  conditionEl.innerHTML = `☀`;
  conditionE2.textContent = `Hot`;
} else if (temper <= 14) {
  conditionEl.innerHTML = `<i class="fa-solid fa-snowflake"></i>`;
  conditionE2.textContent = `Cool`;
} else {
  conditionEl.innerHTML = `☁`;
  conditionE2.textContent = `Normal`;
}
  document.querySelector(".right").innerHTML = `
    <p>💧 Humidity <br><strong>${humidity}%</strong></p><br>
    <p>🌡 Air Pressure <br><strong>-</strong></p><br>
    <p>🌧 Chance of Rain <br><strong>-</strong></p><br>
    <p><i class="fa-solid fa-wind"></i> Wind Speed <br><strong>${windSpeed} km/h</strong></p>`;
  getForecast(data);
};
// current days
const today = new Date();
const options = { weekday: 'long' };
const currentDay = today.toLocaleDateString('en-US', options);
document.querySelector(".day").textContent = currentDay;
function getForecast(data) {
  forecastContainer.innerHTML = "";

  const times = data.hourly.time;
  const temps = data.hourly.temperature_2m;
  const feels = data.hourly.apparent_temperature;

  for (let i = 0; i < 8; i++) {
    const date = new Date(times[i]);
    const hour = date.getHours();
    const temp = Math.round(temps[i]);
    const feel = Math.round(feels[i]);

    const hourDiv = document.createElement("div");
    hourDiv.classList.add("hour");
    hourDiv.innerHTML = `
      <span>${hour}:00</span>
      <strong>${temp}°C</strong>
      <small>Feels like ${feel}°C</small>
    `;
    forecastContainer.appendChild(hourDiv);
  }
};

//Location Button
document.querySelector(".change").addEventListener("click", async () => {
  const newCity = prompt("Enter City Name:");
  if (newCity) {
    const cordinat = await getCoordinates(newCity);
    if (cordinat) {
      getWeatherByCoordinates(cordinat.lat, cordinat.lon, cordinat.name);
    };
  }
});

(async function init() {
  const cordinat = await getCoordinates("Pasrur"); 
  if (cordinat) {
    getWeatherByCoordinates(cordinat.lat, cordinat.lon, cordinat.name);
  }
})();

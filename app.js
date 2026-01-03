// Add click event listener to the "Get Weather" button
document.getElementById("btn").addEventListener("click", async () => {
  // Get the city name from the input field
  const city = document.getElementById("city").value.trim();
  // Get reference to the result display area
  const result = document.getElementById("result");

  // Block requests when no city is provided
  if (!city) {
    result.innerHTML = "<div class='error'>Please enter a city name.</div>";
    return;
  }

  // Show "Loading..." message while fetching data
  result.innerHTML = "<div class='loading'>Loading...</div>";

  // Try to fetch and display weather data
  try {
    // Fetch weather data from wttr.in API in JSON format
    const res = await fetch(`https://wttr.in/${city}?format=j1`);
    // Convert response to JSON object
    const data = await res.json();
    
    // Extract current weather conditions from the API response
    const current = data.current_condition[0];
    // Get temperature in Celsius
    const temp = current.temp_C;
    // Get wind speed in km/h
    const windKmh = current.windspeedKmph;
    // Convert wind speed from km/h to m/s (divide by 3.6) and round to 1 decimal
    const windMs = (windKmh / 3.6).toFixed(1); // Convert km/h to m/s
    // Get humidity percentage
    const humidity = current.humidity;
    // Get atmospheric pressure in millibars
    const pressure = current.pressure;
    // Get weather condition description (e.g., "Sunny", "Rainy")
    const condition = current.weatherDesc[0].value;
    // Get "feels like" temperature in Celsius
    const feelsLike = current.FeelsLikeC;
    
    // Build and display the formatted weather card with all data
    result.innerHTML = `
      <div class="weather-card">
        <!-- Display city name as heading -->
        <h2 class="city-name">${city}</h2>
        <!-- Display weather condition description -->
        <div class="condition">${condition}</div>
        <!-- Grid layout for weather data items -->
        <div class="weather-grid">
          <!-- Temperature item -->
          <div class="weather-item">
            <span class="label">Temperature</span>
            <span class="value">${temp}°C</span>
          </div>
          <!-- Feels like temperature item -->
          <div class="weather-item">
            <span class="label">Feels Like</span>
            <span class="value">${feelsLike}°C</span>
          </div>
          <!-- Wind speed item (displays in m/s with km/h as secondary value) -->
          <div class="weather-item">
            <span class="label">Wind Speed</span>
            <span class="value">${windMs} m/s</span>
            <span class="sub-value">(${windKmh} km/h)</span>
          </div>
          <!-- Humidity item -->
          <div class="weather-item">
            <span class="label">Humidity</span>
            <span class="value">${humidity}%</span>
          </div>
          <!-- Pressure item -->
          <div class="weather-item">
            <span class="label">Pressure</span>
            <span class="value">${pressure} mb</span>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    // If API call fails or city is invalid, show error message
    result.innerHTML = `<div class='error'>Error fetching weather. Please check the city name.</div>`;
  }
});

/*
User
  |
  | clicks "Get Weather" with city input
  v
Browser (app.js)
  |
  | HTTP GET https://wttr.in/{city}?format=j1
  v
wttr.in API
  |
  | JSON response (current_condition[0] fields)
  v
Browser renders weather card into #result
*/

/*
(file changes)
   +--------------------------+
   |        Developer         |
   +--------------------------+
               |
               v
        +--------------+
        | Live Server  |
        | (HTTP + WS)  |
        +--------------+
           |        ^
  serves   |        | file-change notice
  files    |        | via WebSocket (/ws)
           v        |
   +-------------------------+
   |      Browser Tab        |
   |  http://127.0.0.1:5500  |
   +-------------------------+
           |
           | user clicks "Get Weather"
           v
   +-------------------------+
   |  Weather App (app.js)   |
   +-------------------------+
           |
           | fetch https://wttr.in/{city}?format=j1
           v
     +---------------+
     |  wttr.in API  |
     +---------------+
*/

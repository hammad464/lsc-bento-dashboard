import { useState } from 'react';
import type { TemperatureUnit, WeatherData } from '../types';

const weatherData: WeatherData = {
  city: 'Lahore',
  country: 'Pakistan',
  tempCelsius: 28,
  feelsLikeCelsius: 29,
  condition: 'Sunny',
};

const celsiusToFahrenheit = (celsius: number) => Math.round((celsius * 9) / 5 + 32);

const WeatherTile = () => {
  const [unit, setUnit] = useState<TemperatureUnit>('C');

  const displayTemp =
    unit === 'C' ? weatherData.tempCelsius : celsiusToFahrenheit(weatherData.tempCelsius);
  const displayFeelsLike =
    unit === 'C'
      ? weatherData.feelsLikeCelsius
      : celsiusToFahrenheit(weatherData.feelsLikeCelsius);

  return (
    <div className="tile weather-tile">
      <div className="weather-top">
        <div>
          <h3>Weather</h3>
          <p className="weather-location">
            {weatherData.city}, {weatherData.country}
          </p>
        </div>
        <svg viewBox="0 0 40 40" className="weather-sun" aria-hidden="true">
          <circle cx="20" cy="20" r="8" className="sun-core" />
          <g className="sun-rays">
            <line x1="20" y1="2" x2="20" y2="7" />
            <line x1="20" y1="33" x2="20" y2="38" />
            <line x1="2" y1="20" x2="7" y2="20" />
            <line x1="33" y1="20" x2="38" y2="20" />
            <line x1="7" y1="7" x2="10.5" y2="10.5" />
            <line x1="29.5" y1="29.5" x2="33" y2="33" />
            <line x1="7" y1="33" x2="10.5" y2="29.5" />
            <line x1="29.5" y1="10.5" x2="33" y2="7" />
          </g>
        </svg>
      </div>

      <div className="weather-main">
        <span className="weather-temp">{displayTemp}°</span>
        <span className="weather-unit-label">{unit}</span>
      </div>

      <p className="weather-condition">
        {weatherData.condition} · Feels like {displayFeelsLike}°
      </p>

      <div className="unit-toggle">
        <button
          className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
          onClick={() => setUnit('C')}
        >
          °C
        </button>
        <button
          className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
          onClick={() => setUnit('F')}
        >
          °F
        </button>
      </div>
    </div>
  );
};

export default WeatherTile;
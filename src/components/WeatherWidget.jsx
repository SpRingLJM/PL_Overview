import { useState, useEffect } from 'react';
import { getWeather } from '../services/api';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiFog, WiThunderstorm } from 'react-icons/wi';
import './WeatherWidget.css';

const weatherIcons = {
  Clear: WiDaySunny,
  Clouds: WiCloudy,
  Rain: WiRain,
  Drizzle: WiRain,
  Snow: WiSnow,
  Fog: WiFog,
  Mist: WiFog,
  Haze: WiFog,
  Thunderstorm: WiThunderstorm,
};

export default function WeatherWidget({ lat, lon, stadiumName }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;
    getWeather(lat, lon).then(setWeather).catch(console.error);
  }, [lat, lon]);

  if (!weather || weather.cod !== 200) return null;

  const IconComponent = weatherIcons[weather.weather[0].main] || WiCloudy;

  return (
    <div className="weather-widget">
      <IconComponent className="weather-icon" />
      <div className="weather-info">
        <span className="weather-temp">{Math.round(weather.main.temp)}°C</span>
        <span className="weather-desc">{weather.weather[0].description}</span>
        <span className="weather-detail">
          Humidity {weather.main.humidity}% | Wind {weather.wind.speed}m/s
        </span>
      </div>
      <span className="weather-location">{stadiumName}</span>
    </div>
  );
}

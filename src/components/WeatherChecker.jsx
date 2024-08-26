import React, { useState, useEffect } from "react";
import axios from "axios";
import sun from "../assets/sun.png";
import partlyCloudy from "../assets/partly-cloudy.png";
import cloudy from "../assets/cloudy.png";
import rain from "../assets/rain.png";
import hardStorm from "../assets/hard-storm.png";
import snow from "../assets/snow.png";
import "./WeatherChecker.css";
import { FaSearch, FaTimes } from "react-icons/fa";

const WeatherChecker = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  const apiKey = "4b8c3d31872ee25325bebae39bff932c";

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        setError("Unable to retrieve your location. Please search for a city.");
      }
    );
  }, []);

  const fetchWeather = async (cityName) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setError("");
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setCity(response.data.name);
      setError("");
      addFavorite(response.data.name);
    } catch (err) {
      setError("Unable to fetch weather data. Please try again.");
      setWeather(null);
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = () => {
    fetchWeather(city);
  };

  const addFavorite = (cityName) => {
    if (cityName && !favorites.includes(cityName)) {
      const updatedFavorites = [...favorites, cityName];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const handleAddFavorite = () => {
    addFavorite(city);
  };

  const handleFavoriteClick = (favorite) => {
    fetchWeather(favorite);
  };

  const handleRemoveFavorite = (favorite) => {
    const updatedFavorites = favorites.filter((item) => item !== favorite);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getWeatherImage = (icon) => {
    switch (icon) {
      case "01d":
      case "01n":
        return sun;
      case "02d":
      case "02n":
        return partlyCloudy;
      case "03d":
      case "03n":
        return cloudy;
      case "04d":
      case "04n":
        return partlyCloudy;
      case "09d":
      case "09n":
      case "10d":
      case "10n":
        return rain;
      case "11d":
      case "11n":
        return hardStorm;
      case "13d":
      case "13n":
        return snow;
      case "50d":
      case "50n":
        return rain;
      default:
        return sun;
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-background"></div>
      <div className="weather-content">
        <h1 className="title">HunT Weather</h1>
        <div className="favorites">
          <ul className="ul-main">
            {favorites.map((favorite, index) => (
              <li key={index} className="favorite-item">
                <span onClick={() => handleFavoriteClick(favorite)}>
                  {favorite}
                </span>
                <FaTimes
                  className="remove-icon"
                  onClick={() => handleRemoveFavorite(favorite)}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a city..."
            value={city}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
        </div>

        {error && <p className="error-message">{error}</p>}

        {weather && (
          <div className="weather-info">
            <h1>{weather.name}</h1>
            <div className="weather-details">
              <img
                src={getWeatherImage(weather.weather[0].icon)}
                alt="weather icon"
              />
              <span>{weather.main.temp}°C</span>
            </div>
            <div className="additional-info">
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Feels Like: {weather.main.feels_like}°C</p>
              <p>Wind Speed: {weather.wind.speed} m/s</p>
            </div>
            <button onClick={handleAddFavorite} className="favourite-btn">
              Add to Favorites
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherChecker;

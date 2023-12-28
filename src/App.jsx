import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { gsap } from 'gsap';

function App() {
  const [data, setData] = useState({});

  const [inputValue, setInputValue] = useState('');

  const [background, setBackground] = useState('');

  const [validation, setValidation] = useState('');
  
  const containerRef = useRef(null);

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  // Function to handle input change, every time it changes, update state
  const handleInputChange = (event) => {
    setInputValue(capitalizeFirstLetter(event.target.value));
  }

  // Function to fetch weather data, async function, try catch block, if successful, set data, if not, console log error and set validation
  const getWeather = async () => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=75e30485004b377cb56aa79afd3e3336&units=metric`;
      const response = await axios.get(url);
      setData(response.data);
      const weather = response.data.weather[0].main;
      setBackground(getBackgroundImage(weather));
      gsap.from(containerRef.current,{ y: 100, duration: 1 });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setValidation('Please, check city name');
    }
  };

  // Function to get background image based on weather, creats an object, then checks if the weather is in the object, if it is, return the image, if not, return empty string
  const getBackgroundImage = (weather) => {
    const images = {
      Rain: 'url(https://images.pexels.com/photos/304875/pexels-photo-304875.jpeg?cs=srgb&dl=pexels-veeterzy-304875.jpg&fm=jpg)',
      Clouds: 'url(https://img.freepik.com/premium-photo/sky-with-white-clouds-background-black-white-picture-tone_43429-2172.jpg?size=626&ext=jpg&ga=GA1.1.612463877.1696753175&semt=ais)',
      Clear: 'url(https://cdn.pixabay.com/photo/2022/04/28/04/12/sun-7161716_640.jpg)',
      Thunderstorm: 'url(https://img.freepik.com/free-photo/weather-effects-composition_23-2149853311.jpg?size=626&ext=jpg&ga=GA1.1.612463877.1696753175&semt=ais)',
      Snow: 'url(https://img.freepik.com/free-photo/snowy-landscape-with-trees_1048-3731.jpg?size=626&ext=jpg&ga=GA1.1.612463877.1696753175&semt=ais)',
      Fog: 'url(https://img.freepik.com/free-photo/forest-landscape-with-dense-fog_181624-811.jpg?size=626&ext=jpg&ga=GA1.1.612463877.1696753175&semt=ais)',
      Mist: 'url(https://img.freepik.com/free-photo/forest-landscape-with-dense-fog_181624-811.jpg?size=626&ext=jpg&ga=GA1.1.612463877.1696753175&semt=ais)'
    };
    return images[weather] || '';
  }

  // Function to handle search
  const handleSearch = () => {
    if (inputValue === '') {
      setValidation('Please, add a city');
    } else {
      setValidation('');
      getWeather();
      setInputValue('');
    }
  }

  // Function to handle key down event
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className="app" style={{ backgroundImage: background }}>
      <div className="title">
        <h1>Weather App</h1>
      </div>
      <div className='header'>
        <input type="text" 
          placeholder='Search City'
          className='search' 
          value={inputValue} // Bind input value to state
          onChange={handleInputChange} // Update state on input change
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="validation">
        {validation}
      </div>
      <div className="btn-main">
        <button className='btn' onClick={handleSearch}>Search</button>
      </div>
      <div className="container" ref={containerRef}>
        <div className='data'>{data.name}</div>
        <div className='data'> {data.main?.temp ? `${Math.round(data.main.temp)}°C` : ''}</div>
        <div className="data">{data.weather?.[0]?.main}</div>
      </div>
    </div>
  )
}

export default App
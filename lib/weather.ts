export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
  };
  location: string;
}

export async function getCityName(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await res.json();
    return data.city || data.locality || "Unknown Location";
  } catch (e) {
    console.error("Failed to fetch city name:", e);
    return "Unknown Location";
  }
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  
  const [weatherRes, location] = await Promise.all([
    fetch(url),
    getCityName(lat, lon)
  ]);

  if (!weatherRes.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await weatherRes.json();

  return {
    current: {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
    },
    daily: {
      time: data.daily.time,
      weatherCode: data.daily.weather_code,
      temperatureMax: data.daily.temperature_2m_max,
      temperatureMin: data.daily.temperature_2m_min,
    },
    location
  };
}

export function getWeatherCondition(code: number): { label: string, icon: string } {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return { label: 'Clear sky', icon: 'sun' };
  if (code === 1 || code === 2 || code === 3) return { label: 'Partly cloudy', icon: 'cloud-sun' };
  if (code === 45 || code === 48) return { label: 'Fog', icon: 'cloud-fog' };
  if (code >= 51 && code <= 55) return { label: 'Drizzle', icon: 'cloud-drizzle' };
  if (code >= 61 && code <= 65) return { label: 'Rain', icon: 'cloud-rain' };
  if (code >= 71 && code <= 77) return { label: 'Snow', icon: 'cloud-snow' };
  if (code >= 80 && code <= 82) return { label: 'Showers', icon: 'cloud-rain' };
  if (code >= 95 && code <= 99) return { label: 'Thunderstorm', icon: 'cloud-lightning' };
  
  return { label: 'Unknown', icon: 'cloud' };
}

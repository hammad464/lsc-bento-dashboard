import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────
export interface WeatherState {
  city: string;
  tempC: number;
  condition: string;   // 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Stormy'
  humidity: string;    // e.g. "64%"
  wind: string;        // e.g. "12 km/h"
  isDay: boolean;
  loading: boolean;
  error: string | null;
}

// ─── WMO Weather Code → Human Condition ──────────────────────────────
// Full spec: https://www.noaa.gov/weather/wmo-code-tables
const mapWeatherCode = (code: number, isDay: boolean): string => {
  if (code <= 1) return isDay ? 'Sunny' : 'Clear';           // Clear sky, mainly clear
  if (code <= 3) return 'Cloudy';          // Partly cloudy, overcast
  if (code <= 48) return 'Cloudy';         // Fog / depositing rime fog
  if (code <= 57) return 'Rainy';          // Drizzle (light → dense)
  if (code <= 67) return 'Rainy';          // Rain / freezing rain
  if (code <= 77) return 'Snowy';          // Snow fall (slight → heavy)
  if (code <= 82) return 'Rainy';          // Rain showers
  if (code <= 86) return 'Snowy';          // Snow showers
  if (code <= 99) return 'Stormy';         // Thunderstorm
  return isDay ? 'Sunny' : 'Clear';                          // Fallback
};

// ─── Default fallback coordinates (San Francisco) ────────────────────
const DEFAULT_LAT = 37.7749;
const DEFAULT_LON = -122.4194;
const DEFAULT_CITY = 'San Francisco';

// ─── Refresh interval (15 minutes) ──────────────────────────────────
const REFRESH_MS = 15 * 60 * 1000;

// ─── Reverse-geocode lat/lon → city name via Open-Meteo ─────────────
const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    // Open-Meteo doesn't have a reverse geocoder, so we use a forward search
    // with a small bounding box trick. Instead, we'll use the Nominatim API
    // which is free and doesn't require a key.
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`
    );
    if (!res.ok) return DEFAULT_CITY;
    const data = await res.json();
    // Try city → town → village → county as fallback chain
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      DEFAULT_CITY
    );
  } catch {
    return DEFAULT_CITY;
  }
};

// ─── Get user's coordinates via browser geolocation ──────────────────
const getUserCoords = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        // User denied or error → fall back to default
        resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
      },
      { timeout: 8000, maximumAge: 300000 } // 8s timeout, cache for 5 min
    );
  });
};

// ─── The Hook ────────────────────────────────────────────────────────
const useWeather = (): WeatherState => {
  const initialIsDay = new Date().getHours() >= 6 && new Date().getHours() < 18;

  const [state, setState] = useState<WeatherState>({
    city: DEFAULT_CITY,
    tempC: 18,
    condition: initialIsDay ? 'Sunny' : 'Clear',
    humidity: '—',
    wind: '—',
    isDay: initialIsDay,
    loading: true,
    error: null,
  });

  const fetchWeather = useCallback(async () => {
    try {
      // 1. Get coordinates
      const { lat, lon } = await getUserCoords();

      // 2. Fetch weather from Open-Meteo
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day`
      );

      if (!weatherRes.ok) {
        throw new Error(`Weather API returned ${weatherRes.status}`);
      }

      const weatherData = await weatherRes.json();
      const current = weatherData.current;

      // 3. Reverse-geocode to city name
      const city = await reverseGeocode(lat, lon);

      const isDayAPI = current.is_day === 1;

      // 4. Map API data → our state shape
      setState({
        city,
        tempC: Math.round(current.temperature_2m),
        condition: mapWeatherCode(current.weather_code, isDayAPI),
        humidity: `${current.relative_humidity_2m}%`,
        wind: `${Math.round(current.wind_speed_10m)} km/h`,
        isDay: isDayAPI,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch weather',
      }));
    }
  }, []);

  useEffect(() => {
    // Fetch immediately on mount
    fetchWeather();

    // Auto-refresh every 15 minutes
    const interval = setInterval(fetchWeather, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return state;
};

export default useWeather;

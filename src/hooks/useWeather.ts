import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────
export interface CitySearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherState {
  city: string;
  tempC: number;
  condition: string;   // 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Stormy'
  humidity: string;    // e.g. "64%"
  wind: string;        // e.g. "12 km/h"
  isDay: boolean;
  loading: boolean;
  error: string | null;
  selectCity: (cityName: string, lat: number, lon: number) => void;
  searchCity: (query: string) => Promise<CitySearchResult[]>;
  resetToLocation: () => void;
}

// ─── WMO Weather Code → Human Condition ──────────────────────────────
const mapWeatherCode = (code: number, isDay: boolean): string => {
  if (code <= 1) return isDay ? 'Sunny' : 'Clear';
  if (code <= 3) return 'Cloudy';
  if (code <= 48) return 'Cloudy';
  if (code <= 57) return 'Rainy';
  if (code <= 67) return 'Rainy';
  if (code <= 77) return 'Snowy';
  if (code <= 82) return 'Rainy';
  if (code <= 86) return 'Snowy';
  if (code <= 99) return 'Stormy';
  return isDay ? 'Sunny' : 'Clear';
};

// ─── Default fallback coordinates (Lahore) ────────────────────────────
const DEFAULT_LAT = 31.5204;
const DEFAULT_LON = 74.3587;
const DEFAULT_CITY = 'Lahore';

const STORAGE_KEY = 'lsc_dashboard_weather_loc';

// ─── Refresh interval (15 minutes) ──────────────────────────────────
const REFRESH_MS = 15 * 60 * 1000;

// ─── Reverse-geocode lat/lon → city name via BigDataCloud API ─────────
const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (!res.ok) return DEFAULT_CITY;
    const data = await res.json();
    return (
      data.city ||
      data.locality ||
      data.principalSubdivision ||
      data.countryName ||
      DEFAULT_CITY
    );
  } catch {
    return DEFAULT_CITY;
  }
};

// ─── Get user's coordinates via Browser Geolocation / IP Geolocation Fallback ──
const getUserCoords = (): Promise<{ lat: number; lon: number; city?: string }> => {
  return new Promise((resolve) => {
    // Check localStorage first
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lat && parsed.lon && parsed.city) {
          resolve(parsed);
          return;
        }
      } catch {
        // ignore
      }
    }

    const fetchIpLocation = () => {
      fetch('https://api.bigdatacloud.net/data/reverse-geocode-client')
        .then((res) => res.json())
        .then((data) => {
          if (data.latitude && data.longitude) {
            resolve({
              lat: data.latitude,
              lon: data.longitude,
              city: data.city || data.locality || data.principalSubdivision || DEFAULT_CITY,
            });
          } else {
            resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON, city: DEFAULT_CITY });
          }
        })
        .catch(() => resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON, city: DEFAULT_CITY }));
    };

    if (!navigator.geolocation) {
      fetchIpLocation();
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
        fetchIpLocation();
      },
      { timeout: 5000, maximumAge: 300000 }
    );
  });
};

// ─── The Hook ────────────────────────────────────────────────────────
const useWeather = (): WeatherState => {
  const initialIsDay = new Date().getHours() >= 6 && new Date().getHours() < 18;

  const [customLoc, setCustomLoc] = useState<{ lat: number; lon: number; city: string } | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [state, setState] = useState<Omit<WeatherState, 'selectCity' | 'searchCity' | 'resetToLocation'>>({
    city: customLoc?.city || DEFAULT_CITY,
    tempC: 28,
    condition: initialIsDay ? 'Sunny' : 'Clear',
    humidity: '64%',
    wind: '12 km/h',
    isDay: initialIsDay,
    loading: true,
    error: null,
  });

  const fetchWeatherData = useCallback(async (lat: number, lon: number, cityName?: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day`
      );

      if (!weatherRes.ok) {
        throw new Error(`Weather API returned ${weatherRes.status}`);
      }

      const weatherData = await weatherRes.json();
      const current = weatherData.current;

      const finalCity = cityName || (await reverseGeocode(lat, lon));
      const isDayAPI = current.is_day === 1;

      setState({
        city: finalCity,
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

  const fetchWeather = useCallback(async () => {
    if (customLoc) {
      fetchWeatherData(customLoc.lat, customLoc.lon, customLoc.city);
    } else {
      const location = await getUserCoords();
      fetchWeatherData(location.lat, location.lon, location.city);
    }
  }, [customLoc, fetchWeatherData]);

  const selectCity = useCallback((cityName: string, lat: number, lon: number) => {
    const locData = { city: cityName, lat, lon };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locData));
    setCustomLoc(locData);
    fetchWeatherData(lat, lon, cityName);
  }, [fetchWeatherData]);

  const resetToLocation = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCustomLoc(null);
    getUserCoords().then((location) => {
      fetchWeatherData(location.lat, location.lon, location.city);
    });
  }, [fetchWeatherData]);

  const searchCity = useCallback(async (query: string): Promise<CitySearchResult[]> => {
    if (!query.trim()) return [];
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=5&language=en`
      );
      if (!res.ok) return [];
      const data = await res.json();
      if (!data.results) return [];
      return data.results.map((item: { name: string; country?: string; latitude: number; longitude: number }) => ({
        name: item.name,
        country: item.country || '',
        lat: item.latitude,
        lon: item.longitude,
      }));
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return {
    ...state,
    selectCity,
    searchCity,
    resetToLocation,
  };
};

export default useWeather;

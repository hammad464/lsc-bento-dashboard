import { useState } from 'react';
import { CloudRain, Sun, Cloud, Snowflake, Droplets, Wind, CloudLightning, Loader2, Moon } from 'lucide-react';
import useWeather from '../hooks/useWeather';

const WeatherTile = () => {
  const [isCelsius, setIsCelsius] = useState(true);

  // ─── Live weather data from Open-Meteo API ─────────────────────────
  const { city, tempC, condition, humidity, wind, isDay, loading, error } = useWeather();

  const tempF = Math.round((tempC * 9) / 5 + 32);
  const displayTemp = isCelsius ? tempC : tempF;

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun size={36} className="text-amber-500" />;
      case 'clear': return <Moon size={36} className="text-blue-100" />;
      case 'rainy': return <CloudRain size={36} className="text-blue-500 dark:text-[#B6F500]" />;
      case 'cloudy': return <Cloud size={36} className="text-gray-400" />;
      case 'snowy': return <Snowflake size={36} className="text-blue-300 dark:text-[#B6F500]" />;
      case 'stormy': return <CloudLightning size={36} className="text-purple-500 dark:text-[#B6F500]" />;
      default: return condition.toLowerCase() === 'clear' ? <Moon size={36} className="text-blue-100" /> : <Sun size={36} className="text-amber-500" />;
    }
  };

  return (
    <div className="md:col-span-2 row-span-1 h-[160px] rounded-[2rem] p-6 flex flex-col justify-center shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
      
      {/* ========================================= */}
      {/* ☀️ DAY BACKGROUND (Shows if isDay is true) */}
      {/* ========================================= */}
      <div className={`absolute inset-0 transition-opacity duration-1000 bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] ${isDay ? 'opacity-100' : 'opacity-0'}`}>
        {/* Sun Graphic */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-40 h-40">
          {/* Sun Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div 
              key={deg} 
              className="absolute left-1/2 top-1/2 w-1.5 h-5 bg-yellow-400 rounded-full"
              style={{ transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-32px)` }} 
            />
          ))}
          {/* Sun Core */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-[0_4px_20px_rgba(251,191,36,0.5)]" />
        </div>
        
        {/* Fluffy Clouds */}
        <div className="absolute top-6 right-48 w-16 h-5 bg-white rounded-full opacity-90 shadow-sm">
          <div className="absolute -top-2 left-2 w-6 h-6 bg-white rounded-full" />
          <div className="absolute -top-4 right-2 w-8 h-8 bg-white rounded-full" />
        </div>
        <div className="absolute bottom-4 right-32 w-24 h-7 bg-white rounded-full opacity-95 shadow-sm">
          <div className="absolute -top-3 left-3 w-8 h-8 bg-white rounded-full" />
          <div className="absolute -top-5 right-3 w-12 h-12 bg-white rounded-full" />
        </div>
      </div>

      {/* =========================================== */}
      {/* 🌙 NIGHT BACKGROUND (Shows if isDay is false) */}
      {/* =========================================== */}
      <div className={`absolute inset-0 transition-opacity duration-1000 bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] ${!isDay ? 'opacity-100' : 'opacity-0'}`}>
        {/* Crescent Moon */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-[-12px_12px_0_0_#fde047] rotate-[-20deg]" />
        
        {/* Twinkling Stars */}
        <div className="absolute top-6 right-48 w-1 h-1 bg-white rounded-full shadow-[0_0_4px_white] animate-pulse" />
        <div className="absolute top-20 right-40 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_white] animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-10 right-24 w-1 h-1 bg-white rounded-full shadow-[0_0_4px_white] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-10 right-16 w-2 h-2 bg-white rounded-full shadow-[0_0_6px_white] animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {/* Dark Fluffy Clouds */}
        <div className="absolute bottom-4 right-32 w-24 h-7 bg-white/10 rounded-full backdrop-blur-sm">
          <div className="absolute -top-3 left-3 w-8 h-8 bg-white/10 rounded-full" />
          <div className="absolute -top-5 right-3 w-12 h-12 bg-white/10 rounded-full" />
        </div>
      </div>
      {/* ========================================= */}


      {/* FRONT CONTENT (Relative Z-10 ensures it stays above the backgrounds) */}
      <div className="relative z-10 flex flex-row items-center justify-between h-full">

        {/* ─── Loading Skeleton Overlay ─────────────────────────────── */}
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[2rem] backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Loader2 size={24} className={`animate-spin ${isDay ? 'text-slate-600' : 'text-slate-300'}`} />
              <span className={`text-sm font-medium ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                Fetching weather…
              </span>
            </div>
          </div>
        )}

        {/* ─── Error Banner (subtle, non-blocking) ─────────────────── */}
        {error && !loading && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full text-[10px] font-medium bg-red-500/20 text-red-600 dark:text-red-300 backdrop-blur-sm">
            Offline — showing last data
          </div>
        )}

        <div className="flex flex-col items-start justify-between h-full">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl backdrop-blur-md ${isDay ? 'bg-white/50 text-gray-800' : 'bg-white/10 text-white'}`}>
              {getWeatherIcon(condition)}
            </div>
            <div>
              <h3 className={`text-lg font-bold tracking-tight ${isDay ? 'text-slate-800' : 'text-white'}`}>
                Weather
              </h3>
              <p className={`text-xs font-medium ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                {city}
              </p>
            </div>
          </div>
          
          <div className="flex bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-full p-1 border border-white/50 dark:border-white/10">
            <button
              onClick={() => setIsCelsius(true)}
              className={`px-4 py-1 text-xs font-bold rounded-full transition-all ${isCelsius ? 'bg-blue-500 dark:bg-[#B6F500] text-white dark:text-gray-900 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
            >
              °C
            </button>
            <button
              onClick={() => setIsCelsius(false)}
              className={`px-4 py-1 text-xs font-bold rounded-full transition-all ${!isCelsius ? 'bg-blue-500 dark:bg-[#B6F500] text-white dark:text-gray-900 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
            >
              °F
            </button>
          </div>
        </div>
        
        {/* Center: Temperature */}
        <div className="flex flex-col items-start justify-center h-full ml-8 md:ml-12">
          <div className="flex items-start">
            <span className={`text-6xl font-extrabold tracking-tighter tabular-nums ${isDay ? 'text-slate-800' : 'text-white'}`}>
              {displayTemp}
            </span>
            <span className={`text-2xl font-bold mt-2 ml-1 ${isDay ? 'text-slate-800' : 'text-white'}`}>
              °
            </span>
          </div>
          <p className={`font-semibold text-sm mt-1 ${isDay ? 'text-slate-700' : 'text-slate-200'}`}>
            {condition}
          </p>
        </div>

        {/* Right side: Wind/Humidity stats with glassmorphism to let the art peek through */}
        <div className="flex flex-col gap-3 pl-8 py-2 ml-auto z-10">
          <div className={`flex items-center space-x-3 px-3 py-2 rounded-xl backdrop-blur-md ${isDay ? 'bg-white/30 text-slate-700' : 'bg-black/20 text-slate-200'}`}>
            <Droplets size={16} className={isDay ? "text-blue-500" : "text-[#B6F500]"} />
            <span className="text-xs font-semibold">{humidity}</span>
          </div>
          <div className={`flex items-center space-x-3 px-3 py-2 rounded-xl backdrop-blur-md ${isDay ? 'bg-white/30 text-slate-700' : 'bg-black/20 text-slate-200'}`}>
            <Wind size={16} className={isDay ? "text-slate-600" : "text-slate-300"} />
            <span className="text-xs font-semibold">{wind}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherTile;
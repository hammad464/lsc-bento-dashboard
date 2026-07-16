import { useState } from 'react';
import { CloudRain, Sun, Cloud, Snowflake } from 'lucide-react';

const WeatherTile = () => {
  const [isCelsius, setIsCelsius] = useState(true);

  // Hardcoded static data for the weather initially
  const weatherData = {
    city: 'San Francisco',
    tempC: 18,
    condition: 'Rainy'
  };

  const tempF = Math.round((weatherData.tempC * 9) / 5 + 32);
  const displayTemp = isCelsius ? weatherData.tempC : tempF;
  const unit = isCelsius ? '°C' : '°F';

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun size={48} className="text-yellow-400" />;
      case 'rainy': return <CloudRain size={48} className="text-blue-400" />;
      case 'cloudy': return <Cloud size={48} className="text-gray-400" />;
      case 'snowy': return <Snowflake size={48} className="text-blue-200" />;
      default: return <Sun size={48} className="text-yellow-400" />;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 rounded-3xl shadow-sm border border-blue-100 dark:border-gray-700 col-span-1 row-span-1 flex flex-col justify-between h-full relative overflow-hidden">
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {weatherData.city}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {weatherData.condition}
          </p>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-2xl backdrop-blur-sm">
          {getWeatherIcon(weatherData.condition)}
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-6 z-10">
        <div className="text-5xl font-bold text-gray-900 dark:text-white tracking-tighter">
          {displayTemp}<span className="text-3xl text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
        </div>
        
        <button
          onClick={() => setIsCelsius(!isCelsius)}
          className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm transition-colors border border-gray-100 dark:border-gray-600"
        >
          Switch to {isCelsius ? '°F' : '°C'}
        </button>
      </div>

      {/* Decorative background shapes */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
};

export default WeatherTile;

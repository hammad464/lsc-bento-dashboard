import { useState } from 'react';
import { CloudRain, Sun, Cloud, Snowflake, Droplets, Wind } from 'lucide-react';

const WeatherTile = () => {
  const [isCelsius, setIsCelsius] = useState(true);

  // Hardcoded static data for the weather initially
  const weatherData = {
    city: 'San Francisco',
    tempC: 18,
    condition: 'Rainy',
    humidity: '64%',
    wind: '12 km/h'
  };

  const tempF = Math.round((weatherData.tempC * 9) / 5 + 32);
  const displayTemp = isCelsius ? weatherData.tempC : tempF;
  const unit = isCelsius ? '°C' : '°F';

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun size={48} className="text-amber-500 drop-shadow-md" />;
      case 'rainy': return <CloudRain size={48} className="text-blue-500 dark:text-[#B6F500] drop-shadow-md" />;
      case 'cloudy': return <Cloud size={48} className="text-gray-400 drop-shadow-md" />;
      case 'snowy': return <Snowflake size={48} className="text-blue-300 dark:text-[#B6F500] drop-shadow-md" />;
      default: return <Sun size={48} className="text-amber-500 drop-shadow-md" />;
    }
  };

  return (
    <div className="md:col-span-2 row-span-1 h-[160px] rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center shadow-sm hover:shadow-lg transition-all duration-300 relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-[#B6F500]/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-row items-center justify-between h-full">
        <div className="flex flex-col items-start justify-between h-full">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
              {weatherData.city}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-1">
              {weatherData.condition}
            </p>
          </div>
          <button
            onClick={() => setIsCelsius(!isCelsius)}
            className="px-3 py-1.5 mt-auto bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 transition-all backdrop-blur-sm border border-gray-200 dark:border-gray-700"
          >
            {isCelsius ? '°F' : '°C'}
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="transform group-hover:scale-110 transition-transform duration-500">
            {getWeatherIcon(weatherData.condition)}
          </div>
          <div className="flex items-start">
            <span className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tighter tabular-nums">
              {displayTemp}
            </span>
            <span className="text-xl font-bold text-gray-400 dark:text-gray-500 mt-1 ml-1">
              {unit}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-l border-gray-100 dark:border-gray-800 pl-6 py-2">
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <div className="p-2 bg-blue-50 dark:bg-[#B6F500]/20 rounded-lg shrink-0">
              <Droplets size={18} className="text-blue-500 dark:text-[#B6F500]" />
            </div>
            <span className="text-sm font-semibold">{weatherData.humidity} Humidity</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg shrink-0">
              <Wind size={18} className="text-gray-500" />
            </div>
            <span className="text-sm font-semibold">{weatherData.wind} Wind</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherTile;

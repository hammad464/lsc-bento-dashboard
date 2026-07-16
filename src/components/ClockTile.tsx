import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const ClockTile = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 col-span-1 md:col-span-2 row-span-1">
      <div className="flex items-center space-x-2 text-indigo-500 mb-2">
        <Clock size={24} />
      </div>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 font-mono">
        {formattedTime}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
        {formattedDate}
      </p>
    </div>
  );
};

export default ClockTile;
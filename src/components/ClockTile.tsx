import { useEffect, useState } from 'react';

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
    minute: '2-digit'
  });
  
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="md:col-span-1 row-span-1 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-[#B6F500]/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col h-full justify-center items-start">
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter tabular-nums">
            {formattedTime}
          </span>
          <span className="text-lg md:text-xl font-bold text-blue-500 dark:text-[#B6F500] tabular-nums">
            {seconds}
          </span>
        </div>
        <div className="mt-4 text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-[#B6F500] animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)] dark:shadow-[0_0_8px_rgba(182,245,0,0.6)] shrink-0" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ClockTile;
import { useEffect, useState } from 'react';

const ClockTile = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bento-clock-format');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      console.error('Failed to parse clock format from localStorage', e);
      return true;
    }
  });

  useEffect(() => {
    localStorage.setItem('bento-clock-format', JSON.stringify(is24Hour));
  }, [is24Hour]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTimeStr = time.toLocaleTimeString('en-US', {
    hour12: !is24Hour,
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const [timeStr, ampm] = formattedTimeStr.split(' ');
  
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="md:col-span-1 row-span-1 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-[#B6F500]/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <button
        onClick={() => setIs24Hour(!is24Hour)}
        className="absolute top-5 right-5 z-20 text-[10px] font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        {is24Hour ? '24H' : '12H'}
      </button>

      <div className="relative z-10 flex flex-col h-full justify-center items-start">
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter tabular-nums">
            {timeStr}
          </span>
          <span className="text-lg md:text-xl font-bold text-blue-500 dark:text-[#B6F500] tabular-nums">
            {seconds}
          </span>
          {ampm && (
            <span className="text-sm font-bold text-gray-400 dark:text-gray-500 ml-1">
              {ampm}
            </span>
          )}
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
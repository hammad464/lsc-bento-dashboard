import React, { useState, useEffect } from 'react';

export const ClockTile: React.FC = () => {
  // Requirement: Use core framework state primitives
  const [time, setTime] = useState(new Date());

  // Requirement: Handle side effects for setting up and tearing down the clock interval
  useEffect(() => {
    // Dynamic Update: Update every single second
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Crucial Concept: Clear the interval when the component unmounts
    return () => {
      clearInterval(timerId);
    };
  }, []); // The empty array means this setup only runs once when the tile loads

  // Formatting the time to HH:MM:SS
  const timeString = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Formatting the date
  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-blue-600 dark:text-blue-400 mb-2">
        {timeString}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 font-medium">
        {dateString}
      </p>
    </div>
  );
};
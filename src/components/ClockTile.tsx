import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const ClockTile = () => {
  const [now, setNow] = useState(new Date());

  // Crucial: set up interval on mount, clear it on unmount
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const ampm = now.toLocaleTimeString('en-US', { hour12: true }).split(' ')[1];

  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="tile clock-tile">
      <div className="tile-header">
        <div>
          <p className="tile-day">{dateString.split(',')[0]}</p>
          <p className="tile-date">{dateString.split(',').slice(1).join(',').trim()}</p>
        </div>
        <Clock size={20} className="clock-icon" />
      </div>
      <div className="clock-display">
        <span className="clock-time">{timeString}</span>
        <span className="clock-ampm">{ampm}</span>
      </div>
    </div>
  );
};

export default ClockTile;
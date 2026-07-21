import { useState, useEffect } from 'react';
import { BatteryCharging, Battery, BatteryWarning, Activity } from 'lucide-react';

interface BatteryState {
  level: number;
  charging: boolean;
  supported: boolean;
}

const SystemStatsTile = () => {
  const [battery, setBattery] = useState<BatteryState>({
    level: 84, // Default fallback/mock value
    charging: true,
    supported: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || !('getBattery' in navigator)) {
      setBattery(prev => ({ ...prev, supported: false }));
      return;
    }

    let batteryInstance: any = null;

    const handleBatteryChange = () => {
      if (batteryInstance) {
        setBattery({
          level: Math.round(batteryInstance.level * 100),
          charging: batteryInstance.charging,
          supported: true,
        });
      }
    };

    (navigator as any).getBattery().then((batt: any) => {
      batteryInstance = batt;
      handleBatteryChange();

      batt.addEventListener('levelchange', handleBatteryChange);
      batt.addEventListener('chargingchange', handleBatteryChange);
    }).catch(() => {
      setBattery(prev => ({ ...prev, supported: false }));
    });

    return () => {
      if (batteryInstance) {
        batteryInstance.removeEventListener('levelchange', handleBatteryChange);
        batteryInstance.removeEventListener('chargingchange', handleBatteryChange);
      }
    };
  }, []);

  // Determine colors/status based on level and charging state
  const isLow = battery.level <= 20 && !battery.charging;
  
  // Theme color styles
  let themeColorClass = 'text-green-500';
  let bgColorClass = 'bg-green-50 dark:bg-green-900/20';
  let glowColorClass = 'bg-green-500/10 group-hover:bg-green-500/20';
  let statusText = 'Charging optimally';
  let statusColorClass = 'text-green-500';
  let activityLabel = 'Good';

  if (battery.charging) {
    themeColorClass = 'text-green-500';
    bgColorClass = 'bg-green-50 dark:bg-green-900/20';
    glowColorClass = 'bg-green-500/10 group-hover:bg-green-500/20';
    statusText = 'Charging optimally';
    statusColorClass = 'text-green-500';
    activityLabel = 'Charging';
  } else if (isLow) {
    themeColorClass = 'text-red-500 animate-pulse';
    bgColorClass = 'bg-red-50 dark:bg-red-900/20';
    glowColorClass = 'bg-red-500/10 group-hover:bg-red-500/20';
    statusText = 'Battery low - plug in!';
    statusColorClass = 'text-red-500 font-bold';
    activityLabel = 'Critical';
  } else {
    // Discharging/On Battery
    themeColorClass = 'text-blue-500';
    bgColorClass = 'bg-blue-50 dark:bg-blue-900/20';
    glowColorClass = 'bg-blue-500/10 group-hover:bg-blue-500/20';
    statusText = 'Running on battery';
    statusColorClass = 'text-blue-500 dark:text-blue-400';
    activityLabel = 'On Battery';
  }

  // If not supported, we can append a "(Demo)" text or similar
  const displayStatus = battery.supported ? statusText : `${statusText} (Demo)`;

  // Choose the right icon
  const renderIcon = () => {
    if (battery.charging) {
      return <BatteryCharging size={20} className={themeColorClass} />;
    }
    if (isLow) {
      return <BatteryWarning size={20} className={themeColorClass} />;
    }
    return <Battery size={20} className={themeColorClass} />;
  };

  return (
    <div className="md:col-span-1 row-span-1 h-[160px] rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
      {/* Dynamic background glow */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-all duration-500 ${glowColorClass}`} />
      
      <div className="flex items-center justify-between relative z-10">
        <div className={`p-2 rounded-xl transition-colors duration-300 ${bgColorClass}`}>
          {renderIcon()}
        </div>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1 transition-all">
          <Activity size={12} className={isLow ? 'text-red-500 animate-pulse' : 'text-gray-400'} />
          {activityLabel}
        </span>
      </div>
      
      <div className="relative z-10 mt-auto">
        <div className="flex items-baseline space-x-1">
          <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight tabular-nums">
            {battery.level}
          </span>
          <span className="text-xl font-bold text-gray-400">
            %
          </span>
        </div>
        <p className={`text-sm font-semibold mt-1 transition-colors duration-300 ${statusColorClass}`}>
          {displayStatus}
        </p>
      </div>
    </div>
  );
};

export default SystemStatsTile;

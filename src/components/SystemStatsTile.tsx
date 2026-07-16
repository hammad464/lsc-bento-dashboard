import { BatteryCharging, Activity } from 'lucide-react';

const SystemStatsTile = () => {
  return (
    <div className="md:col-span-1 row-span-1 h-[160px] rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-500" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <BatteryCharging size={20} className="text-green-500" />
        </div>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1">
          <Activity size={12} />
          Good
        </span>
      </div>
      
      <div className="relative z-10 mt-auto">
        <div className="flex items-baseline space-x-1">
          <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            84
          </span>
          <span className="text-xl font-bold text-gray-400">
            %
          </span>
        </div>
        <p className="text-sm font-semibold text-green-500 mt-1">
          Charging optimally
        </p>
      </div>
    </div>
  );
};

export default SystemStatsTile;

import { User, Sparkles } from 'lucide-react';

const ProfileTile = () => {
  return (
    <div className="md:col-span-3 row-span-1 p-8 rounded-[2rem] bg-blue-600 dark:bg-[#B6F500] text-white shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300 border border-white/10">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
      
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-5">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
              <User size={36} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Good Morning!</h2>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-indigo-50 bg-black/20 w-fit px-5 py-3 rounded-full backdrop-blur-sm border border-white/10 shadow-sm">
            <Sparkles size={18} className="text-amber-200" />
            <span className="text-sm font-semibold">Ready to boost your productivity?</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTile;

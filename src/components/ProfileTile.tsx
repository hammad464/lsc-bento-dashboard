import { User, Sparkles, Pencil, Check } from 'lucide-react';
import { useState } from 'react';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning!';
  if (hour >= 12 && hour < 17) return 'Good Afternoon!';
  if (hour >= 17 && hour < 22) return 'Good Evening!';
  return 'Good Night!';
};

const ProfileTile = () => {
  const greeting = getGreeting();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(() => {
    try {
      return localStorage.getItem('bento-profile-username') || '';
    } catch (e) {
      console.error('Failed to read username from localStorage', e);
      return '';
    }
  });

  const saveName = () => {
    setIsEditing(false);
    try {
      localStorage.setItem('bento-profile-username', username.trim());
    } catch (e) {
      console.error('Failed to save username to localStorage', e);
    }
  };

  return (
    <div className="md:col-span-3 row-span-1 p-8 rounded-[2rem] bg-blue-600 dark:bg-[#B6F500] text-white dark:text-gray-900 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300 border border-white/10">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
      
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-5">
            <div className="p-4 bg-white/20 dark:bg-black/10 rounded-2xl backdrop-blur-md border border-white/20 dark:border-black/10 shadow-inner">
              <User size={36} className="text-white dark:text-gray-900" />
            </div>
            <div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={saveName}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveName();
                    }}
                    placeholder="Your name"
                    autoFocus
                    className="px-3 py-1 rounded-xl bg-white/20 dark:bg-black/10 text-white dark:text-gray-900 outline-none border border-white/30 dark:border-black/20 text-2xl font-extrabold focus:bg-white/30 dark:focus:bg-black/20 transition-all w-48 shadow-inner"
                  />
                  <button
                    onClick={saveName}
                    className="p-1.5 bg-white/20 dark:bg-black/10 hover:bg-white/35 dark:hover:bg-black/20 rounded-xl transition-colors text-white dark:text-gray-900"
                  >
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 group/name">
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    {username ? `${greeting.slice(0, -1)}, ${username}!` : greeting}
                  </h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/15 opacity-0 group-hover/name:opacity-100 transition-all rounded-lg cursor-pointer text-white dark:text-gray-900"
                    title="Edit name"
                  >
                    <Pencil size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-indigo-50 dark:text-gray-800 bg-black/20 dark:bg-black/10 w-fit px-5 py-3 rounded-full backdrop-blur-sm border border-white/10 dark:border-black/5 shadow-sm">
            <Sparkles size={18} className="text-amber-200 dark:text-amber-500 animate-pulse" />
            <span className="text-sm font-semibold">Ready to boost your productivity?</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTile;

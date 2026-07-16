import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggleTile = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme preference
    if (document.body.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const body = document.body;
    if (isDark) {
      body.classList.remove('dark');
      setIsDark(false);
    } else {
      body.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 col-span-1 row-span-1">
      <button
        onClick={toggleTheme}
        className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-inner"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun size={32} className="text-yellow-400" />
        ) : (
          <Moon size={32} className="text-indigo-500" />
        )}
      </button>
      <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </p>
    </div>
  );
};

export default ThemeToggleTile;

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
    document.body.classList.toggle('dark');
  setIsDark(prev => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-8 right-8 p-4 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-700 hover:scale-110 active:scale-95 transition-all duration-300 z-50 flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={24} className="group-hover:text-amber-400 transition-colors" />
      ) : (
        <Moon size={24} className="group-hover:text-indigo-400 transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggleTile;

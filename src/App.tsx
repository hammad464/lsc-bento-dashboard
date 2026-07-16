import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import DashboardGrid from './components/DashboardGrid';
import type { Theme } from './types';
import './styles/dashboard.css';

function App() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="app-main">
        <DashboardGrid />
      </main>
    </div>
  );
}

export default App;
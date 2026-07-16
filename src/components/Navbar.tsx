import { Search, Bell, Sun, Moon, Cloud } from 'lucide-react';
import type { Theme } from '../types';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const Navbar = ({ theme, onToggleTheme }: NavbarProps) => {
  const isDark = theme === 'dark';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">
          <span className="navbar-logo-dot" />
        </span>
        <h1 className="navbar-title">Productivity Dashboard</h1>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <Search size={16} />
          <input type="text" placeholder="Search..." />
        </div>

        {/* Note: Weather is hardcoded here. In a real app, you might want to pass weather data via props! */}
        <div className="navbar-weather">
          <Cloud size={16} className="navbar-weather-icon" />
          <div>
            <p className="navbar-weather-city">Lahore</p>
            <p className="navbar-weather-temp">28°C</p>
          </div>
        </div>

        <button className="navbar-bell" aria-label="Notifications">
          <Bell size={16} />
          <span className="navbar-bell-dot" />
        </button>

        <div className="navbar-theme">
          <span className={`navbar-theme-label ${!isDark ? 'active' : ''}`}>
            <Sun size={14} /> Light
          </span>
          
          <button
            className={`theme-switch ${isDark ? 'on' : ''}`}
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
          >
            <span className="theme-switch-knob" />
          </button>

          {/* LOGICAL FIX: Added the missing Dark mode label here */}
          <span className={`navbar-theme-label ${isDark ? 'active' : ''}`}>
            <Moon size={14} /> Dark
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
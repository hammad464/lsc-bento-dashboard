import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../types';

interface ThemeToggleTileProps {
  theme: Theme;
  onToggle: () => void;
}

const ThemeToggleTile = ({ theme, onToggle }: ThemeToggleTileProps) => {
  const isDark = theme === 'dark';

  return (
    <div className="tile theme-tile">
      <div className="theme-tile-left">
        <span className="tile-icon-badge theme-badge">
          <Moon size={16} />
        </span>
        <div>
          <h3>Theme</h3>
          <p className="theme-desc">Switch between light and dark mode.</p>
        </div>
      </div>

      <div className="theme-tile-right">
        <div className="theme-labels">
          <span className={`theme-label ${!isDark ? 'active' : ''}`}>
            <Sun size={14} /> Light
          </span>
          <span className="theme-divider">|</span>
          <span className={`theme-label ${isDark ? 'active' : ''}`}>
            <Moon size={14} /> Dark
          </span>
        </div>
        <button
          className={`theme-switch ${isDark ? 'on' : ''}`}
          onClick={onToggle}
          aria-label="Toggle dark mode"
        >
          <span className="theme-switch-knob" />
        </button>
      </div>
    </div>
  );
};

export default ThemeToggleTile;
import { Sparkles } from 'lucide-react';

interface WelcomeTileProps {
  name: string;
}

const WelcomeTile = ({ name }: WelcomeTileProps) => {
  return (
    <div className="tile welcome-tile">
      <div className="welcome-content">
        <span className="welcome-badge">👋 Good Morning</span>
        <h2 className="welcome-heading">{name}!</h2>
        <p className="welcome-sub">Focus, plan, and get things done today.</p>
        <div className="welcome-pill">
          <Sparkles size={13} />
          <span>Every day is a fresh start.</span>
        </div>
      </div>

      <div className="welcome-art" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="welcome-svg">
          {/* steam */}
          <path className="steam" d="M46 24c-4 5 4 8 0 13" />
          <path className="steam" d="M58 20c-4 5 4 8 0 13" />
          {/* mug */}
          <rect x="34" y="42" width="34" height="26" rx="6" className="mug-body" />
          <path d="M68 48c8-2 12 3 12 8s-4 10-12 8" className="mug-handle" />
          {/* plate/base */}
          <ellipse cx="51" cy="72" rx="26" ry="4" className="base-shadow" />
          {/* plant pot */}
          <path d="M78 66h18l-3 14a3 3 0 0 1-3 3H84a3 3 0 0 1-3-3l-3-14z" className="pot" />
          <path d="M87 66c0-10-8-16-8-16s3 10 2 16" className="leaf leaf-1" />
          <path d="M87 66c0-9 9-14 9-14s-4 9-3 14" className="leaf leaf-2" />
        </svg>
      </div>
    </div>
  );
};

export default WelcomeTile;
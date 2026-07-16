import { Quote } from 'lucide-react';

const QuoteTile = () => {
  return (
    <div className="tile quote-tile">
      <span className="tile-icon-badge quote-badge">
        <Quote size={18} />
      </span>
      <p className="quote-text">
        Discipline is choosing between what you want now and what you want most.
      </p>
      <div className="quote-decoration" aria-hidden="true" />
    </div>
  );
};

export default QuoteTile;
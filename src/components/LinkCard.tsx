import { ArrowUpRight } from 'lucide-react';
import type { QuickLink } from '../types';

interface LinkCardProps {
  link: QuickLink;
}

const LinkCard = ({ link }: LinkCardProps) => {
  const { name, description, url, icon, iconBg } = link;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-card"
    >
      <div className="link-card-icon" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <div className="link-card-text">
        <p className="link-card-name">{name}</p>
        <p className="link-card-desc">{description}</p>
      </div>
      <ArrowUpRight size={16} className="link-card-arrow" />
    </a>
  );
};

export default LinkCard;
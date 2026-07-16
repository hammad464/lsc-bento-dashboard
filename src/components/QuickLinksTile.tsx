import { Link2, ArrowRight } from 'lucide-react';
import { SiGithub, SiGoogle, SiBlack, SiStackoverflow } from 'react-icons/si';
import LinkCard from './LinkCard';
import type { QuickLink } from '../types';

const links: QuickLink[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code & Repos',
    url: 'https://github.com',
    icon: <SiGithub size={20} color="#181717" />,
    iconBg: '#F3F4F6',
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Search anything',
    url: 'https://google.com',
    icon: <SiGoogle size={20} color="#4285F4" />,
    iconBg: '#F3F4F6',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team Chat',
    url: 'https://slack.com',
    icon: <SiBlack size={20} color="#4A154B" />,
    iconBg: '#F3F4F6',
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    description: 'Q&A Community',
    url: 'https://stackoverflow.com',
    icon: <SiStackoverflow size={20} color="#F48024" />,
    iconBg: '#F3F4F6',
  },
];

const QuickLinksTile = () => {
  return (
    <div className="tile quicklinks-tile">
      <div className="tile-header">
        <div className="tile-title-group">
          <span className="tile-icon-badge quicklinks-badge">
            <Link2 size={16} />
          </span>
          <h3>Quick Links</h3>
        </div>
        <a href="#" className="view-all">
          View all <ArrowRight size={14} />
        </a>
      </div>
      <div className="link-grid">
        {links.map((link) => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
};

export default QuickLinksTile;
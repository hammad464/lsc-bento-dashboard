import { GitBranch, Search, MessageSquare, Code2, ArrowRight, Link2 } from 'lucide-react';
import LinkCard from './LinkCard';

const QuickLinksTile = () => {
  const links = [
    {
      name: 'GitHub',
      description: 'Code & Repos',
      url: 'https://github.com',
      icon: <GitBranch size={22} />,
      color: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
    },
    {
      name: 'Google',
      description: 'Search anything',
      url: 'https://google.com',
      icon: <Search size={22} />,
      color: 'bg-blue-500 dark:bg-[#B6F500] text-white dark:text-gray-900'
    },
    {
      name: 'Slack',
      description: 'Team Chat',
      url: 'https://slack.com',
      icon: <MessageSquare size={22} />,
      color: 'bg-purple-600 text-white'
    },
    {
      name: 'Stack Overflow',
      description: 'Q&A Community',
      url: 'https://stackoverflow.com',
      icon: <Code2 size={22} />,
      color: 'bg-orange-500 text-white'
    }
  ];

  return (
    <div className="md:col-span-1 row-span-2 rounded-[2rem] bg-[#EEF7F2] dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
 <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#d1ebd9] dark:bg-gray-800 rounded-xl text-green-800 dark:text-green-400 shrink-0">
            <Link2 size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Quick Links</h3>
        </div>
        
        {/* Updated "View all" container: added ml-auto, text-xs, and reduced icon size */}
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer shrink-0 ml-auto">
          <span className="text-xs font-normal">View all</span>
          <ArrowRight size={14} />
        </div>
      </div>
      <div className="flex flex-col gap-3 flex-grow overflow-y-auto custom-scrollbar">
        {links.map((link) => (
          <LinkCard
            key={link.name}
            name={link.name}
            description={link.description}
            url={link.url}
            icon={link.icon}
            color={link.color}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickLinksTile;
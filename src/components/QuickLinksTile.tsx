import { GitBranch, Search, MessageSquare, Code2, ExternalLink } from 'lucide-react';
import LinkCard from './LinkCard';

const QuickLinksTile = () => {
  const links = [
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: <GitBranch size={22} />,
      color: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
    },
    {
      name: 'Google',
      url: 'https://google.com',
      icon: <Search size={22} />,
      color: 'bg-blue-500 dark:bg-[#B6F500] text-white dark:text-gray-900'
    },
    {
      name: 'Slack',
      url: 'https://slack.com',
      icon: <MessageSquare size={22} />,
      color: 'bg-purple-600 text-white'
    },
    {
      name: 'Stack Overflow',
      url: 'https://stackoverflow.com',
      icon: <Code2 size={22} />,
      color: 'bg-orange-500 text-white'
    }
  ];

  return (
    <div className="md:col-span-1 row-span-2 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Bookmarks</h3>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer shrink-0">
          <ExternalLink size={16} />
        </div>
      </div>
      
      <div className="flex flex-col gap-3 flex-grow overflow-y-auto custom-scrollbar">
        {links.map((link) => (
          <LinkCard
            key={link.name}
            name={link.name}
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

import { GitBranch, Search, MessageSquare, Code2 } from 'lucide-react';
import LinkCard from './LinkCard';

const QuickLinksTile = () => {
  const links = [
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: <GitBranch size={28} />
    },
    {
      name: 'Google',
      url: 'https://google.com',
      icon: <Search size={28} />
    },
    {
      name: 'Slack',
      url: 'https://slack.com',
      icon: <MessageSquare size={28} />
    },
    {
      name: 'StackOverflow',
      url: 'https://stackoverflow.com',
      icon: <Code2 size={28} />
    }
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 col-span-1 md:col-span-2 row-span-1 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Links</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-grow">
        {links.map((link) => (
          <LinkCard
            key={link.name}
            name={link.name}
            url={link.url}
            icon={link.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickLinksTile;

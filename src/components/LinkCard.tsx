import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface LinkCardProps {
  url: string;
  name: string;
  icon: ReactNode;
  color?: string;
}

const LinkCard = ({ url, name, icon, color = "bg-blue-500 dark:bg-[#B6F500] text-white" }: LinkCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 group"
    >
      <div className={`p-2 rounded-lg ${color} shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0`}>
        {icon}
      </div>
      <span className="ml-3 font-semibold text-sm text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate">
        {name}
      </span>
      <ArrowUpRight size={16} className="ml-auto text-gray-400 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 shrink-0" />
    </a>
  );
};

export default LinkCard;

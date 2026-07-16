import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface LinkCardProps {
  url: string;
  name: string;
  description: string;
  icon: ReactNode;
  color?: string;
}

const LinkCard = ({ url, name, description, icon, color = "bg-blue-500 dark:bg-[#B6F500] text-white" }: LinkCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-4 rounded-2xl bg-white dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 group shadow-sm"
    >
      <div className={`p-3 rounded-xl ${color} shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0 flex items-center justify-center`}>
        {icon}
      </div>
      
      <div className="ml-4 flex flex-col overflow-hidden">
        <span className="font-bold text-base text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-white transition-colors truncate">
          {name}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {description}
        </span>
      </div>

      <ArrowUpRight 
        size={18} 
        className="ml-auto text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-all duration-300 shrink-0" 
      />
    </a>
  );
};

export default LinkCard;
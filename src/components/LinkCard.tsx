import type { ReactNode } from 'react';

interface LinkCardProps {
  url: string;
  name: string;
  icon: ReactNode;
}

const LinkCard = ({ url, name, icon }: LinkCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-indigo-50 dark:bg-gray-700/50 dark:hover:bg-gray-600 transition-all duration-200 group border border-transparent hover:border-indigo-100 dark:hover:border-gray-500"
    >
      <div className="text-gray-600 dark:text-gray-300 group-hover:text-indigo-500 group-hover:scale-110 transition-transform duration-200 mb-3">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {name}
      </span>
    </a>
  );
};

export default LinkCard;

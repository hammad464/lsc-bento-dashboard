import type { ReactNode } from 'react';

interface DashboardGridProps {
  children: ReactNode;
}

const DashboardGrid = ({ children }: DashboardGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min max-w-6xl mx-auto w-full">
      {children}
    </div>
  );
};

export default DashboardGrid;
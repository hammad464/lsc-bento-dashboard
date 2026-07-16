import type { ReactNode } from 'react';

interface DashboardGridProps {
  children: ReactNode;
}

const DashboardGrid = ({ children }: DashboardGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(160px,auto)] w-full grid-flow-row-dense">
      {children}
    </div>
  );
};

export default DashboardGrid;
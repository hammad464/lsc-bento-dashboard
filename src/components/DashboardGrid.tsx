import React from 'react';

// We will import your specific tiles here later
import { ClockTile } from './ClockTile';
// import WeatherTile from './WeatherTile';
// import QuickLinksTile from './QuickLinksTile';
// import ThemeToggleTile from './ThemeToggleTile';

export const DashboardGrid: React.FC = () => {
  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      {/* 
        Tailwind CSS Grid Implementation:
        - grid-cols-1: Single column on mobile (Requirement met)
        - md:grid-cols-3: 3 columns on desktop
        - gap-4: Spacing between bento tiles
      */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-4">
        
        {/* Placeholder Tiles to visualize the Bento Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 col-span-1 md:col-span-2 row-span-1">
          {/* <ClockTile /> will go here */}
          {/* Replace the placeholder with this */}
          <ClockTile />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 col-span-1 row-span-1">
          {/* <ThemeToggleTile /> will go here */}
          <h2 className="text-xl font-bold">Theme Toggle Area</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 col-span-1 md:col-span-1 row-span-2">
          {/* <QuickLinksTile /> will go here */}
          <h2 className="text-xl font-bold">Quick Links Area</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 col-span-1 md:col-span-2 row-span-1">
           {/* <WeatherTile /> will go here */}
           <h2 className="text-xl font-bold">Weather Tile Area</h2>
        </div>

      </div>
    </div>
  );
};
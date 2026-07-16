
import DashboardGrid from './components/DashboardGrid';
import ProfileTile from './components/ProfileTile';
import ClockTile from './components/ClockTile';
import QuickLinksTile from './components/QuickLinksTile';
import WeatherTile from './components/WeatherTile';
import ThemeToggleTile from './components/ThemeToggleTile';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl mx-auto mb-8 text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Personal Productivity Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Your daily tools, organized in a modern bento grid.
        </p>
      </div>

      <DashboardGrid>
        <ProfileTile />
        <ClockTile />
        <QuickLinksTile />
        <WeatherTile />
        <ThemeToggleTile />
      </DashboardGrid>
    </div>
  );
}

export default App;
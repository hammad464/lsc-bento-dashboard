import DashboardGrid from './components/DashboardGrid';
import ProfileTile from './components/ProfileTile';
import ClockTile from './components/ClockTile';
import QuickLinksTile from './components/QuickLinksTile';
import WeatherTile from './components/WeatherTile';
import ThemeToggleTile from './components/ThemeToggleTile';
import NotesQuickAddTile from './components/Tasks';
import SystemStatsTile from './components/SystemStatsTile';

function App() {
  return (
    <div className="min-h-screen transition-colors duration-500 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background gradients for modern feel */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/20 dark:bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-300/20 dark:bg-rose-900/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">


        <DashboardGrid>
          <ProfileTile />
          <ClockTile />
          <WeatherTile />
          <SystemStatsTile />
          <QuickLinksTile />
          <NotesQuickAddTile />
        </DashboardGrid>
      </div>

      <ThemeToggleTile />
    </div>
  );
}

export default App;
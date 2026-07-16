import WelcomeTile from './WelcomeTile';
import ClockTile from './ClockTile';
import QuickLinksTile from './QuickLinksTile';
import WeatherTile from './WeatherTile';
import TaskTile from './TaskTile';
import QuoteTile from './QuoteTile';

const DashboardGrid = () => {
  return (
    <div className="dashboard-grid">
      <WelcomeTile name="Hammad" />
      <ClockTile />
      <QuickLinksTile />
      <WeatherTile />
      <TaskTile />
      <QuoteTile />
    </div>
  );
};

export default DashboardGrid;
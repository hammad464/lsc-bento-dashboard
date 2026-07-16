export interface QuickLink {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  iconBg: string;
}

export type TemperatureUnit = 'C' | 'F';

export interface WeatherData {
  city: string;
  country: string;
  tempCelsius: number;
  feelsLikeCelsius: number;
  condition: string;
}

export type Theme = 'light' | 'dark';

export interface Task {
  id: string;
  label: string;
  time: string;
  completed: boolean;
}
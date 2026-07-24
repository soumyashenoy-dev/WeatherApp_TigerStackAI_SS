import React from 'react';
import { TempUnit, SpeedUnit } from '../types';
import { CloudSun, Bookmark, Sparkles, RefreshCw } from 'lucide-react';

interface NavbarProps {
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
  onTempUnitChange: (unit: TempUnit) => void;
  onSpeedUnitChange: (unit: SpeedUnit) => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  tempUnit,
  speedUnit,
  onTempUnitChange,
  onSpeedUnitChange,
  onOpenFavorites,
  favoritesCount,
  onRefresh,
  isLoading,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-tight">
                Weather<span className="text-sky-500">IQ</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <Sparkles className="w-3 h-3" /> Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden xs:block">
              Open-Meteo Precision Forecast
            </p>
          </div>
        </div>

        {/* Control Actions & Unit Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
            title="Refresh weather data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-500' : ''}`} />
          </button>

          {/* Temperature Unit Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onTempUnitChange('C')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                tempUnit === 'C'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onTempUnitChange('F')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                tempUnit === 'F'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              °F
            </button>
          </div>

          {/* Speed Unit Dropdown */}
          <select
            value={speedUnit}
            onChange={(e) => onSpeedUnitChange(e.target.value as SpeedUnit)}
            className="hidden sm:block text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="kmh">km/h</option>
            <option value="mph">mph</option>
            <option value="ms">m/s</option>
          </select>

          {/* Favorites Drawer Toggle */}
          <button
            onClick={onOpenFavorites}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs font-medium hover:bg-sky-100 dark:hover:bg-sky-900/50 transition"
          >
            <Bookmark className="w-4 h-4 text-sky-500" />
            <span className="hidden xs:inline">Saved</span>
            {favoritesCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-sky-500 text-white rounded-full text-[10px] font-bold">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

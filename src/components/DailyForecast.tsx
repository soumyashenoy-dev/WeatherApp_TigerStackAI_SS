import React, { useState } from 'react';
import { DailyData, TempUnit, SpeedUnit } from '../types';
import { convertTemp, convertSpeed, getSpeedLabel, getWeatherCondition } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Droplets,
  Wind,
  SunDim,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface DailyForecastProps {
  daily: DailyData | undefined;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, tempUnit, speedUnit }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Find min/max temperature across all 7 days for relative bar rendering
  const allMaxTemps = daily.temperature_2m_max.map((t) => convertTemp(t, tempUnit));
  const allMinTemps = daily.temperature_2m_min.map((t) => convertTemp(t, tempUnit));
  const minOfWeek = Math.min(...allMinTemps);
  const maxOfWeek = Math.max(...allMaxTemps);
  const tempRange = Math.max(1, maxOfWeek - minOfWeek);

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/40 dark:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">7-Day Forecast</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Weekly predictions, rain probabilities, and temperature ranges
            </p>
          </div>
        </div>
      </div>

      {/* 7 Day Rows */}
      <div className="space-y-3">
        {daily.time.map((dateStr, idx) => {
          // Parse YYYY-MM-DD into local midnight Date to avoid UTC timezone rollback bug
          const [yr, mo, dy] = dateStr.split('-').map(Number);
          const dateObj = yr && mo && dy ? new Date(yr, mo - 1, dy) : new Date(dateStr);

          const dayName =
            idx === 0
              ? 'Today'
              : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const fullDateFormatted = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          const code = daily.weather_code[idx];
          const condition = getWeatherCondition(code);

          const maxTemp = convertTemp(daily.temperature_2m_max[idx], tempUnit);
          const minTemp = convertTemp(daily.temperature_2m_min[idx], tempUnit);

          const rainProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const rainSum = daily.precipitation_sum?.[idx] ?? 0;
          const maxWind = convertSpeed(daily.wind_speed_10m_max?.[idx] ?? 0, speedUnit);
          const maxUV = daily.uv_index_max?.[idx] ?? 0;

          const sunrise = daily.sunrise?.[idx]
            ? new Date(daily.sunrise[idx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '--:--';
          const sunset = daily.sunset?.[idx]
            ? new Date(daily.sunset[idx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '--:--';

          // Calculate temperature range bar percentages
          const minPct = Math.max(0, Math.min(100, ((minTemp - minOfWeek) / tempRange) * 100));
          const maxPct = Math.max(0, Math.min(100, ((maxTemp - minOfWeek) / tempRange) * 100));
          const barWidth = Math.max(10, maxPct - minPct);

          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={dateStr}
              className="rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50 overflow-hidden transition-all duration-200 hover:border-sky-300 dark:hover:border-sky-600"
            >
              {/* Main Summary Row */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left cursor-pointer"
              >
                {/* Left: Day & Condition */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-600">
                    <WeatherIcon code={code} className="w-7 h-7 text-sky-500" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {dayName}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {fullDateFormatted}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {condition.label}
                    </div>
                  </div>
                </div>

                {/* Middle: Rain probability badge */}
                <div className="flex items-center gap-2 sm:w-28 shrink-0">
                  {rainProb > 0 ? (
                    <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5" /> {rainProb}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Dry (0%)</span>
                  )}
                </div>

                {/* Right: Min - Bar - Max Temp & Toggle Indicator */}
                <div className="flex items-center gap-3 sm:w-56 shrink-0 justify-end">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-8 text-right">
                    {minTemp}°
                  </span>

                  {/* Relative temperature bar */}
                  <div className="relative w-24 sm:w-28 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 to-amber-500 rounded-full"
                      style={{ left: `${minPct}%`, width: `${barWidth}%` }}
                    />
                  </div>

                  <span className="text-xs font-bold text-slate-900 dark:text-white w-8">
                    {maxTemp}°
                  </span>

                  <div className="p-1 text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-sky-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="p-4 bg-white dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 space-y-1">
                    <div className="text-slate-400 flex items-center gap-1 font-medium">
                      <Wind className="w-3.5 h-3.5 text-indigo-500" /> Max Wind
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {maxWind} {getSpeedLabel(speedUnit)}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 space-y-1">
                    <div className="text-slate-400 flex items-center gap-1 font-medium">
                      <SunDim className="w-3.5 h-3.5 text-amber-500" /> Max UV Index
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {maxUV} / 12
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 space-y-1">
                    <div className="text-slate-400 flex items-center gap-1 font-medium">
                      <Droplets className="w-3.5 h-3.5 text-sky-500" /> Total Rain
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {rainSum} mm
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 space-y-1">
                    <div className="text-slate-400 flex items-center gap-1 font-medium">
                      <Sunrise className="w-3.5 h-3.5 text-amber-500" /> Daylight
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {sunrise} - {sunset}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

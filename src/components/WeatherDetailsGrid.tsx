import React from 'react';
import { CurrentData, SpeedUnit } from '../types';
import { convertSpeed, getSpeedLabel, getWindDirectionLabel } from '../utils/weatherUtils';
import { Cloud, Gauge, Eye, Thermometer, Wind, Droplets, Snowflake } from 'lucide-react';

interface WeatherDetailsGridProps {
  current: CurrentData | undefined;
  speedUnit: SpeedUnit;
}

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({
  current,
  speedUnit,
}) => {
  if (!current) return null;

  const speedLabel = getSpeedLabel(speedUnit);
  const windGusts = convertSpeed(current.wind_gusts_10m ?? 0, speedUnit);
  const windDirName = getWindDirectionLabel(current.wind_direction_10m ?? 0);

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/40 dark:shadow-none">
      <div className="border-b border-slate-100 dark:border-slate-700/60 pb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Detailed Environmental Metrics
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          In-depth atmospheric parameters & wind speed dynamics
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Cloud Cover */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Cloud className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-semibold">Cloud Cover</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {current.cloud_cover}%
          </div>
          <div className="text-[10px] text-slate-400">
            {current.cloud_cover < 20 ? 'Mostly Clear' : current.cloud_cover < 70 ? 'Partly Cloudy' : 'Heavy Clouds'}
          </div>
        </div>

        {/* Surface Pressure */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Gauge className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold">Surface Press.</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {Math.round(current.surface_pressure)} hPa
          </div>
          <div className="text-[10px] text-slate-400">Atmospheric pressure</div>
        </div>

        {/* Wind Gusts */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Wind className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold">Wind Gusts</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {windGusts} {speedLabel}
          </div>
          <div className="text-[10px] text-slate-400">Peak wind speed</div>
        </div>

        {/* Wind Direction */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Wind className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold">Wind Angle</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {current.wind_direction_10m}° {windDirName}
          </div>
          <div className="text-[10px] text-slate-400">Compass heading</div>
        </div>

        {/* Rain Amount */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Droplets className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-semibold">Precipitation</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {current.precipitation} mm
          </div>
          <div className="text-[10px] text-slate-400">Current hour total</div>
        </div>

        {/* Snowfall */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Snowflake className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold">Snowfall</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {current.snowfall || 0} cm
          </div>
          <div className="text-[10px] text-slate-400">Snow accumulation</div>
        </div>
      </div>
    </div>
  );
};

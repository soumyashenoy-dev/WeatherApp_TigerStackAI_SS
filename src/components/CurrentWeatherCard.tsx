import React from 'react';
import { CurrentData, DailyData, TempUnit, SpeedUnit, GeocodingResult } from '../types';
import {
  getWeatherCondition,
  convertTemp,
  convertSpeed,
  getSpeedLabel,
  getWindDirectionLabel,
  getUVRating,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';
import {
  Bookmark,
  BookmarkCheck,
  Sunrise,
  Sunset,
  Wind,
  Droplets,
  SunDim,
  Gauge,
  Thermometer,
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface CurrentWeatherCardProps {
  current: CurrentData;
  daily: DailyData | undefined;
  location: GeocodingResult | { name: string; country?: string; admin1?: string; latitude: number; longitude: number };
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  timezone?: string;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  current,
  daily,
  location,
  tempUnit,
  speedUnit,
  isFavorite,
  onToggleFavorite,
  timezone,
}) => {
  const condition = getWeatherCondition(current.weather_code);

  const displayTemp = convertTemp(current.temperature_2m, tempUnit);
  const apparentTemp = convertTemp(current.apparent_temperature, tempUnit);

  const maxTempToday = daily?.temperature_2m_max?.[0] !== undefined ? convertTemp(daily.temperature_2m_max[0], tempUnit) : undefined;
  const minTempToday = daily?.temperature_2m_min?.[0] !== undefined ? convertTemp(daily.temperature_2m_min[0], tempUnit) : undefined;

  const windSpeed = convertSpeed(current.wind_speed_10m, speedUnit);
  const speedLabel = getSpeedLabel(speedUnit);
  const windDir = getWindDirectionLabel(current.wind_direction_10m);

  const uvValue = daily?.uv_index_max?.[0] ?? 0;
  const uvRating = getUVRating(uvValue);

  // Sunrise and Sunset calculation
  const sunriseStr = daily?.sunrise?.[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';
  const sunsetStr = daily?.sunset?.[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  // Calculate sun progress % safely
  let sunProgress = 50;
  if (daily?.sunrise?.[0] && daily?.sunset?.[0]) {
    try {
      const now = new Date().getTime();
      const rise = new Date(daily.sunrise[0]).getTime();
      const set = new Date(daily.sunset[0]).getTime();
      if (!isNaN(rise) && !isNaN(set) && set > rise) {
        if (now <= rise) sunProgress = 0;
        else if (now >= set) sunProgress = 100;
        else sunProgress = Math.round(((now - rise) / (set - rise)) * 100);
      }
    } catch {
      sunProgress = 50;
    }
  }
  if (isNaN(sunProgress) || !isFinite(sunProgress)) {
    sunProgress = 50;
  }

  // Format local date / time
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all">
      {/* Background Hero Gradient Flare */}
      <div
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br ${condition.gradient} opacity-20 dark:opacity-30 blur-3xl pointer-events-none`}
      />

      <div className="relative p-6 sm:p-8 space-y-6">
        {/* Top Header: Location, Date & Favorite Button */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <MapPin className="w-4 h-4" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {location.name}
              </h2>
              {location.country && (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {location.country}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pl-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {formattedDate}
              </span>
              {timezone && <span className="opacity-75">• {timezone}</span>}
            </div>
          </div>

          <button
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-600'
            }`}
            title={isFavorite ? 'Remove from saved locations' : 'Save location'}
          >
            {isFavorite ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>

        {/* Main Temperature & Condition Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left: Temperature & Conditions */}
          <div className="flex items-center gap-6">
            <div className="relative p-4 rounded-3xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 shrink-0">
              <WeatherIcon
                code={current.weather_code}
                isDay={current.is_day}
                className="w-16 h-16 sm:w-20 sm:h-20 text-sky-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tighter text-slate-900 dark:text-white">
                  {displayTemp}°
                </span>
                <span className="text-xl font-bold text-sky-500">{tempUnit}</span>
              </div>

              <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                {condition.label}
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span>Feels like {apparentTemp}°</span>
                {maxTempToday !== undefined && minTempToday !== undefined && (
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <ArrowUp className="w-3 h-3 text-rose-500 inline" /> {maxTempToday}°
                    <ArrowDown className="w-3 h-3 text-blue-500 inline" /> {minTempToday}°
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Sun Trajectory Arc */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Sunrise className="w-4 h-4" /> Sunrise {sunriseStr}
              </span>
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                <Sunset className="w-4 h-4" /> Sunset {sunsetStr}
              </span>
            </div>

            {/* Sun path indicator */}
            <div className="relative h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-400 via-sky-400 to-indigo-500 transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, sunProgress))}%` }}
              />
            </div>

            <div className="text-center text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {current.is_day ? `Daylight hours • Sun progress ${sunProgress}%` : 'Nighttime'}
            </div>
          </div>
        </div>

        {/* Bottom Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Humidity */}
          <div className="p-3.5 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/15 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Humidity</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {current.relative_humidity_2m}%
              </div>
            </div>
          </div>

          {/* Wind */}
          <div className="p-3.5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Wind</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {windSpeed} {speedLabel} <span className="text-xs font-normal text-slate-500">{windDir}</span>
              </div>
            </div>
          </div>

          {/* UV Index */}
          <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <SunDim className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">UV Index</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                {uvValue}{' '}
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold ${uvRating.color}`}>
                  {uvRating.label}
                </span>
              </div>
            </div>
          </div>

          {/* Air Pressure */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Pressure</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {Math.round(current.pressure_msl)} hPa
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

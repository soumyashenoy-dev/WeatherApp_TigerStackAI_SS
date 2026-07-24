import React, { useState } from 'react';
import { HourlyData, TempUnit, SpeedUnit } from '../types';
import { convertTemp, convertSpeed, getSpeedLabel, getWeatherCondition } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';
import { Clock, AreaChart as ChartIcon, LayoutGrid, Droplets, Wind } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface HourlyForecastProps {
  hourly: HourlyData | undefined;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, tempUnit, speedUnit }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'cards'>('chart');

  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  // Take next 24 hours
  const next24Times = hourly.time.slice(0, 24);

  const chartData = next24Times.map((t, idx) => {
    const dateObj = t ? new Date(t) : new Date();
    const isValidDate = !isNaN(dateObj.getTime());
    const hourFormatted = isValidDate
      ? dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true })
      : `--:--`;
    const tempC = hourly.temperature_2m[idx] ?? 0;
    const temp = convertTemp(tempC, tempUnit);
    const rainProb = hourly.precipitation_probability?.[idx] ?? 0;
    const wind = convertSpeed(hourly.wind_speed_10m?.[idx] ?? 0, speedUnit);
    const code = hourly.weather_code[idx] ?? 0;

    return {
      time: hourFormatted,
      temp,
      rainProb,
      wind,
      code,
      fullTime: t,
    };
  });

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/40 dark:shadow-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Hourly Forecast</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Next 24-hour temperature & precipitation trend
            </p>
          </div>
        </div>

        {/* Chart vs Cards View Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl">
          <button
            onClick={() => setViewMode('chart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'chart'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ChartIcon className="w-3.5 h-3.5" /> Chart View
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Timeline Cards
          </button>
        </div>
      </div>

      {/* Chart View */}
      {viewMode === 'chart' ? (
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const condition = getWeatherCondition(data.code);
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                        <div className="font-bold text-sky-400">{data.time}</div>
                        <div className="flex items-center gap-2">
                          <WeatherIcon code={data.code} className="w-4 h-4 text-amber-400" />
                          <span>{condition.label}</span>
                        </div>
                        <div className="text-base font-extrabold">{data.temp}°{tempUnit}</div>
                        {data.rainProb > 0 && (
                          <div className="text-sky-300 flex items-center gap-1">
                            <Droplets className="w-3 h-3 inline" /> {data.rainProb}% rain chance
                          </div>
                        )}
                        <div className="text-slate-400 flex items-center gap-1">
                          <Wind className="w-3 h-3 inline" /> {data.wind} {getSpeedLabel(speedUnit)}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#0284c7"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      {/* Hourly Scrollable Cards (or always available below) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar pt-1">
        {chartData.map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-24 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 flex flex-col items-center justify-between gap-2 text-center hover:bg-sky-50 dark:hover:bg-slate-700 transition"
          >
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {idx === 0 ? 'Now' : item.time}
            </span>

            <WeatherIcon code={item.code} className="w-8 h-8 text-sky-500 my-1" />

            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {item.temp}°
            </span>

            {item.rainProb > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold flex items-center gap-0.5">
                <Droplets className="w-2.5 h-2.5" /> {item.rainProb}%
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">0%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

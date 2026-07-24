import React, { useState } from 'react';
import { CurrentData, DailyData, HourlyData } from '../types';
import { generateRecommendations, calculateActivityScores } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';
import {
  Sparkles,
  Umbrella,
  Shirt,
  SunDim,
  Wind,
  Footprints,
  Bike,
  Trees,
  Camera,
  Car,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Compass,
} from 'lucide-react';

interface PlanningIntelligenceProps {
  current: CurrentData | undefined;
  daily: DailyData | undefined;
  hourly: HourlyData | undefined;
}

export const PlanningIntelligence: React.FC<PlanningIntelligenceProps> = ({
  current,
  daily,
  hourly,
}) => {
  const [activeTab, setActiveTab] = useState<'advice' | 'activities'>('advice');

  const recommendations = generateRecommendations(current, daily, hourly);
  const activityScores = calculateActivityScores(current, daily);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'alert':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-900 dark:text-rose-200',
          iconBg: 'bg-rose-500/20 text-rose-600 dark:text-rose-400',
          badge: 'bg-rose-500 text-white',
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200',
          iconBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
          badge: 'bg-amber-500 text-white',
        };
      case 'success':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-200',
          iconBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
          badge: 'bg-emerald-500 text-white',
        };
      default:
        return {
          bg: 'bg-sky-500/10 border-sky-500/20 text-sky-900 dark:text-sky-200',
          iconBg: 'bg-sky-500/20 text-sky-600 dark:text-sky-400',
          badge: 'bg-sky-500 text-white',
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500 text-white';
    if (score >= 6) return 'bg-sky-500 text-white';
    if (score >= 4) return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/40 dark:shadow-none">
      {/* Header & Section Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Planning & Intelligence
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized advice & outdoor activity suitability
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl">
          <button
            onClick={() => setActiveTab('advice')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'advice'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Smart Recommendations ({recommendations.length})
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'activities'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Activity Scores
          </button>
        </div>
      </div>

      {/* Tab 1: Recommendations List */}
      {activeTab === 'advice' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((item, idx) => {
            const style = getSeverityStyle(item.severity);
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md flex items-start gap-4 ${style.bg}`}
              >
                <div className={`p-3 rounded-2xl shrink-0 ${style.iconBg}`}>
                  <WeatherIcon name={item.icon} className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold tracking-tight">{item.title}</h4>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{item.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Activity Suitability Scores */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activityScores.map((act) => (
            <div
              key={act.name}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <WeatherIcon name={act.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {act.name}
                  </span>
                </div>

                <div
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide ${getScoreColor(
                    act.score
                  )}`}
                >
                  {act.score}/10
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    act.score >= 8
                      ? 'bg-emerald-500'
                      : act.score >= 6
                      ? 'bg-sky-500'
                      : act.score >= 4
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${act.score * 10}%` }}
                />
              </div>

              <div className="flex items-start justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {act.status}
                </span>
                <span className="text-[11px] text-right line-clamp-2 pl-2">{act.tip}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { GeocodingResult, WeatherResponse, TempUnit, SpeedUnit } from './types';
import { fetchWeather } from './utils/api';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { PlanningIntelligence } from './components/PlanningIntelligence';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherDetailsGrid } from './components/WeatherDetailsGrid';
import { FavoritesModal } from './components/FavoritesModal';
import { CloudSun, RefreshCw, AlertCircle, Sparkles, MapPin, Search } from 'lucide-react';

const DEFAULT_CITY: GeocodingResult = {
  id: 2643743,
  name: 'London',
  latitude: 51.50853,
  longitude: -0.12574,
  country: 'United Kingdom',
  admin1: 'England',
  timezone: 'Europe/London',
};

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult>(() => {
    try {
      const saved = localStorage.getItem('weather_last_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed.latitude === 'number' &&
          !isNaN(parsed.latitude) &&
          typeof parsed.longitude === 'number' &&
          !isNaN(parsed.longitude) &&
          typeof parsed.name === 'string' &&
          parsed.name.trim().length > 0
        ) {
          return parsed;
        }
      }
      return DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Units state
  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    try {
      const val = localStorage.getItem('weather_temp_unit');
      return val === 'F' || val === 'C' ? val : 'C';
    } catch {
      return 'C';
    }
  });

  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>(() => {
    try {
      const val = localStorage.getItem('weather_speed_unit');
      return val === 'mph' || val === 'ms' || val === 'kmh' ? val : 'kmh';
    } catch {
      return 'kmh';
    }
  });

  // Favorites state
  const [favorites, setFavorites] = useState<GeocodingResult[]>(() => {
    try {
      const saved = localStorage.getItem('weather_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) =>
              item &&
              typeof item.latitude === 'number' &&
              typeof item.longitude === 'number' &&
              typeof item.name === 'string'
          );
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Fetch weather callback
  const loadWeather = useCallback(async (location: GeocodingResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(location.latitude, location.longitude);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Error fetching weather:', err);
      setError('Unable to load weather forecast. Please check your network connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial & when location changes
  useEffect(() => {
    loadWeather(selectedLocation);
    try {
      localStorage.setItem('weather_last_location', JSON.stringify(selectedLocation));
    } catch {
      // ignore
    }
  }, [selectedLocation, loadWeather]);

  // Persist units
  const handleTempUnitChange = (unit: TempUnit) => {
    setTempUnit(unit);
    try {
      localStorage.setItem('weather_temp_unit', unit);
    } catch {
      // ignore
    }
  };

  const handleSpeedUnitChange = (unit: SpeedUnit) => {
    setSpeedUnit(unit);
    try {
      localStorage.setItem('weather_speed_unit', unit);
    } catch {
      // ignore
    }
  };

  // Check if current location is in favorites by ID, Name, or distance
  const isCurrentFavorite = favorites.some(
    (f) =>
      f.id === selectedLocation.id ||
      (f.name && selectedLocation.name && f.name.toLowerCase() === selectedLocation.name.toLowerCase()) ||
      (Math.abs(f.latitude - selectedLocation.latitude) < 0.05 &&
        Math.abs(f.longitude - selectedLocation.longitude) < 0.05)
  );

  // Favorites handlers
  const handleToggleFavorite = () => {
    let updated: GeocodingResult[];
    if (isCurrentFavorite) {
      updated = favorites.filter(
        (f) =>
          f.id !== selectedLocation.id &&
          f.name?.toLowerCase() !== selectedLocation.name?.toLowerCase() &&
          !(
            Math.abs(f.latitude - selectedLocation.latitude) < 0.05 &&
            Math.abs(f.longitude - selectedLocation.longitude) < 0.05
          )
      );
    } else {
      updated = [...favorites, selectedLocation];
    }
    setFavorites(updated);
    try {
      localStorage.setItem('weather_favorites', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSelectCity = (city: GeocodingResult) => {
    setSelectedLocation(city);
  };

  const handleSelectCoordinates = (lat: number, lon: number, locationName: string) => {
    const locObj: GeocodingResult = {
      id: Math.floor(Math.random() * 1000000),
      name: locationName,
      latitude: lat,
      longitude: lon,
    };
    setSelectedLocation(locObj);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white transition-colors duration-300">
      {/* Top Navigation */}
      <Navbar
        tempUnit={tempUnit}
        speedUnit={speedUnit}
        onTempUnitChange={handleTempUnitChange}
        onSpeedUnitChange={handleSpeedUnitChange}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        favoritesCount={favorites.length}
        onRefresh={() => loadWeather(selectedLocation)}
        isLoading={isLoading}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Bar & City Selector */}
        <section>
          <SearchBar
            onSelectCity={handleSelectCity}
            onSelectCoordinates={handleSelectCoordinates}
            selectedCityName={selectedLocation.name}
            isLoading={isLoading}
          />
        </section>

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 space-y-4 shadow-lg shadow-rose-500/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Weather Data Unavailable for {selectedLocation.name}</h4>
                  <p className="text-xs text-rose-600 dark:text-rose-300">{error}</p>
                </div>
              </div>
              <button
                onClick={() => loadWeather(selectedLocation)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
              </button>
            </div>

            <div className="pt-3 border-t border-rose-200/60 dark:border-rose-800/60 text-xs">
              <span className="font-semibold text-rose-700 dark:text-rose-300 block mb-2">
                Try loading weather for one of these cities:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 2643743, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom' },
                  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan' },
                  { id: 5128581, name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'United States' },
                  { id: 2988507, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France' },
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleSelectCity(c)}
                    className="px-3 py-1 bg-white dark:bg-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-100 border border-rose-200 dark:border-rose-700 rounded-lg font-medium text-xs transition cursor-pointer"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData && (
          <div className="space-y-6 animate-pulse">
            <div className="h-72 rounded-3xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-48 rounded-3xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          </div>
        )}

        {/* Weather Dashboard Content */}
        {weatherData && weatherData.current && (
          <div className="space-y-8">
            {/* Prominent Current Weather Hero */}
            <CurrentWeatherCard
              current={weatherData.current}
              daily={weatherData.daily}
              location={selectedLocation}
              tempUnit={tempUnit}
              speedUnit={speedUnit}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
              timezone={weatherData.timezone}
            />

            {/* Smart Planning Recommendations & Activity Scores */}
            <PlanningIntelligence
              current={weatherData.current}
              daily={weatherData.daily}
              hourly={weatherData.hourly}
            />

            {/* 24-Hour Forecast Timeline / Chart */}
            <HourlyForecast
              hourly={weatherData.hourly}
              tempUnit={tempUnit}
              speedUnit={speedUnit}
            />

            {/* 7-Day Forecast */}
            <DailyForecast
              daily={weatherData.daily}
              tempUnit={tempUnit}
              speedUnit={speedUnit}
            />

            {/* Detailed Environmental Metrics Grid */}
            <WeatherDetailsGrid
              current={weatherData.current}
              speedUnit={speedUnit}
            />
          </div>
        )}
      </main>

      {/* Saved Favorites Drawer/Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectFavorite={handleSelectCity}
        onRemoveFavorite={(id) => {
          const updated = favorites.filter((f) => f.id !== id);
          setFavorites(updated);
          localStorage.setItem('weather_favorites', JSON.stringify(updated));
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          Powered by <span className="font-bold text-sky-500">Open-Meteo API</span> • Public & Keyless Precision Weather
        </p>
        <p className="text-[11px] opacity-75">
          Real-time weather telemetry, WMO code interpretation, and smart activity scoring
        </p>
      </footer>
    </div>
  );
}

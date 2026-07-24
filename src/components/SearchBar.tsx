import React, { useState, useEffect, useRef } from 'react';
import { GeocodingResult } from '../types';
import { searchCities, reverseGeocode } from '../utils/api';
import {
  Search,
  MapPin,
  Navigation,
  X,
  Loader2,
  History,
  Compass,
  Pin,
  PinOff,
  Check,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface SearchBarProps {
  onSelectCity: (city: GeocodingResult) => void;
  onSelectCoordinates: (lat: number, lon: number, locationName: string) => void;
  selectedCityName?: string;
  isLoading?: boolean;
}

const DEFAULT_QUICK_CITIES: GeocodingResult[] = [
  { id: 101, name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan' },
  { id: 102, name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'United States' },
  { id: 103, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom' },
  { id: 104, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France' },
  { id: 105, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia' },
  { id: 106, name: 'Singapore', latitude: 1.3521, longitude: 103.8198, country: 'Singapore' },
  { id: 107, name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates' },
  { id: 108, name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, country: 'United States' },
  { id: 109, name: 'Mumbai', latitude: 19.076, longitude: 72.8777, country: 'India' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onSelectCoordinates,
  selectedCityName,
  isLoading = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Quick Bar cities (combination of default and user-pinned cities)
  const [quickCities, setQuickCities] = useState<GeocodingResult[]>(() => {
    try {
      const saved = localStorage.getItem('weather_quick_cities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(
            (c) => c && typeof c.name === 'string' && typeof c.latitude === 'number' && typeof c.longitude === 'number'
          );
          if (valid.length > 0) return valid;
        }
      }
      return DEFAULT_QUICK_CITIES;
    } catch {
      return DEFAULT_QUICK_CITIES;
    }
  });

  const [searchHistory, setSearchHistory] = useState<GeocodingResult[]>(() => {
    try {
      const saved = localStorage.getItem('weather_search_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (c) => c && typeof c.name === 'string' && typeof c.latitude === 'number' && typeof c.longitude === 'number'
          );
        }
      }
      return [];
    } catch {
      return [];
    }
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setErrorMsg(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setErrorMsg(null);
      try {
        const cities = await searchCities(query);
        setResults(cities);
        if (cities.length === 0) {
          setErrorMsg(`No locations found matching "${query}". Check spelling or try a major city name.`);
        }
      } catch (err) {
        console.error('Search error:', err);
        setErrorMsg('Failed to fetch location suggestions. Please try again.');
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeocodingResult) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    setLocationNotice(null);

    // Save to history
    const updatedHistory = [
      city,
      ...searchHistory.filter((item) => item.id !== city.id && item.name !== city.name),
    ].slice(0, 5);

    setSearchHistory(updatedHistory);
    try {
      localStorage.setItem('weather_search_history', JSON.stringify(updatedHistory));
    } catch {
      // ignore
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (results.length > 0) {
        handleSelect(results[0]);
      } else if (searchHistory.length > 0 && (!query || query.trim().length < 2)) {
        handleSelect(searchHistory[0]);
      }
    }
  };

  const togglePinQuickCity = (city: GeocodingResult, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isPinned = quickCities.some((c) => c.name.toLowerCase() === city.name.toLowerCase());
    let updated: GeocodingResult[];
    if (isPinned) {
      updated = quickCities.filter((c) => c.name.toLowerCase() !== city.name.toLowerCase());
    } else {
      updated = [...quickCities, city];
    }
    setQuickCities(updated);
    try {
      localStorage.setItem('weather_quick_cities', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCurrentLocation = () => {
    setLocationNotice(null);
    if (!navigator.geolocation) {
      setLocationNotice('Geolocation is not supported by your browser. Please select a city from the quick bar or search bar.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const locName = await reverseGeocode(lat, lon);
          onSelectCoordinates(lat, lon, locName);
        } catch {
          onSelectCoordinates(lat, lon, `Your Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`);
        } finally {
          setIsLocating(false);
          setIsOpen(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Location permission was denied or unavailable. Showing current selected city weather. Select any city from the quick bar or search bar to view weather.';
        if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. You can pick any city from the quick bar or search bar below.';
        }
        setLocationNotice(msg);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3" ref={containerRef}>
      {/* Non-intrusive Location Access / Status Banner */}
      {locationNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-sm animate-fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Location Access Note</span>
              <span>{locationNotice}</span>
            </div>
          </div>
          <button
            onClick={() => setLocationNotice(null)}
            className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 p-1 rounded-lg transition"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Search Input */}
      <div className="relative">
        <div className="relative flex items-center shadow-lg shadow-slate-200/50 dark:shadow-none rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 transition-all focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 overflow-hidden">
          <div className="pl-4 text-slate-400 dark:text-slate-500 pointer-events-none">
            {isSearching || isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search city name (e.g. London, Tokyo, San Francisco)..."
            className="w-full py-3.5 pl-3 pr-28 text-sm sm:text-base bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer"
              title="Detect current location"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">My Location</span>
            </button>
          </div>
        </div>

        {/* Dropdown Suggestions */}
        {isOpen && (query.trim().length >= 2 || searchHistory.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden max-h-80 overflow-y-auto">
            {/* Search Results */}
            {query.trim().length >= 2 && (
              <div className="p-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Suggestions ({results.length})
                </div>

                {isSearching ? (
                  <div className="flex items-center justify-center p-6 text-sm text-slate-500 gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                    Searching Open-Meteo locations...
                  </div>
                ) : errorMsg ? (
                  <div className="p-4 text-center text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-xl my-1">
                    {errorMsg}
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((city) => {
                      const isPinned = quickCities.some(
                        (c) => c.name.toLowerCase() === city.name.toLowerCase()
                      );
                      return (
                        <div
                          key={`${city.id}-${city.latitude}-${city.longitude}`}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-700/60 transition group cursor-pointer"
                          onClick={() => handleSelect(city)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-slate-700 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                {city.name}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {[city.admin1, city.country].filter(Boolean).join(', ')}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {city.country_code && (
                              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                {city.country_code}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => togglePinQuickCity(city, e)}
                              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                                isPinned
                                  ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30'
                                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                              }`}
                              title={isPinned ? 'Pinned to Quick Bar' : 'Pin to Quick Bar'}
                            >
                              {isPinned ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-sky-500" />
                                  <span className="text-[11px] font-semibold">Pinned</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span className="text-[11px]">Pin</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            )}

            {/* Recent Searches */}
            {searchHistory.length > 0 && (!query || query.trim().length < 2) && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <History className="w-3.5 h-3.5" /> Recent Searches
                  </span>
                  <button
                    onClick={() => {
                      setSearchHistory([]);
                      localStorage.removeItem('weather_search_history');
                    }}
                    className="text-[10px] hover:text-rose-500 transition lowercase"
                  >
                    clear
                  </button>
                </div>
                <div className="space-y-1">
                  {searchHistory.map((city) => (
                    <button
                      key={`hist-${city.id}`}
                      onClick={() => handleSelect(city)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 text-left text-sm text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        <span>{city.name}</span>
                        <span className="text-xs text-slate-400">
                          ({[city.admin1, city.country].filter(Boolean).join(', ')})
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick City Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 shrink-0">
          <Compass className="w-3.5 h-3.5 text-sky-500" /> Quick Bar:
        </span>
        {quickCities.slice(0, 5).map((c) => {
          const isActive =
            selectedCityName &&
            (selectedCityName.toLowerCase() === c.name.toLowerCase() ||
              selectedCityName.toLowerCase().includes(c.name.toLowerCase()) ||
              c.name.toLowerCase().includes(selectedCityName.toLowerCase()));
          return (
            <div key={`quick-${c.name}-${c.id}-${c.latitude}`} className="relative shrink-0 group/pill flex items-center">
              <button
                onClick={() => handleSelect(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 border border-sky-400'
                    : 'bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700/80 shadow-sm'
                }`}
              >
                {isActive && <Check className="w-3 h-3 text-white" />}
                <span>{c.name}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};


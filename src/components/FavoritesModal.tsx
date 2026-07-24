import React from 'react';
import { GeocodingResult } from '../types';
import { Bookmark, MapPin, Trash2, X, ChevronRight } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: GeocodingResult[];
  onSelectFavorite: (city: GeocodingResult) => void;
  onRemoveFavorite: (cityId: number) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectFavorite,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-lg w-full p-6 space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Saved Locations ({favorites.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quick access to your favorite bookmarked cities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Locations List */}
        {favorites.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 mx-auto flex items-center justify-center text-slate-400">
              <Bookmark className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No saved locations yet
            </div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Click the bookmark button on any city forecast card to add it to your quick-access favorites list.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {favorites.map((city, idx) => (
              <div
                key={`fav-${city.id ?? idx}-${city.name}-${city.latitude}-${city.longitude}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 hover:border-sky-300 dark:hover:border-sky-600 transition group"
              >
                <button
                  onClick={() => {
                    onSelectFavorite(city);
                    onClose();
                  }}
                  className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-white transition">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {city.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onRemoveFavorite(city.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectFavorite(city);
                      onClose();
                    }}
                    className="p-2 text-slate-400 group-hover:text-sky-500 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

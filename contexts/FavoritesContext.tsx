import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { getProductByIdFromBackend } from '../services/backendApi';

const STORAGE_KEY = '@duply_favorites';

export interface FavoriteItem {
  id: string;
  kind?: 'product' | 'comparison';
  originalId?: string;
  dupeProductId?: string;
  originalName: string;
  originalBrand: string;
  originalPrice: number;
  originalImage: string;
  dupeName: string;
  dupeBrand: string;
  dupePrice: number;
  dupeImage: string;
  similarity: number;
  matchReason?: string;
  savings: number;
  savedAt: number;
}

export interface FavoritesContextValue {
  favorites: FavoriteItem[];
  loaded: boolean;
  addFavorite: (item: Omit<FavoriteItem, 'savedAt'>) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: Omit<FavoriteItem, 'savedAt'>) => void;
}

export const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: [],
  loaded: false,
  addFavorite: () => {},
  removeFavorite: () => {},
  clearFavorites: () => {},
  isFavorite: () => false,
  toggleFavorite: () => {},
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const parsed = JSON.parse(json) as FavoriteItem[];
          setFavorites(parsed.map(item => ({
            kind: item.kind || (item.dupeProductId ? 'comparison' : 'product'),
            ...item,
          })));
        }
      } catch {
        // Storage unavailable
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (items: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Persist error
    }
  }, []);

  useEffect(() => {
    if (!loaded || favorites.length === 0) {
      return;
    }

    let cancelled = false;

    const pruneUnavailableFavorites = async () => {
      try {
        const checks = await Promise.all(
          favorites.map(async item => {
            if ((item.kind || 'comparison') === 'comparison') {
              const [original, dupe] = await Promise.all([
                item.originalId ? getProductByIdFromBackend(item.originalId) : Promise.resolve(null),
                item.dupeProductId ? getProductByIdFromBackend(item.dupeProductId) : Promise.resolve(null),
              ]);
              return Boolean(original && dupe);
            }

            return item.originalId ? Boolean(await getProductByIdFromBackend(item.originalId)) : true;
          })
        );

        if (cancelled || checks.every(Boolean)) {
          return;
        }

        setFavorites(prev => {
          const updated = prev.filter((_, index) => checks[index]);
          void persist(updated);
          return updated;
        });
      } catch {
        // Best-effort cleanup only.
      }
    };

    void pruneUnavailableFavorites();

    return () => {
      cancelled = true;
    };
  }, [favorites, loaded, persist]);

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'savedAt'>) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === item.id)) return prev;
      const updated = [{ ...item, savedAt: Date.now() }, ...prev];
      persist(updated);
      return updated;
    });
  }, [persist]);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.id !== id);
      persist(updated);
      return updated;
    });
  }, [persist]);

  const clearFavorites = useCallback(() => {
    setFavorites(() => {
      persist([]);
      return [];
    });
  }, [persist]);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(f => f.id === id);
  }, [favorites]);

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'savedAt'>) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, loaded, addFavorite, removeFavorite, clearFavorites, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

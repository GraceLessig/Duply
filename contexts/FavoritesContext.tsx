import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@duply_favorites';

export interface FavoriteItem {
  id: string;
  originalName: string;
  originalBrand: string;
  originalPrice: number;
  originalImage: string;
  dupeName: string;
  dupeBrand: string;
  dupePrice: number;
  dupeImage: string;
  similarity: number;
  savings: number;
  savedAt: number;
}

export interface FavoritesContextValue {
  favorites: FavoriteItem[];
  loaded: boolean;
  addFavorite: (item: Omit<FavoriteItem, 'savedAt'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: Omit<FavoriteItem, 'savedAt'>) => void;
}

export const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: [],
  loaded: false,
  addFavorite: () => {},
  removeFavorite: () => {},
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
        if (json) setFavorites(JSON.parse(json));
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
      value={{ favorites, loaded, addFavorite, removeFavorite, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

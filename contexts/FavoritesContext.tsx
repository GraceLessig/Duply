import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { getProductByIdFromBackend } from '../services/backendApi';

const STORAGE_KEY = '@duply_favorites';

export interface FavoriteItem {
  id: string;
  originalId?: string;
  originalName: string;
  originalBrand: string;
  originalPrice: number;
  originalImage: string;
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

function normalizeFavorite(item: any): FavoriteItem | null {
  const kind = item?.kind || (item?.dupeProductId ? 'comparison' : 'product');
  if (kind !== 'product') {
    return null;
  }

  const id = String(item?.originalId || item?.id || '').trim();
  const originalName = String(item?.originalName || '').trim();
  const originalBrand = String(item?.originalBrand || '').trim();

  if (!id || !originalName || !originalBrand) {
    return null;
  }

  return {
    id,
    originalId: id,
    originalName,
    originalBrand,
    originalPrice: Number(item?.originalPrice || 0),
    originalImage: String(item?.originalImage || '').trim(),
    savings: Number(item?.savings || 0),
    savedAt: Number(item?.savedAt || Date.now()),
  };
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const persist = useCallback(async (items: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Persist error
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const parsed = JSON.parse(json) as any[];
          const normalized = parsed
            .map(normalizeFavorite)
            .filter((item): item is FavoriteItem => Boolean(item));
          setFavorites(normalized);
          if (normalized.length !== parsed.length) {
            void persist(normalized);
          }
        }
      } catch {
        // Storage unavailable
      } finally {
        setLoaded(true);
      }
    })();
  }, [persist]);

  useEffect(() => {
    if (!loaded || favorites.length === 0) {
      return;
    }

    let cancelled = false;

    const pruneUnavailableFavorites = async () => {
      try {
        const checks = await Promise.all(
          favorites.map(async item => {
            const productId = item.originalId || item.id;
            return productId ? Boolean(await getProductByIdFromBackend(productId)) : false;
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
      if (prev.some(favorite => favorite.id === item.id)) {
        return prev;
      }
      const updated = [{ ...item, savedAt: Date.now() }, ...prev];
      void persist(updated);
      return updated;
    });
  }, [persist]);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(item => item.id !== id);
      void persist(updated);
      return updated;
    });
  }, [persist]);

  const clearFavorites = useCallback(() => {
    setFavorites(() => {
      void persist([]);
      return [];
    });
  }, [persist]);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(item => item.id === id);
  }, [favorites]);

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'savedAt'>) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  }, [addFavorite, isFavorite, removeFavorite]);

  return (
    <FavoritesContext.Provider value={{ favorites, loaded, addFavorite, removeFavorite, clearFavorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

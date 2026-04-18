import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { Product } from '../services/api';
import { getProductByIdFromBackend, seedProductCache } from '../services/backendApi';

const SEARCHES_KEY = '@duply_recent_searches';
const VIEWS_KEY = '@duply_recent_views';

export interface ActivityContextValue {
  recentSearches: string[];
  recentViews: Product[];
  loaded: boolean;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  addRecentView: (product: Product) => void;
  removeRecentView: (productId: string) => void;
  clearRecentViews: () => void;
}

export const ActivityContext = createContext<ActivityContextValue>({
  recentSearches: [],
  recentViews: [],
  loaded: false,
  addRecentSearch: () => {},
  removeRecentSearch: () => {},
  clearRecentSearches: () => {},
  addRecentView: () => {},
  removeRecentView: () => {},
  clearRecentViews: () => {},
});

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentViews, setRecentViews] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [searchesJson, viewsJson] = await Promise.all([
          AsyncStorage.getItem(SEARCHES_KEY),
          AsyncStorage.getItem(VIEWS_KEY),
        ]);

        if (searchesJson) {
          setRecentSearches(JSON.parse(searchesJson));
        }

        if (viewsJson) {
          const parsedViews = JSON.parse(viewsJson) as Product[];
          const storedViews = parsedViews
            .filter((product): product is Product => Boolean(product?.id))
            .slice(0, 12);

          if (storedViews.length > 0) {
            storedViews.forEach(seedProductCache);
            setRecentViews(storedViews);
          }

          void Promise.all(
            storedViews.map(async product => {
              try {
                return await getProductByIdFromBackend(product.id);
              } catch {
                return product;
              }
            })
          ).then(validViews => {
            const sanitizedViews = validViews.filter((product): product is Product => Boolean(product));
            setRecentViews(prev => {
              const nextViews = sanitizedViews.length > 0 ? sanitizedViews : prev;
              if (JSON.stringify(nextViews) !== JSON.stringify(prev)) {
                void AsyncStorage.setItem(VIEWS_KEY, JSON.stringify(nextViews));
              }
              return nextViews;
            });
          }).catch(() => {
            // Best-effort refresh only.
          });
        }
      } catch {
        // Storage unavailable
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persistSearches = useCallback(async (items: string[]) => {
    try {
      await AsyncStorage.setItem(SEARCHES_KEY, JSON.stringify(items));
    } catch {
      // Persist error
    }
  }, []);

  const persistViews = useCallback(async (items: Product[]) => {
    try {
      await AsyncStorage.setItem(VIEWS_KEY, JSON.stringify(items));
    } catch {
      // Persist error
    }
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    const value = query.trim();
    if (!value) return;

    setRecentSearches(prev => {
      const updated = [value, ...prev.filter(item => item !== value)].slice(0, 10);
      persistSearches(updated);
      return updated;
    });
  }, [persistSearches]);

  const removeRecentSearch = useCallback((query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(item => item !== query);
      persistSearches(updated);
      return updated;
    });
  }, [persistSearches]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches(() => {
      persistSearches([]);
      return [];
    });
  }, [persistSearches]);

  const addRecentView = useCallback((product: Product) => {
    if (!product?.id) return;
    seedProductCache(product);

    setRecentViews(prev => {
      const productKey = product.variantGroupId || product.id;
      const updated = [
        product,
        ...prev.filter(item => (item.variantGroupId || item.id) !== productKey),
      ].slice(0, 12);
      persistViews(updated);
      return updated;
    });
  }, [persistViews]);

  const removeRecentView = useCallback((productId: string) => {
    setRecentViews(prev => {
      const updated = prev.filter(item => item.id !== productId && item.variantGroupId !== productId);
      persistViews(updated);
      return updated;
    });
  }, [persistViews]);

  const clearRecentViews = useCallback(() => {
    setRecentViews(() => {
      persistViews([]);
      return [];
    });
  }, [persistViews]);

  return (
    <ActivityContext.Provider
      value={{
        recentSearches,
        recentViews,
        loaded,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
        addRecentView,
        removeRecentView,
        clearRecentViews,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

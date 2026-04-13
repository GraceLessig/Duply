import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category, Dupe, Product } from '../services/api';
import { dataService } from '../services/api';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAsync<T>(fetcher: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState(prev => ({ ...prev, loading: true, error: null }));
    fetcher()
      .then(data => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message });
      });
    return () => { cancelled = true; };
  }, deps);

  return state;
}

export function useFeaturedDupes() {
  return useAsync<Dupe[]>(() => dataService.getFeaturedDupes(), []);
}

export function useCategories() {
  return useAsync<Category[]>(() => dataService.getCategories(), []);
}

export function useProductsByCategory(category: string) {
  return useAsync<Product[]>(
    () => dataService.getProductsByCategory(category),
    [category],
  );
}

export function useProduct(id: string) {
  return useAsync<Product | null>(
    () => dataService.getProductById(id),
    [id],
  );
}

export function useDupes(product: Product | null) {
  return useAsync<Dupe[]>(
    () => (product ? dataService.findDupes(product) : Promise.resolve([])),
    [product?.id],
  );
}

export function useSearch() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await dataService.searchProducts(query);
        setResults(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 150);
  }, []);

  return { results, loading, error, search };
}

import { useCallback, useEffect, useState } from 'react';

export const useAsyncList = <T>(loader: () => Promise<T[]>) => {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setItems(await loader());
    } catch (err) {
      setError(err && typeof err === 'object' && 'message' in err ? String((err as { message?: string }).message) : 'Request failed');
    } finally {
      setIsLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, isLoading, error, reload };
};

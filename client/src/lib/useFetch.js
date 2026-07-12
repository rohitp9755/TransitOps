import { useCallback, useEffect, useState } from 'react';

/**
 * Minimal data-fetching hook: runs `fetcher`, tracks loading/error/data, and
 * exposes `refetch`. `deps` re-runs the fetch (e.g. when filters change).
 * Keeps every list page free of repetitive useState/useEffect boilerplate.
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, error, loading, refetch: run };
}

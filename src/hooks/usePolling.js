import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * usePolling
 * Calls `fetchFn` immediately, then every `intervalMs`. Exposes data,
 * loading (initial only), error, lastUpdated, and a manual refresh().
 * Pauses while the tab is hidden to avoid wasted requests.
 */
export function usePolling(fetchFn, { intervalMs = 15000, enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const timerRef = useRef(null);
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const run = useCallback(async (isInitial = false) => {
    if (document.hidden) return;
    try {
      const result = await fetchFnRef.current();
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => run(false), [run]);

  useEffect(() => {
    if (!enabled) return;
    run(true);
    timerRef.current = setInterval(() => run(false), intervalMs);
    return () => clearInterval(timerRef.current);
  }, [enabled, intervalMs, run]);

  return { data, loading, error, lastUpdated, refresh };
}

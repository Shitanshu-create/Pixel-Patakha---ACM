import { useState, useEffect, useCallback, useRef } from 'react';

export default function useAsync(asyncFunction, immediate = true, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Store asyncFunction in a ref so function identity changes do not trigger re-fetches
  const fnRef = useRef(asyncFunction);
  useEffect(() => {
    fnRef.current = asyncFunction;
  });

  // Track the latest execution to ignore stale out-of-order responses
  const callIdRef = useRef(0);

  const execute = useCallback(async (...params) => {
    const currentCallId = ++callIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await fnRef.current(...params);
      if (currentCallId === callIdRef.current) {
        setData(response);
      }
      return response;
    } catch (err) {
      if (currentCallId === callIdRef.current) {
        setError(err);
      }
      throw err;
    } finally {
      if (currentCallId === callIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, ...dependencies]);

  return { execute, data, loading, error, setData, refetch: execute };
}

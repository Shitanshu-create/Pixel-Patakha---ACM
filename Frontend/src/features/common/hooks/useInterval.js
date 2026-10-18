import { useEffect, useRef } from 'react';

export const useInterval = (callback, delay, options = { pauseWhenHidden: true }) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || delay === undefined) return;

    let id;

    const tick = () => {
      if (options.pauseWhenHidden && document.visibilityState === 'hidden') {
        return;
      }
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay, options.pauseWhenHidden]);
};

export default useInterval;

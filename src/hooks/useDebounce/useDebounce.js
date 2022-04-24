import { useCallback, useEffect, useRef } from "react";

const useDebounce = (callback, time) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const timeoutRef = useRef(-1);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [timeoutRef]);

  return useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, time);
    },
    [time, timeoutRef, callbackRef]
  );
};

export default useDebounce;

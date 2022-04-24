import { useEffect, useRef } from "react";

const useScrollEvent = (elementRef, callback) => {
  const callBackRef = useRef(callback);

  callBackRef.current = callback;

  useEffect(() => {
    const element = elementRef.current;
    const handler = () => {
      callBackRef.current(elementRef.current);
    };

    if (element) {
      element.addEventListener("scroll", handler);
    }
    return () => {
      if (element) {
        element.removeEventListener("scroll", handler);
      }
    };
  }, [elementRef, callBackRef]);
};

export default useScrollEvent;

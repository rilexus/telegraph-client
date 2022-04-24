import { useState } from "react";
import { useScrollEvent } from "../useScrollEvent";

const useScrollPosition = (ref) => {
  const [position, setPosition] = useState(() => {
    if (ref.current) {
      return ref.current.scrollTop;
    }
    return 0;
  });

  useScrollEvent(ref, (element) => {
    if (element) {
      setPosition(element.scrollTop);
    }
  });

  return position;
};

export default useScrollPosition;

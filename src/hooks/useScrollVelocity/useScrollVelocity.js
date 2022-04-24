import { useRef, useState } from "react";
import { useScrollEvent } from "../useScrollEvent";
import { useDebounce } from "../useDebounce";
import { useThrottle } from "../useThrottle";

const useScrollVelocity = (ref) => {
  const [velocity, setVelocity] = useState(0);

  const prevPositionRef = useRef(0);
  const timeRef = useRef(Date.now());

  const clear = useDebounce(() => {
    setVelocity(0);
  }, 50);

  const th = useThrottle((e) => {
    const now = Date.now();
    const currentPos = e.scrollTop;

    const velocity =
      (currentPos - prevPositionRef.current) / (now - timeRef.current);

    prevPositionRef.current = currentPos;
    timeRef.current = now;

    setVelocity(velocity);

    clear();
  }, 16);

  useScrollEvent(ref, th);

  return velocity;
};

export default useScrollVelocity;

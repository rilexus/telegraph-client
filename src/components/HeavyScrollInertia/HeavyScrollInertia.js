import { ScrollInertia } from "../ScrollInertia";
import React from "react";

const HeavyScrollInertia = ({ velocity, children }) => {
  return (
    <ScrollInertia
      timeout={200}
      velocity={velocity}
      deltaSpeed={[0.9, 1.5]}
      translation={10}
    >
      {children}
    </ScrollInertia>
  );
};

export default HeavyScrollInertia;

import { ScrollInertia } from "../ScrollInertia";
import React from "react";

const LightScrollInertia = ({ velocity, children }) => {
  return (
    <ScrollInertia
      timeout={70}
      velocity={velocity}
      deltaSpeed={[0.2, 0.5]}
      translation={10}
    >
      {children}
    </ScrollInertia>
  );
};

export default LightScrollInertia;

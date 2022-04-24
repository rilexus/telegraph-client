import { ScrollInertia } from "../ScrollInertia";
import React from "react";

const NormalScrollInertia = ({ velocity, children }) => {
  return (
    <ScrollInertia
      timeout={150}
      velocity={velocity}
      deltaSpeed={[0.7, 1.3]}
      translation={15}
    >
      {children}
    </ScrollInertia>
  );
};

export default NormalScrollInertia;

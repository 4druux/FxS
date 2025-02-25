import React, { forwardRef } from "react";
import { motion, useAnimation } from "framer-motion";

const MagneticButton = forwardRef((props, ref) => {
  const fillControls = useAnimation();

  const handleMouseEnter = () => {
    fillControls.start({
      y: ["80%", "-10%"],
      transition: {
        ease: [0.19, 1, 0.22, 1],
        duration: 1.7,
      },
    });
  };

  const handleMouseLeave = () => {
    fillControls.start({
      y: "-80%",
      transition: {
        ease: [0.19, 1, 0.22, 1],
        duration: 1.7,
      },
    });
  };

  return (
    <a
      ref={ref}
      href={props.href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-flex items-center justify-center px-12 py-4 m-4 text-sm font-medium tracking-wider text-white 
                 bg-teal-950 border border-teal-600 rounded-full overflow-hidden transition-all duration-700 ease-in-out 
                 cursor-pointer group hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
    >
      <span className="relative z-10">
        <motion.span
          className="block relative overflow-hidden transition-transform duration-700 ease-in-out group-hover:scale-110"
          data-text={props.children}
        >
          {props.children}
        </motion.span>
      </span>
      <motion.div
        animate={fillControls}
        className="absolute top-[-50%] left-[-25%] w-[150%] h-[250%] bg-gradient-to-r from-emerald-500 to-teal-600 
        rounded-[50%] pointer-events-none z-0 translate-y-[80%]"
      />
    </a>
  );
});

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;

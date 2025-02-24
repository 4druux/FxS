// components/CreativeButton/index.jsx
import { motion } from "framer-motion";
import "./style.scss";
import { useState } from "react";

export default function CreativeButton({
  label = "OUR WORK",
  hoverLabel = "EXPLORE",
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="label">{label}</div>
      <motion.div
        className="hover-background"
        initial={{ y: "100%" }}
        animate={{
          y: isHovered ? "0%" : "100%"
        }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="hover-label">{hoverLabel}</div>
      </motion.div>
    </div>
  );
}
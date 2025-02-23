"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { text, curve, translate } from "./anim";
import "./style.scss";

const routes = {
  "/": "Home",
  "/about": "About",
  "/projects": "Projects",
  "/contact": "Contact",
};

const animationProps = (variants) => ({
  variants,
  initial: "initial",
  animate: "enter",
  exit: "exit",
});

export default function PageTransitionCurve({
  children,
  backgroundColor,
  onComplete,
}) {
  const pathname = usePathname();
  const [dimensions, setDimensions] = useState({
    width: null,
    height: null,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="page-transition-curve" style={{ backgroundColor }}>
      <div
        style={{ opacity: dimensions.width == null ? 1 : 0 }}
        className="page-transition-background"
      />
      <motion.p className="page-transition-route" {...animationProps(text)}>
        {routes[pathname]}
      </motion.p>
      {dimensions.width != null && (
        <TransitionCurveSVG
          {...dimensions}
          backgroundColor={backgroundColor}
          onComplete={onComplete}
        />
      )}
      {children}
    </div>
  );
}

const TransitionCurveSVG = ({ height, width, backgroundColor, onComplete }) => {
  const initialPath = `
        M0 300 
        Q${width / 2} 0 ${width} 300
        L${width} ${height + 300}
        Q${width / 2} ${height + 600} 0 ${height + 300}
        L0 0
    `;
  const targetPath = `
        M0 300
        Q${width / 2} 0 ${width} 300
        L${width} ${height}
        Q${width / 2} ${height} 0 ${height}
        L0 0
    `;

  return (
    <motion.svg
      className="page-transition-svg"
      {...animationProps(translate)}
      onAnimationComplete={onComplete} // Tambahkan event ini
    >
      <motion.path
        {...animationProps(curve(initialPath, targetPath))}
        fill={backgroundColor}
      />
    </motion.svg>
  );
};

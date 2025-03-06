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
  "/login": "Login",
  "/register": "Register",
  "/profile": "My Profile",
  "/orders": "My Orders",
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
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: null,
    height: null,
  });

  useEffect(() => {
    setIsTransitioning(true);

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
  }, [pathname]);

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    if (onComplete) onComplete();
  };

  return (
    <div
      className="page-transition-curve"
      style={{
        backgroundColor,
        zIndex: isTransitioning ? 9999 : -1,
      }}
    >
      <div
        style={{
          opacity: dimensions.width == null ? 1 : 0,
          zIndex: isTransitioning ? 49 : -1,
        }}
        className="page-transition-background"
      />
      <motion.div
        className="page-transition-route"
        {...animationProps(text)}
        style={{
          zIndex: isTransitioning ? 51 : -1,
        }}
      >
        <span className="bullet">•</span>
        <span className="route-text">{routes[pathname]}</span>
      </motion.div>
      {dimensions.width != null && (
        <TransitionCurveSVG
          {...dimensions}
          backgroundColor={backgroundColor}
          onComplete={handleTransitionComplete}
          isTransitioning={isTransitioning}
        />
      )}
      {children}
    </div>
  );
}

const TransitionCurveSVG = ({
  height,
  width,
  backgroundColor,
  onComplete,
  isTransitioning,
}) => {
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
      onAnimationComplete={onComplete}
      style={{
        zIndex: isTransitioning ? 50 : -1,
      }}
    >
      <motion.path
        {...animationProps(curve(initialPath, targetPath))}
        fill={backgroundColor}
      />
    </motion.svg>
  );
};

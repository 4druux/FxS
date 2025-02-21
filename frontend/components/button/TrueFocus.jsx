"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const TrueFocus = ({
  sentence = "True Focus",
  manualMode = false,
  blurAmount = 5,
  borderColor = "teal",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  textColor = "white",
}) => {
  const words = sentence.split(" ");
  // Tambahkan state untuk mengecek client-side mounting
  const [isMounted, setIsMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const animationInterval = useRef(null);

  // Tambahkan useEffect untuk mengatur isMounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Modifikasi useEffect lainnya
  useEffect(() => {
    if (!isMounted) return; // Tambahkan pengecekan

    if (!manualMode && !isHovered) {
      animationInterval.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, (animationDuration + pauseBetweenAnimations) * 1000);
    }
    return () => clearInterval(animationInterval.current);
  }, [
    isMounted,
    manualMode,
    isHovered,
    animationDuration,
    pauseBetweenAnimations,
    words.length,
  ]);

  useEffect(() => {
    if (!isMounted) return; // Tambahkan pengecekan
    if (currentIndex === null || currentIndex === -1) return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();
    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length, isMounted]);

  // Jika belum mounted, return null atau loading state
  if (!isMounted) {
    return null; // atau loading component
  }

  const handleMouseEnter = (index) => {
    setIsHovered(true);
    clearInterval(animationInterval.current);
    setCurrentIndex(index);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!manualMode) {
      animationInterval.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, (animationDuration + pauseBetweenAnimations) * 1000);
    }
  };

  return (
    <div
      className="relative flex gap-4 justify-center items-center flex-wrap"
      ref={containerRef}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => (wordRefs.current[index] = el)}
            className="relative text-[1.4rem] font-black cursor-pointer"
            style={{
              color: textColor, // Menggunakan warna teks dari properti
              filter: `blur(${isActive ? 0 : blurAmount}px)`,
              "--border-color": borderColor,
              "--glow-color": glowColor,
              transition: `filter ${animationDuration}s ease`, // Transisi hanya untuk filter
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}
      {/* Kotak fokus (motion.div) */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-none box-border border-0"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0, // Kontrol opasitas
        }}
        transition={{
          duration: animationDuration,
        }}
        style={{
          "--border-color": borderColor,
          "--glow-color": glowColor,
        }}
      >
        {/* ... (kode untuk sudut-sudut kotak fokus) ... */}
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] left-[-10px] border-r-0 border-b-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        ></span>
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] right-[-10px] border-l-0 border-b-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        ></span>
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] left-[-10px] border-r-0 border-t-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        ></span>
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] right-[-10px] border-l-0 border-t-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        ></span>
      </motion.div>
    </div>
  );
};

export default TrueFocus;

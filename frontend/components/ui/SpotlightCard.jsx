import { useRef, useState } from "react";

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.25)",
}) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => {
        setIsHovered(true); 
        setOpacity(0.6);
      }}
      onMouseLeave={() => {
        setIsHovered(false); 
        setOpacity(0);
      }}
      className={`relative rounded-3xl border border-neutral-800 bg-neutral-900 overflow-hidden p-4 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* SVG untuk animasi 1 garis border neon */}
      {isHovered && (
        <svg className="absolute inset-0 w-full h-full">
          <rect
            x="2"
            y="2"
            width="calc(100% - 4px)"
            height="calc(100% - 4px)"
            rx="16"
            ry="16"
            stroke="cyan"
            strokeWidth="1"
            fill="transparent"
            strokeDasharray="200 600"
            strokeDashoffset="0"
            className="neon-border"
          />
        </svg>
      )}

      {children}
    </div>
  );
};


export default SpotlightCard;

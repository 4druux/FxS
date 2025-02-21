"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";

export function WorldMapUi({ dots = [], lineColor = "#14b8a6" }) {
  const svgRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [svgMap, setSvgMap] = useState(null);

  useEffect(() => {
    const map = new DottedMap({ height: 100, grid: "diagonal" });
    const svg = map.getSVG({
      radius: 0.22,
      color: "#FFFFFF40",
      shape: "circle",
      backgroundColor: "#121212",
    });
    setSvgMap(svg);
    setIsMounted(true);
  }, []);

  const projectPoint = (lat, lng) => {
    if (!lat || !lng) return { x: 0, y: 0 };
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (start, end) => {
    if (!start || !end) return "";
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  if (!isMounted || !svgMap) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full relative font-sans overflow-hidden ">
      <div className="relative w-full h-full">
        <Image
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="h-full w-full pointer-events-none select-none"
          alt="world map"
          height="495"
          width="1056"
          draggable={false}
        />

        <svg
          ref={svgRef}
          viewBox="0 0 800 400"
          className="w-full h-full absolute inset-0 pointer-events-none select-none"
        >
          {dots.map((dot, i) => {
            // Tambahkan pengecekan untuk dot.start dan dot.end
            if (
              !dot?.start?.lat ||
              !dot?.start?.lng ||
              !dot?.end?.lat ||
              !dot?.end?.lng
            ) {
              return null;
            }

            const startPoint = projectPoint(dot.start.lat, dot.start.lng);
            const endPoint = projectPoint(dot.end.lat, dot.end.lng);

            return (
              <motion.path
                key={`path-${i}`}
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="0."
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 * i, ease: "easeOut" }}
              />
            );
          })}
          <defs>
            <linearGradient
              id="path-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
              <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          {dots.map((dot, i) => {
            // Tambahkan pengecekan untuk dot
            if (!dot?.start || !dot?.end) return null;

            return (
              <g key={`points-group-${i}`}>
                {[dot.start, dot.end].map((point, idx) => {
                  if (!point?.lat || !point?.lng) return null;
                  const { x, y } = projectPoint(point.lat, point.lng);
                  return (
                    <g key={`${idx}-${i}`}>
                      <circle cx={x} cy={y} r="2" fill={lineColor} />
                      <circle
                        cx={x}
                        cy={y}
                        r="2"
                        fill={lineColor}
                        opacity="0.5"
                      >
                        <animate
                          attributeName="r"
                          from="2"
                          to="15"
                          dur="1.5s"
                          begin="0s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.5"
                          to="0"
                          dur="1.5s"
                          begin="0s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Gradient overlay */}
        <div
          className="absolute bottom-0 left-0 w-full pointer-events-none"
          style={{
            height: "100%",
            background:
              "linear-gradient(to top, #121212 0%, rgba(18, 18, 18, 0.9) 20%, rgba(18, 18, 18, 0.7) 40%, rgba(18, 18, 18, 0.4) 60%, rgba(18, 18, 18, 0.1) 80%, rgba(18, 18, 18, 0) 100%)",
          }}
        />
      </div>
    </div>
  );
}

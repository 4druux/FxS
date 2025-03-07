"use client";
import { useEffect } from "react";

const LocomotiveLayout = ({ children }) => {
  useEffect(() => {
    const loadLocomotiveScroll = async () => {
      const locomotiveScroll = (await import("locomotive-scroll")).default;
      new locomotiveScroll();
    };
    loadLocomotiveScroll();
  }, []);

  return <div className="h-full overflow-x-hidden">{children}</div>;
};

export default LocomotiveLayout;

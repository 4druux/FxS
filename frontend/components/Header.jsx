"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ShinyBorder from "./button/ShinyBorder";

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const [navSize, setNavSize] = useState(1);
  const [isDynamic, setIsDynamic] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      let newSize = 1 - Math.min(currentScrollY / 300, 0.7);
      setNavSize(newSize);
      setIsDynamic(currentScrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/contact", label: "Contact" },
  ];

  const getTransitionStyles = () => ({
    width: isDynamic ? "600px" : "75%",
    top: isDynamic ? "15px" : "15px",
    borderRadius: isDynamic ? "30px" : "30px",
    padding: isDynamic ? " 0px 20px" : "0px 20px",
    background: isDynamic ? "rgba(18, 18, 18, 0.4)" : "rgba(18, 18, 18, 0.4)",
    backdropFilter: isDynamic ? "blur(10px)" : "blur(10px)",
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid transparent",
    backgroundClip: "padding-box",
    boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
  });

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full"
        style={{
          opacity: isDynamic ? 1 : 1,
          zIndex: 50,
        }}
      />
      <div
        className="fixed"
        style={{
          ...getTransitionStyles(),
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
        }}
      >
        <div className="flex items-center justify-between h-full">
          <Link href="/">
            <Image
              src="/assets/about/dis.jpg"
              alt="logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
          <ul
            className="hidden sm:flex ml-4"
            style={{
              gap: "30px",
              fontSize: "14px",
            }}
          >
            {navLinks.map((link) => (
              <li key={link.path} className="relative">
                {pathname === link.path && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-600" />
                )}
                <Link
                  href={link.path}
                  className={`relative group p-1 ${
                    pathname === link.path
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.45,0,0.55,1)] group-hover:-translate-y-full">
                      {link.label}
                    </span>
                    <span className="absolute top-full left-0 inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                      {link.label}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-start md:gap-6 gap-4">
            <ShinyBorder
              text="FxS"
              disabled={false}
              speed={3}
              className="font-bold"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

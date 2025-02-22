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
    top: isDynamic ? "10px" : "10px",
    borderRadius: isDynamic ? "30px" : "30px",
    padding: isDynamic ? "8px 20px" : "8px 20px",
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
            className="hidden sm:flex ml-4 font-bold"
            style={{
              gap: "16px",
              fontSize: "14px",
            }}
          >
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`relative group px-2 py-1 ${
                    pathname === link.path
                      ? "text-teal-500/70 hover:text-teal-500"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span className="absolute left-2 -bottom-1 w-full h-0.5 bg-teal-500 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-50" />
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

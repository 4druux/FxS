"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShopContext } from "@/context/ShopContext";
import { useState, useEffect, useRef, useContext } from "react";
import ShinyText from "../text/ShinyText";
import {
  FaUser,
  FaSignOutAlt,
  FaUserCircle,
  FaClipboardList,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const [navSize, setNavSize] = useState(1);
  const [isDynamic, setIsDynamic] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const { isLoggedIn, user, logoutUser } = useContext(ShopContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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
    padding: isDynamic ? " 0px 25px" : "0px 25px",
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
          <Link href="/" prefetch>
            <ShinyText
              text="FxS"
              disabled={false}
              speed={3}
              className="tracking-widest text-md font-bold text-white/50"
            />
          </Link>
          <ul
            className="hidden sm:flex"
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
                  prefetch
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

          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <FaUser
              className={`w-5 h-5 mt-1 cursor-pointer ${
                isDropdownOpen ? "text-white" : "text-white/50"
              }`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 -left-16 mt-4 w-40 py-3 px-4 bg-neutral-900 border border-neutral-800
                  rounded-2xl shadow-lg"
                >
                  {isLoggedIn ? (
                    <>
                      {/* Hi, username! */}
                      <div className="text-sm text-white/70 px-2 pb-2 border-b border-neutral-700">
                        Hi, {user?.username || "User"}!
                      </div>

                      <Link
                        href="/profile"
                        prefetch
                        className="flex items-start gap-2 py-2 px-2 text-sm text-white/70 hover:text-white rounded-lg transition-colors duration-200 mt-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUserCircle className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        prefetch
                        className="flex items-start gap-2 py-2 px-2 text-sm text-white/70 hover:text-white rounded-lg transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaClipboardList className="w-4 h-4" />
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logoutUser();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-start gap-2 py-2 px-2 text-sm text-white/70 hover:text-white rounded-lg transition-colors duration-200"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        prefetch
                        className="flex items-start gap-2 py-2 px-2 text-sm text-white/70 hover:text-white rounded-lg transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaSignInAlt className="w-4 h-4" />
                        Login
                      </Link>
                      <Link
                        href="/register"
                        prefetch
                        className="flex items-start gap-2 py-2 px-2 text-sm text-white/70 hover:text-white rounded-lg transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUserPlus className="w-4 h-4" />
                        Register
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

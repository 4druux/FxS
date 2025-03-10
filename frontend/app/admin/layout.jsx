// app\admin\layout.jsx
"use client";
import { useState, useEffect, useRef, useContext } from "react";
import Sidebar from "@/components/1_admin/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "@/context/AuthContext";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  const { logoutUser } = useContext(AuthContext);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    logoutUser();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

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

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 transition-all duration-500 bg-[#121212]">
        {/* Navbar */}
        <div className="flex justify-between items-center p-4 shadow-sm bg-neutral-900 border-b border-neutral-800 fixed top-0 left-0 right-0 z-10">
          <button onClick={toggleSidebar} className="cursor-pointer">
            <BiMenuAltLeft className="w-7 h-7 text-white" />
          </button>

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
                  className="absolute z-50 right-0 mt-4 w-40 py-3 px-4 bg-neutral-900 border border-neutral-800
                  rounded-2xl shadow-lg"
                >
                  <button
                    onClick={() => alert("Pengaturan Akun")}
                    className="flex items-start gap-2 py-2 px-2 text-sm text-white/70 hover:text-white rounded-lg transition-colors duration-200"
                  >
                    <IoMdSettings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-start gap-2 py-2 px-2 text-sm text-white/70 hover:text-white rounded-lg transition-colors duration-200"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Konten Utama */}
        <div className="pt-16 mt-9 md:mt-16 px-4 sm:px-[6vw] md:px-[9vw] lg:px-[10vw]">
          {children}
        </div>
      </div>
    </div>
  );
}

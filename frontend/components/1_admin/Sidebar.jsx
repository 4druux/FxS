"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HomeIcon, PlusIcon, ClipboardListIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen, setIsSidebarOpen }) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin/dashboard", icon: HomeIcon, label: "Dashboard" },
    { href: "/admin/dashboard/add-product", icon: PlusIcon, label: "Add Product" },
    {
      href: "/admin/dashboard/list",
      icon: ClipboardListIcon,
      label: "Product Management",
    },
  ];

  const sidebarVariants = {
    hidden: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "tween",
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            key="sidebar"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-neutral-900 border-r border-neutral-800 backdrop-blur-lg rounded-r-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-neutral-800">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <img src={""} alt="Logo" className="w-40 h-auto" />
              </motion.div>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-800 transition-colors group"
              >
                <XIcon className="w-6 h-6 text-neutral-600 group-hover:text-neutral-400" />
              </motion.button>
            </div>

            {/* Menu Items */}
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-4 space-y-2"
              variants={{
                hidden: {
                  opacity: 0,
                  transition: {
                    staggerChildren: 0.05,
                    staggerDirection: -1,
                  },
                },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.2,
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all group  ${
                    pathname === item.href
                      ? "bg-neutral-800 text-neutral-200 shadow-lg"
                      : "hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          pathname === item.href
                            ? "text-white"
                            : "text-neutral-500 group-hover:text-neutral-200"
                        } transition-colors`}
                      />
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  </>
                </Link>
              ))}
            </motion.nav>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-0 left-0 right-0 p-6 text-center border-t border-neutral-800"
            >
              <p className="text-xs text-neutral-500">© 2024 Forever Fashion</p>
            </motion.div>
          </motion.div>

          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
}

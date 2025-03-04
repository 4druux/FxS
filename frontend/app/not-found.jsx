"use client";
import MagneticButton from "@/components/button/MagneticButton";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname(); // Dapetin URL yang user ketik

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-6xl font-extrabold"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-2 text-xl font-medium text-neutral-300"
        >
          Page Not Found!
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-4 text-neutral-400"
        >
          The page{" "}
          <span className="text-white tracking-wider">"{pathname}"</span> you are
          looking for may not be available. But don't worry, you can always
          return to the homepage.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.9,
            type: "spring",
            stiffness: 120,
          }}
          className="mt-6"
        >
          <MagneticButton href="/">Back to Home</MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-6 text-xs text-neutral-500"
      >
        Powered by FxS-Store Website 🚀
      </motion.div>
    </div>
  );
}

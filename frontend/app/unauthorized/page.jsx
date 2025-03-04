// app\unauthorized\page.jsx
"use client";

import MagneticButton from "@/components/button/MagneticButton";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-6xl font-extrabold">403</h1>
        <p className="mt-2 text-xl font-medium text-neutral-300">
          Forbidden Access
        </p>
        <p className="mt-4 text-neutral-400">
          You are not authorized to access this page.
        </p>

        <div className="mt-6">
          <MagneticButton href="/">Back to Home</MagneticButton>
        </div>
      </motion.div>

      <div className="absolute bottom-6 text-xs text-neutral-500">
        Powered by FxS-Store 🚀
      </div>
    </div>
  );
}

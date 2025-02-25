// app/client-layout.jsx
"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocomotiveLayout from "@/components/LocomotiveLayout";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <LocomotiveLayout key={`locomotive-${pathname}`}>
          {children}
        </LocomotiveLayout>
      </AnimatePresence>
      <Footer />
    </>
  );
}

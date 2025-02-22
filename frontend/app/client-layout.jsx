// app/client-layout.jsx
"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocomotiveLayout from "@/components/LocomotiveLayout";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/Curve";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Reset scroll position when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={pathname}>
          <LocomotiveLayout key={`locomotive-${pathname}`}>
            <main className="content">{children}</main>
          </LocomotiveLayout>
        </PageTransition>
      </AnimatePresence>
      <Footer />
    </>
  );
}

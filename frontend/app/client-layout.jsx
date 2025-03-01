// app/client-layout.jsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import LocomotiveLayout from "@/components/LocomotiveLayout";
import Footer from "@/components/Footer";
import { ShopProvider } from "@/context/ShopContext";
import useIsNotFound from "@/hooks/useIsNotFound";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isNotFound = useIsNotFound();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isAdminPage =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  return (
    <>
      <ShopProvider>
        {!isAdminPage && !isNotFound && <Header />}
        <AnimatePresence mode="wait" initial={false}>
          <LocomotiveLayout key={`locomotive-${pathname}`}>
            {children}
          </LocomotiveLayout>
        </AnimatePresence>
        {!isAdminPage && !isNotFound && <Footer />}
      </ShopProvider>
    </>
  );
}

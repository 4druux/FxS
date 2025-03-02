// hooks/useIsNotFound.js
"use client";
import { usePathname } from "next/navigation";

const validRoutes = [
  "/",
  "/about",
  "/projects",
  "/contact",
  "/admin",
  "/admin/dashboard",
  "/login",
  "/forgot-password",
  "/register",
];

export default function useIsNotFound() {
  const pathname = usePathname();

  const isNotFound = !validRoutes.includes(pathname);

  return isNotFound;
}

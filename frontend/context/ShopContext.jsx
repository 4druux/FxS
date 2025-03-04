"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const clearSession = () => {
    Cookies.remove("authToken");
    Cookies.remove("tokenExpiration");
    setUser(null);
    setIsLoggedIn(false);
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      clearSession();
    }
  };

  useEffect(() => {
    const token = Cookies.get("authToken");
    const expiration = Cookies.get("tokenExpiration");

    if (token && expiration) {
      const isExpired = Date.now() > Number(expiration);
      if (isExpired) {
        clearSession();
        if (pathname.startsWith("/admin")) {
          router.replace("/login?reason=session_expired");
        }
      } else {
        fetchUserProfile(token);
      }
    } else {
      clearSession();
    }
    setIsSessionChecked(true);
  }, [pathname, router]);

  // Cegah akses /login kalau sudah login
  useEffect(() => {
    if (isLoggedIn && pathname === "/login") {
      router.replace(user?.role === "admin" ? "/admin/dashboard" : "/");
    }
  }, [isLoggedIn, pathname, user?.role, router]);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password }
      );

      const { token, role } = response.data;
      const expirationTime = Date.now() + 60 * 60 * 1000;

      Cookies.set("authToken", token, { expires: 1 / 24 });
      Cookies.set("tokenExpiration", expirationTime.toString(), {
        expires: 1 / 24,
      });

      await fetchUserProfile(token);

      toast.success(`Welcome ${role === "admin" ? "Admin" : "User"}!`);
      router.replace(role === "admin" ? "/admin/dashboard" : "/");
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    clearSession();
    toast.success("Logout successful.");
    router.replace("/login");
  };

  return (
    <ShopContext.Provider
      value={{
        user,
        isLoggedIn,
        isSessionChecked,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

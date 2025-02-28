// context/ShopContext.js
"use client";
import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Ganti loading dengan isLoggedIn
  const router = useRouter();

  // Fungsi untuk memeriksa token tersimpan dan memuat data pengguna
  const loadUserFromStorage = useCallback(async () => {
    const storedToken = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    if (
      storedToken &&
      tokenExpiration &&
      new Date().getTime() < +tokenExpiration
    ) {
      setToken(storedToken);
      setUser({ role: userRole });
      setIsLoggedIn(true); // Set isLoggedIn menjadi true
    } else {
      // Hapus data jika token tidak valid atau expired
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("tokenExpiration");
      setIsLoggedIn(false); // Set isLoggedIn menjadi false
    }
  }, []);

  // Load user saat context pertama kali dimuat
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // Fungsi login
  const loginUser = async (email, password) => {
    // setLoading(true); // Hapus setLoading dari sini
    try {
      const response = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      if (response.data.token) {
        const { token, role, expiresIn } = response.data;
        const expirationTime = new Date().getTime() + expiresIn * 1000;

        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("tokenExpiration", expirationTime);

        setToken(token);
        setUser({ role });
        setIsLoggedIn(true); // Set isLoggedIn menjadi true

        // Redirect berdasarkan role
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      // setLoading(false); // Hapus setLoading dari sini
    }
  };

  // Fungsi logout
  const logoutUser = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("tokenExpiration");
    setToken(null);
    setUser(null);
    setIsLoggedIn(false); // Set isLoggedIn menjadi false
    router.push("/login");
  };

  // Fungsi untuk memeriksa apakah pengguna adalah admin
  const isAdmin = user?.role === "admin";

  const contextValue = {
    user,
    token,
    isLoggedIn, // Ganti loading dengan isLoggedIn
    loginUser,
    logoutUser,
    isAdmin,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

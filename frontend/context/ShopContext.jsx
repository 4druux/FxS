import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";

export const ShopContext = createContext();

let sessionCheckInterval = null;

export const ShopProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const clearSession = () => {
    Cookies.remove("authToken");
    Cookies.remove("userRole");
    Cookies.remove("tokenExpiration");
    setUser(null);
    setIsLoggedIn(false);
    clearInterval(sessionCheckInterval);
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setIsLoggedIn(true);
      Cookies.set("userRole", response.data.role);
    } catch (error) {
      clearSession();
    }
  };

  const checkSessionExpiration = () => {
    const expiration = Cookies.get("tokenExpiration");
    if (!expiration) return;

    const isExpired = Date.now() > Number(expiration);
    if (isExpired) {
      clearSession();
      toast.error("Session expired. Please login again.");
      router.replace("/login?reason=session_expired");
    }
  };

  useEffect(() => {
    const token = Cookies.get("authToken");
    const expiration = Cookies.get("tokenExpiration");

    if (token && expiration) {
      const isExpired = Date.now() > Number(expiration);
      if (isExpired) {
        clearSession();
        router.replace("/login?reason=session_expired");
      } else {
        fetchUserProfile(token);
        sessionCheckInterval = setInterval(checkSessionExpiration, 10000); // Interval 10 detik
      }
    } else {
      clearSession();
    }

    setIsSessionChecked(true);

    return () => clearInterval(sessionCheckInterval);
  }, []);

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

      const expirationTime = Date.now() + 60 * 60 * 1000; // 1 jam

      Cookies.set("authToken", token, { expires: 1 / 24 });
      Cookies.set("tokenExpiration", expirationTime.toString(), {
        expires: 1 / 24,
      });
      Cookies.set("userRole", role, { expires: 1 / 24 });

      await fetchUserProfile(token);

      toast.success(`Welcome ${role === "admin" ? "Admin" : "User"}!`);
      router.replace(role === "admin" ? "/admin/dashboard" : "/");

      sessionCheckInterval = setInterval(checkSessionExpiration, 10000);
    } catch (error) {
      throw error;
    }
  };

  // Logout manual oleh user
  const logoutUser = () => {
    clearSession();
    toast.success("Logout successful.");
    router.replace("/login");
  };

  // edit-product.jsx
  const fetchProductsById = async (productId) => {
    const existingProduct = products.find(
      (product) => product._id === productId
    );

    if (!existingProduct) {
      return null;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/product/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch product details", error);
      return null;
    }
  };

  return (
    <ShopContext.Provider
      value={{
        user,
        isLoggedIn,
        isSessionChecked,
        loginUser,
        logoutUser,
        fetchProductsById,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

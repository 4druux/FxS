import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isManualLogout, setIsManualLogout] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = Cookies.get("authToken");
    const role = Cookies.get("userRole");

    if (token && role) {
      setUser({ role });
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }

    const reason = searchParams.get("reason");

    if (!token && reason === "session_expired") {
      toast.error("Session expired. Please login again.");
    }
  }, [pathname, searchParams]);

  // Reset manualLogout setiap user sampai di halaman login
  useEffect(() => {
    if (pathname === "/login") {
      setIsManualLogout(false);
    }
  }, [pathname]);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email,
          password,
        }
      );

      const { token, role, expiresIn } = response.data;
      const expirationTime = new Date().getTime() + expiresIn * 1000;

      Cookies.set("authToken", token, { path: "/" });
      Cookies.set("userRole", role, { path: "/" });
      Cookies.set("tokenExpiration", expirationTime.toString(), { path: "/" });

      setUser({ role });
      setIsLoggedIn(true);

      toast.success(
        `Login successful! Welcome, ${role === "admin" ? "Admin" : "User"}.`
      );

      if (role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const logoutUser = () => {
    setIsManualLogout(true);
    Cookies.remove("authToken");
    Cookies.remove("userRole");
    Cookies.remove("tokenExpiration");

    setUser(null);
    setIsLoggedIn(false);

    toast.success("Logout successful!");
    router.replace("/login");
  };

  return (
    <ShopContext.Provider
      value={{ user, isLoggedIn, loginUser, logoutUser, isManualLogout }}
    >
      {children}
    </ShopContext.Provider>
  );
};

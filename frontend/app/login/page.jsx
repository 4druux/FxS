// app/login/page.js
"use client";
import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import Separator from "@/components/ui/Separator";
import PageTransition from "@/components/Curve";
import ShinyText from "@/components/text/ShinyText";
import { ShopContext } from "@/context/ShopContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useContext(ShopContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    try {
      await loginUser(email, password);
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setErrorMessage("Invalid email or password. Please try again.");
            break;
          case 403:
            setErrorMessage(
              "You don't have permission to access this account."
            );
            break;
          default:
            setErrorMessage("An error occurred. Please try again later.");
        }
      } else {
        setErrorMessage("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false); // Set isLoading di sini
    }
  };

  useEffect(() => {
    if (isLoading) {
      // Gunakan loading dari context
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition backgroundColor="#083344">
      <div className="min-h-screen bg-[#121212]">
        <div className="flex flex-col items-center justify-center min-h-screen">
          {isLoading && (
            <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-4 border-t-white border-r-transparent border-b-white border-l-transparent rounded-full text-white"></div>
            </div>
          )}
          <Link href="/" className="my-8">
            <Image
              alt="Atlas Icon"
              width={160} // Sesuaikan ukuran yang optimal
              height={60} // Sesuaikan
              className="w-32 sm:w-40"
            />
          </Link>
          <form
            onSubmit={onSubmitHandler} // Panggil onSubmitHandler
            className="flex flex-col items-center w-[90%] sm:max-w-md m-auto mt-14 gap-6 p-5 sm:p-8 bg-neutral-900 
      shadow-xl rounded-xl transition-all duration-500 hover:shadow-2xl border border-neutral-800"
          >
            <div className="inline-flex flex-col space-y-2 items-center gap-2 mb-8">
              <ShinyText
                text="Login"
                speed={3}
                className="tracking-widest text-white/60 font-bold text-3xl"
              />
              <Separator />
            </div>
            {errorMessage && (
              <div className="w-full text-center text-red-700 bg-red-100 border border-red-300 px-4 py-2 rounded-lg">
                {errorMessage}
              </div>
            )}
            <div className="relative w-full">
              <input
                className="w-full px-4 pt-6 pb-2 border bg-neutral-900 border-neutral-800 text-neutral-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required // Tambahkan atribut required
              />
              <label
                htmlFor="email"
                className={`absolute left-4 transition-all duration-150 transform text-neutral-200 bg-neutral-900 px-1 
            ${email ? "-top-2 text-xs" : "top-3 text-sm"}`}
                style={{ pointerEvents: "none" }}
              >
                Email
              </label>
            </div>
            <div className="relative w-full">
              <input
                className="w-full px-4 pt-6 pb-2 border bg-neutral-900 border-neutral-800 text-neutral-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label
                htmlFor="password"
                className={`absolute left-4 transition-all duration-150 transform text-neutral-200 bg-neutral-900 px-1 
            ${password ? "-top-2 text-xs" : "top-3 text-sm"}`}
                style={{ pointerEvents: "none" }}
              >
                Password
              </label>
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <div className="w-full flex justify-between text-sm sm:text-xs">
              <Link
                href="/forgot-password"
                className="text-blue-300 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
              <Link
                href="/register"
                className="text-blue-300 hover:text-blue-500"
              >
                Create account
              </Link>
            </div>
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-full transition-all duration-300   
            flex items-center justify-center space-x-2 group font-normal  
            ${
              !email || !password
                ? "bg-neutral-900 cursor-not-allowed text-neutral-400 border border-neutral-800"
                : "bg-neutral-800 text-white border border-neutral-700 transform hover:scale-[1.02] hover:shadow-lg"
            }`}
            >
              <span>Sign In</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-opacity   
              ${!email || !password ? "opacity-0" : "opacity-100"}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;

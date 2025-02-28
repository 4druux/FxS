// app/forgot-password/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import SweetAlert from "@/components/ui/SweetAlert";

const assets = {
  forever_icon: "/forever_icon.png", //  Contoh path.  Sesuaikan!
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOverlay, setIsOverlay] = useState(false);

  const sendResetLinkHandler = async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/forgot-password",
        { email }
      );
      setIsOverlay(true);
      if (response.data.message) {
        SweetAlert({
          //Asumsikan SweetAlert adalah custom hook/component
          title: "Success!",
          message: "Reset password link has been sent to your email.",
          icon: "success",
        });
        setIsEmailSent(true);
        startResendTimer();
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            setErrorMessage("No account found with this email address.");
            break;
          case 429:
            setErrorMessage("Too many reset attempts. Please try again later.");
            break;
          default:
            setErrorMessage("An error occurred. Please try again later.");
        }
      } else {
        setErrorMessage("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
      setIsOverlay(false);
    }
  };

  const startResendTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setResendTimer(60);
    setResendAttempts((prev) => prev + 1);

    const newIntervalId = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(newIntervalId);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    setIntervalId(newIntervalId);
  };

  const handleResendResetLink = () => {
    if (resendAttempts < 3) {
      sendResetLinkHandler();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    if (isLoading || isOverlay) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading, isOverlay]);

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="flex flex-col items-center justify-center min-h-screen">
        {isLoading && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-4 border-t-white border-r-transparent border-b-white border-l-transparent rounded-full text-white"></div>
          </div>
        )}
        {isOverlay && (
          <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out"></div>
        )}

        <Link href="/" className="my-8">
          {/* Gunakan komponen Image dari Next.js untuk optimasi gambar */}
          <Image
            alt="Atlas Icon"
            width={160} // Sesuaikan ukuran yang optimal
            height={60} // Sesuaikan
            className="w-32 sm:w-40"
          />
        </Link>
        <form
          className="flex flex-col items-center w-[90%] sm:max-w-md m-auto mt-14 gap-6 p-5 sm:p-8 bg-neutral-900 
      shadow-xl rounded-xl transition-all duration-500 hover:shadow-2xl border border-neutral-800"
        >
          {/* Forgot Password Header */}
          <div className="text-center mb-8 w-full">
            <div className="bg-neutral-800 border border-neutral-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-neutral-200 mb-2">
              {!isEmailSent ? "Forgot Password" : "Reset Link Sent"}
            </h2>
            <p className="text-neutral-400">
              {!isEmailSent
                ? "Enter your email to reset your password"
                : `We've sent a reset link to`}
            </p>
            {isEmailSent && (
              <p className="text-blue-600 font-medium break-all">{email}</p>
            )}
          </div>
          {/* Error Message */}
          {errorMessage && (
            <div className="w-full text-center text-red-700 bg-red-100 border border-red-300 px-4 py-3 rounded-lg mb-6 flex items-center justify-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}
          {/* Email Input or Resend Section */}
          <div className="space-y-6 relative w-full">
            {!isEmailSent ? (
              <div className="relative">
                <input
                  className="w-full px-4 pt-6 pb-2 border-2 bg-neutral-900 border-neutral-800 text-neutral-200 rounded-lg 
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent   
                  transition-all duration-300 placeholder-transparent"
                  type="email"
                  id="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="email"
                  className={`absolute left-4 text-neutral-200 transition-all duration-200 transform bg-neutral-900 px-1   
                ${email ? "-top-2 text-xs text-blue-600" : "top-3 text-sm"}`}
                  style={{ pointerEvents: "none" }}
                >
                  Email Address
                </label>
              </div>
            ) : null}
            {/* Send/Verify Button */}
            <button
              type="button"
              onClick={!isEmailSent ? sendResetLinkHandler : () => {}}
              className={`w-full py-3 px-4 rounded-full transition-all duration-300   
            flex items-center justify-center space-x-2 group
            ${
              !isEmailSent
                ? email
                  ? "bg-neutral-800 text-white border border-neutral-700 transform hover:scale-[1.02] hover:shadow-lg"
                  : "bg-neutral-900 cursor-not-allowed text-neutral-400 border border-neutral-800"
                : "bg-neutral-900 cursor-not-allowed text-neutral-400 border border-neutral-800"
            }`}
              disabled={!email || isEmailSent}
            >
              <span>{!isEmailSent ? "Send Reset Link" : "Link Sent"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-opacity   
              ${!email || isEmailSent ? "opacity-0" : "opacity-100"}`}
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
            {/* Resend Section */}
            {isEmailSent && (
              <div className="text-center space-y-4">
                <p className="text-sm text-neutral-400">Didnt receive the link?</p>
                {resendTimer > 0 ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-neutral-200"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-neutral-200">
                      Resend available in {resendTimer} seconds
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={`text-blue-500 hover:text-blue-600 text-sm font-medium   
                  flex items-center justify-center space-x-2 mx-auto   
                  ${
                    resendAttempts >= 3 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                    onClick={handleResendResetLink}
                    disabled={resendAttempts >= 3 || resendTimer > 0}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Resend Link{" "}
                      {resendAttempts > 0 &&
                        `(${3 - resendAttempts} attempts left)`}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Back to Login */}
          <div className="mt-8 pt-6 border-t border-neutral-800 text-center w-full">
            <Link
              href="/login"
              className="text-neutral-400 hover:text-neutral-200 text-sm flex items-center justify-center space-x-2 mx-auto   
               rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 010 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

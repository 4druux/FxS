"use client";

import { useContext, useState } from "react";
import PageTransition from "@/components/Curve";
import { ShopContext } from "@/context/ShopContext";
import { IoIosArrowBack, IoMdLock, IoMdMail } from "react-icons/io";
import { toast } from "react-toastify";
import ShinyText from "@/components/Text/ShinyText";

export default function ProfilePage() {
  const { user } = useContext(ShopContext);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const maskedEmail = maskEmail(user?.email);

  // Masking email (ex*****@gmail.com)
  function maskEmail(email) {
    if (!email) return "";
    const [local, domain] = email.split("@");
    const maskedLocal = local.slice(0, 2) + "*".repeat(local.length - 2);
    return `${maskedLocal}@${domain}`;
  }

  const handlePhotoEdit = () => {
    toast.info("Feature to edit profile photo is coming soon!");
  };

  const handleChangePasswordClick = () => {
    setShowPasswordFields(!showPasswordFields);
  };

  return (
    <PageTransition backgroundColor="#083344">
      <div className="min-h-screen bg-[#121212] text-white">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-6 flex items-start space-x-2">
            <IoIosArrowBack
              className="w-7 h-7 cursor-pointer text-neutral-400 hover:text-neutral-200"
              onClick={() => window.history.back()}
            />
            <ShinyText
              text="My Profile"
              speed={3}
              className="tracking-widest text-white/60 font-bold text-3xl"
            />
          </div>

          <div className="space-y-8 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            {/* Foto Profil */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-36 h-36 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                <img
                  src="/assets/profil.png"
                  alt="Profile Photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handlePhotoEdit}
                className="bg-neutral-800 border border-neutral-700 text-sm px-4 py-2 hover:bg-neutral-700 rounded-full"
              >
                Edit Photo
              </button>
            </div>

            {/* Informasi Akun + Password */}
            <div className="border border-neutral-800 p-6 rounded-xl">
              <h2 className="text-2xl font-semibold mb-4">
                Account Information
              </h2>
              <div className="space-y-6">
                {/* Username */}
                <div>
                  <label className="text-neutral-400 block text-sm font-medium">
                    Username
                  </label>
                  <p className="bg-neutral-800 border border-neutral-700 pl-3 pr-3 py-2 rounded-md text-neutral-300 cursor-not-allowed">
                    {user?.username}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="text-neutral-400 block text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoMdMail className="h-5 w-5 text-neutral-400" />
                    </div>
                    <p className="bg-neutral-800 border border-neutral-700 pl-10 pr-3 py-2 rounded-md text-neutral-300 cursor-not-allowed">
                      {maskedEmail}
                    </p>
                  </div>
                </div>

                {/* Current Password (masked) */}
                <div>
                  <label className="text-neutral-400 block text-sm font-medium">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoMdLock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type="password"
                      value="********"
                      disabled
                      className="w-full bg-neutral-800 border border-neutral-700 pl-10 pr-3 py-2 rounded-md text-neutral-300 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Tombol Change Password */}
                {!showPasswordFields && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields(true)}
                      className="text-neutral-500 hover:text-neutral-300 text-sm font-medium"
                    >
                      Change Password
                    </button>
                  </div>
                )}

                {/* Form New Password & Confirm (Conditional Render) */}
                {showPasswordFields && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* New Password */}
                      <div className="flex-1">
                        <label className="text-neutral-400 block text-sm font-medium">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IoMdLock className="h-5 w-5 text-neutral-400" />
                          </div>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 pl-10 pr-3 py-2 rounded-md text-neutral-300 
                            focus:outline-none focus:ring-1 focus:ring-neutral-500 placeholder:text-sm"
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div className="flex-1">
                        <label className="text-neutral-400 block text-sm font-medium">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IoMdLock className="h-5 w-5 text-neutral-400" />
                          </div>
                          <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) =>
                              setConfirmNewPassword(e.target.value)
                            }
                            className="w-full bg-neutral-800 border border-neutral-700 pl-10 pr-3 py-2 rounded-md text-neutral-300 
                            focus:outline-none focus:ring-1 focus:ring-neutral-500 placeholder:text-sm"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Button Update & Cancel di Sebaris */}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowPasswordFields(false)}
                        className="px-6 py-2 text-sm sm:text-md sm:py-3 rounded-full border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-600 hover:scale-[1.01] transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-2 text-sm sm:text-md sm:py-3 rounded-full border border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700 hover:scale-[1.01]"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

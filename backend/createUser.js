// File: createUser.js
const mongoose = require("mongoose");
const User = require("./models/User"); // Sesuaikan path jika file User.js ada di folder lain
require("dotenv").config();

async function createUser() {
  try {
    // 1. Hubungkan ke MongoDB
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/fxs-store";
    await mongoose.connect(mongoURI);
    console.log("✅ Terhubung ke MongoDB");

    // 2. Data user baru dengan role admin
    const newUserData = {
      username: "superadmin", // Sesuaikan username
      email: "admin@gmail.com", // Sesuaikan email
      password: "admin123", // Password plain text (akan di-hash otomatis oleh schema)
      role: "admin", // Role sebagai admin
      isEmailVerified: true, // Langsung verified
    };

    // 3. Buat dan simpan user baru
    const newUser = new User(newUserData);
    const savedUser = await newUser.save();

    // 4. Log hasilnya ke console
    console.log("🎉 User admin berhasil dibuat:", savedUser);
  } catch (error) {
    console.error("❌ Gagal membuat user:", error);
  } finally {
    // 5. Tutup koneksi
    await mongoose.disconnect();
    console.log("🔌 Koneksi MongoDB ditutup");
  }
}

// Jalankan fungsi
createUser();

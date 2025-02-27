// Ini BUKAN untuk dijalankan di MongoDB Shell, tapi di aplikasi Node.js Anda.

const mongoose = require('mongoose');
const User = require('./User'); // Pastikan path ke model User benar
require('dotenv').config();

async function createUser() {
  try {
    // 1. Hubungkan ke MongoDB (jika belum terhubung)
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/fxs-store'; // Ganti dengan URI Anda
    await mongoose.connect(mongoURI);
    console.log('Terhubung ke MongoDB');

    // 2. Data user baru (GANTI DENGAN DATA YANG SEBENARNYA)
    const newUserData = {
      email: 'andrew@gmail.com', // Ganti dengan email user
      password: 'password123',       // Ganti dengan password user (INI AKAN DI-HASH)
      role: 'user',                  // Ganti dengan role yang sesuai ('user' atau 'admin')
    };

    // 3. Buat instance User baru (password akan otomatis di-hash oleh pre-save hook di model)
    const newUser = new User(newUserData);

    // 4. Simpan user ke database
    const savedUser = await newUser.save();

    // 5. Tampilkan user yang berhasil disimpan (opsional)
    console.log('User baru berhasil dibuat:', savedUser);

  } catch (error) {
    console.error('Gagal membuat user:', error);
  } finally {
    // 6. Tutup koneksi (opsional, tapi praktik yang baik)
    mongoose.disconnect();
    console.log('Koneksi MongoDB ditutup');
  }
}

createUser(); // Panggil fungsi untuk membuat user

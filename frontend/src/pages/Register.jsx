// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import loginBg from '../assets/accenture_background.jpg';

import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';

function RegisterPage() {
  const navigate = useNavigate();
  
  // State untuk semua field pendaftaran
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Validasi Password (sama seperti login)
  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    return regex.test(pwd);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    // 1. Cek Field Kosong
    if (!formData.firstName || !formData.email || !formData.password) {
      setError('Mohon lengkapi semua data wajib.');
      return;
    }

    // 2. Cek Validasi Password
    if (!validatePassword(formData.password)) {
      setError('Kata Sandi harus min. 6 karakter, kombinasi huruf besar, kecil, & angka.');
      return;
    }

    // 3. Cek Apakah Kata Sandi Cocok 
    if (formData.password !== formData.confirmPassword) {
      setError('Kata Sandi dan Konfirmasi Kata Sandi tidak cocok.');
      return;
    }

    // Jika sukses
    console.log('Data Register:', formData);
    alert('Registrasi Berhasil! (Simulasi)');
    navigate('/login'); 
  };

  return (
    <div 
      className="relative w-full min-h-screen flex items-center justify-center bg-cover bg-center py-10"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden m-4">
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun</h2>
            <p className="text-gray-500">Bergabunglah untuk manajemen perlengkapan secara efisien</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-status-critical text-status-critical text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Depan</label>
                <Input id="firstName" type="text" placeholder="John" value={formData.firstName} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Belakang</label>
                <Input id="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Email</label>
              <Input id="email" type="email" placeholder="john@company.com" value={formData.email} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi</label>
              <Input id="password" type="password" placeholder="Gunakan kata sandi yang kuat" value={formData.password} onChange={handleChange} />
              <p className="text-xs text-gray-400 mt-1">*Min. 6 huruf besar dan kecil & Angka.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Kata Sandi</label>
              <Input id="confirmPassword" type="password" placeholder="Ulangi kata sandi " value={formData.confirmPassword} onChange={handleChange} />
            </div>

            <div className="pt-2">
              <Button type="submit" className="py-3 text-lg shadow-md">
                Buat Akun
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{' '}
              {}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Login Disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
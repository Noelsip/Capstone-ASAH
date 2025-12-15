import React, { useState } from 'react';
import { Link, useNavigate }from 'react-router-dom';
import loginBg from '../assets/accenture_background.jpg';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';

const BASE_URL = '/api'

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State untuk menyimpan pesan error
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi untuk validasi password 
  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return 'Password minimal 6 karakter';
    }
    return null;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 1. Cek apakah field kosong
    if (!email || !password) {
      setError('Email dan Password tidak boleh kosong.');
      setIsLoading(false);
      return;
    }

    // 2. Cek Validasi Password 
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      // Simpan token dan user data
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      if (data.user) {
        localStorage.setItem('authUser', JSON.stringify(data.user));
      }

      console.log('Login berhasil:', data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="relative w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* KARTU FORM LOGIN */}
      {}
      {}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="p-10 md:p-12"> {}
          <div className="text-center mb-8">
            {}
            <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-gray-500 text-lg">
              Masuk ke akun anda untuk melanjutkan.
            </p>
          </div>

          {}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-status-critical text-status-critical text-sm rounded">
              <p className="font-bold">Login Gagal</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                Alamat Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="masukan email anda"
                className="py-3" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
                Kata Sandi
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="masukan kata sandi anda"
                className="py-3"
              />
              {/* Hint Password kecil di bawah input */}
              <p className="text-xs text-gray-400 mt-1">
                *Min. 6 karakter, kombinasi huruf besar, kecil, & angka.
              </p>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-600">Ingat Saya</span>
              </label>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover">
                Lupa Kata Sandi?
              </a>
            </div>

            <Button type="submit" className="py-3 text-lg shadow-lg hover:shadow-xl transition-all">
              {isLoading ? 'Memproses...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Belum Punya Akun?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Daftar Sekarang
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Admin {
  id: number;
  username: string;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/admin/me');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsLoggedIn(true);
          setAdmin(data.data);
          router.push('/admin/dashboard');
        }
      }
    } catch (err) {
      // Not logged in, stay on login page
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setError('Username dan password harus diisi');
      return;
    }

    try {
      setLoginLoading(true);
      setError(null);

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginForm.username.trim(),
          password: loginForm.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsLoggedIn(true);
        setAdmin(data.data);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memeriksa status login..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-md w-full mx-4">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-400">Masuk ke panel admin AnimeHub</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                👤 Username
              </label>
              <input
                type="text"
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="form-input"
                placeholder="Masukkan username"
                required
                disabled={loginLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                🔒 Password
              </label>
              <input
                type="password"
                id="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="form-input"
                placeholder="Masukkan password"
                required
                disabled={loginLoading}
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Masuk...
                </div>
              ) : (
                '🚀 Masuk'
              )}
            </button>
          </form>

          {/* Default Credentials Info */}
          <div className="mt-8 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-700">
            <h3 className="text-blue-300 font-semibold mb-2">ℹ️ Default Login:</h3>
            <div className="text-blue-200 text-sm space-y-1">
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> password</p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Kembali ke Beranda
            </button>
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-8 card p-6">
          <h3 className="text-white font-semibold mb-4 text-center">
            🛠️ Fitur Admin Panel
          </h3>
          
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <span className="text-blue-400">📰</span>
              <span className="text-gray-300">Kelola berita anime</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-400">📝</span>
              <span className="text-gray-300">Buat dan edit artikel</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-yellow-400">🖼️</span>
              <span className="text-gray-300">Upload gambar berita</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-purple-400">📊</span>
              <span className="text-gray-300">Dashboard statistik</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


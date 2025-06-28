'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Admin {
  id: number;
  username: string;
  created_at: string;
}

interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check authentication
      const authResponse = await fetch('/api/admin/me');
      
      if (!authResponse.ok) {
        router.push('/admin');
        return;
      }

      const authData = await authResponse.json();
      if (!authData.success) {
        router.push('/admin');
        return;
      }

      setAdmin(authData.data);

      // Load news
      setNewsLoading(true);
      const newsResponse = await fetch('/api/news?limit=10');
      
      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        if (newsData.success) {
          setNews(newsData.data);
        }
      }
    } catch (err) {
      setError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
      setNewsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/admin');
      }
    } catch (err) {
      alert('Gagal logout. Silakan coba lagi.');
    }
  };

  const handleDeleteNews = async (newsId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNews(news.filter(item => item.id !== newsId));
        alert('Berita berhasil dihapus');
      } else {
        alert('Gagal menghapus berita');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus berita');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat dashboard..." />
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-400 mb-4">{error || 'Tidak dapat mengakses dashboard'}</p>
          <Link href="/admin" className="btn-primary">
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold gradient-text">AnimeHub</span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-white font-semibold">Admin Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Selamat datang, <strong>{admin.username}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📰</div>
              <div>
                <h3 className="text-lg font-semibold text-white">Total Berita</h3>
                <p className="text-2xl font-bold text-blue-400">{news.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👤</div>
              <div>
                <h3 className="text-lg font-semibold text-white">Admin Aktif</h3>
                <p className="text-2xl font-bold text-green-400">1</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📅</div>
              <div>
                <h3 className="text-lg font-semibold text-white">Login Terakhir</h3>
                <p className="text-sm text-gray-400">Hari ini</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">🚀 Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/admin/news/create" className="btn-primary text-center">
              📝 Buat Berita Baru
            </Link>
            <Link href="/news" className="btn-secondary text-center">
              👁️ Lihat Semua Berita
            </Link>
            <Link href="/" className="btn-secondary text-center">
              🏠 Kembali ke Website
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Recent News */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">📰 Berita Terbaru</h2>
            <Link href="/admin/news/create" className="btn-primary">
              + Tambah Berita
            </Link>
          </div>

          {newsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner text="Memuat berita..." />
            </div>
          ) : news.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">Judul</th>
                    <th className="text-left py-3 px-4 text-gray-300">Tanggal</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                    <th className="text-right py-3 px-4 text-gray-300">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item) => (
                    <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-50">
                      <td className="py-3 px-4">
                        <div>
                          <h3 className="text-white font-medium">
                            {truncateText(item.title, 60)}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {truncateText(item.content, 100)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                          Published
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/news/${item.id}`}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            👁️ Lihat
                          </Link>
                          <Link
                            href={`/admin/news/edit/${item.id}`}
                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteNews(item.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Belum Ada Berita
              </h3>
              <p className="text-gray-400 mb-6">
                Mulai dengan membuat berita pertama Anda.
              </p>
              <Link href="/admin/news/create" className="btn-primary">
                📝 Buat Berita Pertama
              </Link>
            </div>
          )}
        </div>

        {/* Admin Info */}
        <div className="mt-8 card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            👤 Informasi Admin
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-400 mb-3">Detail Akun:</h4>
              <ul className="text-gray-400 space-y-2">
                <li>• Username: <span className="text-white">{admin.username}</span></li>
                <li>• ID: <span className="text-white">#{admin.id}</span></li>
                <li>• Dibuat: <span className="text-white">{formatDate(admin.created_at)}</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-400 mb-3">Hak Akses:</h4>
              <ul className="text-gray-400 space-y-2">
                <li>• ✅ Kelola berita</li>
                <li>• ✅ Upload gambar</li>
                <li>• ✅ Edit konten</li>
                <li>• ✅ Hapus berita</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


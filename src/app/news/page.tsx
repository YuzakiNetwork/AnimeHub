'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';

interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/news?limit=20');
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        
        if (data.success) {
          setNews(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch news');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat berita..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            📰 Berita Anime
          </h1>
          <p className="text-gray-400 text-lg">
            Dapatkan berita terbaru seputar dunia anime dan manga
          </p>
        </div>

        {/* News List */}
        {news.length > 0 ? (
          <div className="space-y-8">
            {news.map((article, index) => (
              <article key={article.id} className="news-card">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Image */}
                  {article.image_url && (
                    <div className="lg:col-span-1">
                      <div className="relative h-48 lg:h-full min-h-[200px] rounded-lg overflow-hidden">
                        <Image
                          src={article.image_url}
                          alt={article.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rj9v/2Q=="
                        />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className={article.image_url ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Berita #{index + 1}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {formatDate(article.created_at)}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-4 hover:text-blue-400 transition-colors">
                      <Link href={`/news/${article.id}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-gray-300 leading-relaxed mb-6">
                      {truncateContent(article.content, 300)}
                    </p>

                    <div className="flex items-center justify-between">
                      <Link
                        href={`/news/${article.id}`}
                        className="btn-primary"
                      >
                        Baca Selengkapnya →
                      </Link>

                      {article.updated_at !== article.created_at && (
                        <span className="text-gray-500 text-sm">
                          Diperbarui: {formatDate(article.updated_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="card p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Belum Ada Berita
              </h3>
              <p className="text-gray-400 mb-6">
                Belum ada berita yang dipublikasikan. Silakan kembali lagi nanti 
                untuk mendapatkan berita terbaru seputar anime.
              </p>
              <Link href="/" className="btn-primary">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}

        {/* News Info */}
        {news.length > 0 && (
          <div className="mt-12">
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                ℹ️ Tentang Berita AnimeHub
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Sumber Berita:</h4>
                  <ul className="text-gray-400 space-y-2">
                    <li>• Berita ditulis oleh admin AnimeHub</li>
                    <li>• Informasi terpercaya dari berbagai sumber</li>
                    <li>• Update reguler seputar dunia anime</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Kategori Berita:</h4>
                  <ul className="text-gray-400 space-y-2">
                    <li>• Rilis anime terbaru</li>
                    <li>• Review dan rekomendasi</li>
                    <li>• Event dan konvensi anime</li>
                    <li>• Industry news dan update</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-700">
                <p className="text-blue-300 text-center">
                  <strong>Ingin berkontribusi?</strong> Hubungi admin untuk mengirimkan 
                  berita atau informasi menarik seputar anime.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


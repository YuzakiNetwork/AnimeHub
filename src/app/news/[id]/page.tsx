'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id as string;
  
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/news/${newsId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Berita tidak ditemukan');
          }
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

    if (newsId) {
      fetchNews();
    }
  }, [newsId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content: string) => {
    // Simple formatting: convert line breaks to paragraphs
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      return (
        <p key={index} className="mb-4 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat berita..." />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-400 mb-4">{error || 'Berita tidak ditemukan'}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              Kembali
            </button>
            <Link href="/news" className="btn-primary">
              Lihat Berita Lain
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-blue-400 hover:text-blue-300">
                Beranda
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/news" className="text-blue-400 hover:text-blue-300">
                Berita
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-400 truncate">
              {news.title.length > 50 ? news.title.substring(0, 50) + '...' : news.title}
            </li>
          </ol>
        </nav>

        {/* Article */}
        <article className="card p-8">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                📰 Berita
              </span>
              <span className="text-gray-400 text-sm">
                {formatDate(news.created_at)}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              {news.title}
            </h1>

            {news.updated_at !== news.created_at && (
              <div className="text-gray-400 text-sm mb-6">
                <span className="bg-yellow-600 bg-opacity-20 text-yellow-400 px-2 py-1 rounded">
                  Diperbarui: {formatDate(news.updated_at)}
                </span>
              </div>
            )}
          </header>

          {/* Featured Image */}
          {news.image_url && (
            <div className="mb-8">
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={news.image_url}
                  alt={news.title}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rj9v/2Q=="
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 text-lg leading-relaxed">
              {formatContent(news.content)}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-gray-400 text-sm">
                <p>Dipublikasikan pada {formatDate(news.created_at)}</p>
                {news.updated_at !== news.created_at && (
                  <p>Terakhir diperbarui pada {formatDate(news.updated_at)}</p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => window.history.back()}
                  className="btn-secondary"
                >
                  ← Kembali
                </button>
                <Link href="/news" className="btn-primary">
                  Berita Lainnya
                </Link>
              </div>
            </div>
          </footer>
        </article>

        {/* Share Section */}
        <div className="mt-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              📤 Bagikan Berita Ini
            </h3>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: news.title,
                      text: news.content.substring(0, 100) + '...',
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link berhasil disalin!');
                  }
                }}
                className="btn-primary"
              >
                📱 Share
              </button>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link berhasil disalin!');
                }}
                className="btn-secondary"
              >
                📋 Copy Link
              </button>
              
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                🐦 Twitter
              </a>
              
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                📘 Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Related Actions */}
        <div className="mt-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              🎯 Jelajahi Lebih Lanjut
            </h3>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/news" className="btn-primary">
                📰 Berita Lainnya
              </Link>
              <Link href="/search" className="btn-secondary">
                🔍 Cari Anime
              </Link>
              <Link href="/schedule" className="btn-secondary">
                📅 Jadwal Tayang
              </Link>
              <Link href="/" className="btn-secondary">
                🏠 Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


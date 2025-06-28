'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AnimeCard from '@/components/AnimeCard';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  score?: number;
  year?: number;
  status?: string;
  episodes?: number;
  genres?: Array<{
    mal_id: number;
    name: string;
  }>;
  synopsis?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setError('Mohon masukkan kata kunci pencarian');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const response = await fetch(`/api/anime/search?q=${encodeURIComponent(query.trim())}&limit=24`);
      
      if (!response.ok) {
        throw new Error('Failed to search anime');
      }

      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchQuery.trim());
      window.history.pushState({}, '', url.toString());
      
      performSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
    
    // Clear URL params
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔍 Pencarian Anime
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Temukan anime favorit Anda dari database MyAnimeList
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan judul anime..."
                className="flex-1 form-input text-lg py-3"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mencari...' : 'Cari'}
              </button>
              {hasSearched && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="btn-secondary px-6 py-3"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Results */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Mencari anime..." />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="card p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-red-400 mb-4">Error</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={() => performSearch(searchQuery)}
                className="btn-primary"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {!loading && !error && hasSearched && (
          <>
            {searchResults.length > 0 ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Hasil Pencarian untuk "{searchParams.get('q') || searchQuery}"
                  </h2>
                  <p className="text-gray-400">
                    Ditemukan {searchResults.length} anime
                  </p>
                </div>

                <div className="anime-grid">
                  {searchResults.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="card p-8 max-w-md mx-auto">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Tidak Ada Hasil
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Tidak ditemukan anime dengan kata kunci "{searchParams.get('q') || searchQuery}".
                    Coba gunakan kata kunci yang berbeda.
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="btn-primary"
                  >
                    Cari Lagi
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Search Tips */}
        {!hasSearched && (
          <div className="max-w-4xl mx-auto">
            <div className="card p-8">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                💡 Tips Pencarian
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Kata Kunci Efektif:</h4>
                  <ul className="text-gray-400 space-y-2">
                    <li>• Gunakan judul anime dalam bahasa Inggris atau Jepang</li>
                    <li>• Coba singkatan atau nama alternatif</li>
                    <li>• Gunakan kata kunci spesifik</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Contoh Pencarian:</h4>
                  <ul className="text-gray-400 space-y-2">
                    <li>• "Attack on Titan"</li>
                    <li>• "Shingeki no Kyojin"</li>
                    <li>• "Naruto"</li>
                    <li>• "One Piece"</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-700">
                <p className="text-blue-300 text-center">
                  <strong>Info:</strong> Data anime diambil dari MyAnimeList melalui Jikan API.
                  Pencarian mungkin memerlukan waktu beberapa detik.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


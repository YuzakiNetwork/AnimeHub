'use client';

import { useState, useEffect } from 'react';
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
  broadcast?: {
    day?: string;
    time?: string;
    timezone?: string;
    string?: string;
  };
  airing?: boolean;
}

interface ScheduleData {
  [key: string]: Anime[];
}

const DAYS = [
  { key: 'monday', label: 'Senin', emoji: '📅' },
  { key: 'tuesday', label: 'Selasa', emoji: '📅' },
  { key: 'wednesday', label: 'Rabu', emoji: '📅' },
  { key: 'thursday', label: 'Kamis', emoji: '📅' },
  { key: 'friday', label: 'Jumat', emoji: '📅' },
  { key: 'saturday', label: 'Sabtu', emoji: '📅' },
  { key: 'sunday', label: 'Minggu', emoji: '📅' }
];

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/anime/schedule');
        
        if (!response.ok) {
          throw new Error('Failed to fetch schedule');
        }

        const data = await response.json();
        
        if (data.success) {
          // Group anime by day
          const grouped: ScheduleData = {};
          
          if (Array.isArray(data.data)) {
            // If data is an array (all days), group by broadcast day
            data.data.forEach((anime: Anime) => {
              const day = anime.broadcast?.day?.toLowerCase() || 'unknown';
              if (!grouped[day]) {
                grouped[day] = [];
              }
              grouped[day].push(anime);
            });
          } else {
            // If data is an object (grouped by days)
            Object.keys(data.data).forEach(day => {
              grouped[day.toLowerCase()] = data.data[day];
            });
          }

          setScheduleData(grouped);
        } else {
          throw new Error(data.error || 'Failed to fetch schedule');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[today];
  };

  const getDisplayedAnime = () => {
    if (selectedDay === 'all') {
      // Return all anime from all days
      const allAnime: Anime[] = [];
      Object.values(scheduleData).forEach(dayAnime => {
        allAnime.push(...dayAnime);
      });
      return allAnime;
    }
    
    return scheduleData[selectedDay] || [];
  };

  const getTotalAnimeCount = () => {
    return Object.values(scheduleData).reduce((total, dayAnime) => total + dayAnime.length, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat jadwal anime..." />
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

  const displayedAnime = getDisplayedAnime();
  const currentDay = getCurrentDay();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            📅 Jadwal Tayang Anime
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Lihat jadwal tayang anime terbaru setiap hari dalam seminggu
          </p>
          
          {getTotalAnimeCount() > 0 && (
            <div className="card p-4 max-w-md mx-auto">
              <p className="text-blue-400">
                Total {getTotalAnimeCount()} anime dalam jadwal minggu ini
              </p>
            </div>
          )}
        </div>

        {/* Day Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDay === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📋 Semua Hari
            </button>
            
            {DAYS.map((day) => (
              <button
                key={day.key}
                onClick={() => setSelectedDay(day.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDay === day.key
                    ? 'bg-blue-600 text-white'
                    : currentDay === day.key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {day.emoji} {day.label}
                {currentDay === day.key && (
                  <span className="ml-1 text-xs">• Hari Ini</span>
                )}
                {scheduleData[day.key] && (
                  <span className="ml-2 bg-gray-600 text-white px-2 py-0.5 rounded-full text-xs">
                    {scheduleData[day.key].length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Content */}
        {displayedAnime.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">
                {selectedDay === 'all' 
                  ? '📺 Semua Jadwal Anime' 
                  : `📺 Anime Hari ${DAYS.find(d => d.key === selectedDay)?.label}`
                }
              </h2>
              <p className="text-gray-400">
                {displayedAnime.length} anime 
                {selectedDay !== 'all' && ` pada hari ${DAYS.find(d => d.key === selectedDay)?.label}`}
              </p>
            </div>

            <div className="anime-grid">
              {displayedAnime.map((anime) => (
                <div key={anime.mal_id} className="relative">
                  <AnimeCard anime={anime} />
                  
                  {/* Broadcast Info */}
                  {anime.broadcast?.string && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs text-center">
                        {anime.broadcast.string}
                      </div>
                    </div>
                  )}
                  
                  {/* Airing Status */}
                  {anime.airing && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                        🔴 On Air
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="card p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Tidak Ada Jadwal
              </h3>
              <p className="text-gray-400 mb-6">
                {selectedDay === 'all' 
                  ? 'Tidak ada jadwal anime yang tersedia saat ini.'
                  : `Tidak ada anime yang tayang pada hari ${DAYS.find(d => d.key === selectedDay)?.label}.`
                }
              </p>
              <button
                onClick={() => setSelectedDay('all')}
                className="btn-primary"
              >
                Lihat Semua Hari
              </button>
            </div>
          </div>
        )}

        {/* Schedule Info */}
        <div className="mt-12">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              ℹ️ Informasi Jadwal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-blue-400 mb-3">Tentang Jadwal:</h4>
                <ul className="text-gray-400 space-y-2">
                  <li>• Jadwal berdasarkan waktu tayang di Jepang (JST)</li>
                  <li>• Data diperbarui secara real-time dari MyAnimeList</li>
                  <li>• Waktu tayang dapat berubah sewaktu-waktu</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-400 mb-3">Status Tayang:</h4>
                <ul className="text-gray-400 space-y-2">
                  <li>• 🔴 <span className="text-green-400">On Air</span> - Sedang tayang</li>
                  <li>• 📅 <span className="text-blue-400">Scheduled</span> - Terjadwal</li>
                  <li>• ⏰ Waktu dalam zona waktu Jepang (JST)</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-700">
              <p className="text-blue-300 text-center">
                <strong>Tip:</strong> Klik pada kartu anime untuk melihat detail lengkap, 
                trailer, dan informasi lainnya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          🎌 AnimeHub - Portal Informasi Anime
        </h1>
        
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-8">
            Website sedang dalam tahap pengembangan...
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">📺 Anime Populer</h3>
              <p className="text-gray-400">Temukan anime terpopuler</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">📅 Jadwal Tayang</h3>
              <p className="text-gray-400">Lihat jadwal anime terbaru</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">📰 Berita Anime</h3>
              <p className="text-gray-400">Baca berita terkini</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


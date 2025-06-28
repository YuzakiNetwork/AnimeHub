import Link from 'next/link';
import Image from 'next/image';

interface AnimeCardProps {
  anime: {
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
  };
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <div className="anime-card card card-hover group cursor-pointer">
        <div className="relative overflow-hidden">
          <Image
            src={anime.images.jpg.image_url}
            alt={anime.title}
            width={300}
            height={400}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rj9v/2Q=="
          />
          
          {/* Score badge */}
          {anime.score && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-yellow-400 px-2 py-1 rounded-lg text-sm font-semibold">
              ⭐ {anime.score}
            </div>
          )}

          {/* Status badge */}
          {anime.status && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
              {anime.status}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {anime.title}
          </h3>
          
          {anime.title_english && anime.title_english !== anime.title && (
            <p className="text-gray-400 text-sm mb-2">
              {truncateText(anime.title_english, 40)}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
            {anime.year && <span>{anime.year}</span>}
            {anime.episodes && (
              <span>{anime.episodes} episodes</span>
            )}
          </div>

          {/* Genres */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {anime.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre.mal_id}
                  className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs"
                >
                  {genre.name}
                </span>
              ))}
              {anime.genres.length > 3 && (
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                  +{anime.genres.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Synopsis preview */}
          {anime.synopsis && (
            <p className="text-gray-400 text-sm line-clamp-3">
              {truncateText(anime.synopsis, 100)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}


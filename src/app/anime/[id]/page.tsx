'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  trailer?: {
    youtube_id?: string;
    url?: string;
    embed_url?: string;
  };
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  synopsis?: string;
  background?: string;
  season?: string;
  year?: number;
  broadcast?: {
    day?: string;
    time?: string;
    timezone?: string;
    string?: string;
  };
  producers?: Array<{
    mal_id: number;
    name: string;
  }>;
  licensors?: Array<{
    mal_id: number;
    name: string;
  }>;
  studios?: Array<{
    mal_id: number;
    name: string;
  }>;
  genres?: Array<{
    mal_id: number;
    name: string;
  }>;
  themes?: Array<{
    mal_id: number;
    name: string;
  }>;
  demographics?: Array<{
    mal_id: number;
    name: string;
  }>;
  type?: string;
  source?: string;
  episodes?: number;
  status?: string;
  airing?: boolean;
  aired?: {
    from?: string;
    to?: string;
    string?: string;
  };
  duration?: string;
  rating?: string;
}

interface Comment {
  id: number;
  anime_id: number;
  username: string;
  comment: string;
  created_at: string;
}

export default function AnimeDetailPage() {
  const params = useParams();
  const animeId = params.id as string;
  
  const [anime, setAnime] = useState<Anime | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState({
    username: '',
    comment: ''
  });
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch anime details and comments in parallel
        const [animeResponse, commentsResponse] = await Promise.all([
          fetch(`/api/anime/${animeId}`),
          fetch(`/api/comments?anime_id=${animeId}`)
        ]);

        if (!animeResponse.ok) {
          throw new Error('Failed to fetch anime details');
        }

        const animeData = await animeResponse.json();
        if (animeData.success) {
          setAnime(animeData.data);
        }

        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          if (commentsData.success) {
            setComments(commentsData.data);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (animeId) {
      fetchData();
    }
  }, [animeId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentForm.username.trim() || !commentForm.comment.trim()) {
      alert('Mohon isi username dan komentar');
      return;
    }

    try {
      setSubmittingComment(true);
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          anime_id: parseInt(animeId),
          username: commentForm.username.trim(),
          comment: commentForm.comment.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      const result = await response.json();
      if (result.success) {
        // Add new comment to the list
        const newComment: Comment = {
          id: result.data.id,
          anime_id: result.data.anime_id,
          username: result.data.username,
          comment: result.data.comment,
          created_at: new Date().toISOString()
        };
        
        setComments([newComment, ...comments]);
        setCommentForm({ username: '', comment: '' });
        alert('Komentar berhasil ditambahkan!');
      }
    } catch (err) {
      alert('Gagal menambahkan komentar. Silakan coba lagi.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat detail anime..." />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-400 mb-4">{error || 'Anime tidak ditemukan'}</p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Anime Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Image
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                width={400}
                height={600}
                className="w-full rounded-lg shadow-lg"
              />
              
              {/* Quick Stats */}
              <div className="card mt-6 p-4">
                <h3 className="font-semibold text-white mb-4">Informasi</h3>
                <div className="space-y-2 text-sm">
                  {anime.score && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Score:</span>
                      <span className="text-yellow-400 font-semibold">⭐ {anime.score}</span>
                    </div>
                  )}
                  {anime.rank && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rank:</span>
                      <span className="text-white">#{anime.rank}</span>
                    </div>
                  )}
                  {anime.popularity && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Popularity:</span>
                      <span className="text-white">#{anime.popularity}</span>
                    </div>
                  )}
                  {anime.members && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Members:</span>
                      <span className="text-white">{anime.members.toLocaleString()}</span>
                    </div>
                  )}
                  {anime.type && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">{anime.type}</span>
                    </div>
                  )}
                  {anime.episodes && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Episodes:</span>
                      <span className="text-white">{anime.episodes}</span>
                    </div>
                  )}
                  {anime.status && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-white">{anime.status}</span>
                    </div>
                  )}
                  {anime.aired?.string && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Aired:</span>
                      <span className="text-white text-right">{anime.aired.string}</span>
                    </div>
                  )}
                  {anime.source && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Source:</span>
                      <span className="text-white">{anime.source}</span>
                    </div>
                  )}
                  {anime.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{anime.duration}</span>
                    </div>
                  )}
                  {anime.rating && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rating:</span>
                      <span className="text-white">{anime.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-4">{anime.title}</h1>
            
            {anime.title_english && anime.title_english !== anime.title && (
              <h2 className="text-2xl text-gray-300 mb-2">{anime.title_english}</h2>
            )}
            
            {anime.title_japanese && (
              <h3 className="text-lg text-gray-400 mb-6">{anime.title_japanese}</h3>
            )}

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres.map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Trailer */}
            {anime.trailer?.embed_url && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Trailer</h3>
                <div className="aspect-video">
                  <iframe
                    src={anime.trailer.embed_url}
                    title="Anime Trailer"
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Sinopsis</h3>
                <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
              </div>
            )}

            {/* Background */}
            {anime.background && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Background</h3>
                <p className="text-gray-300 leading-relaxed">{anime.background}</p>
              </div>
            )}

            {/* Studios and Producers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {anime.studios && anime.studios.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Studios</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.studios.map((studio) => (
                      <span
                        key={studio.mal_id}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg text-sm"
                      >
                        {studio.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {anime.producers && anime.producers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Producers</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.producers.map((producer) => (
                      <span
                        key={producer.mal_id}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg text-sm"
                      >
                        {producer.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="card p-6">
          <h3 className="text-2xl font-semibold text-white mb-6">Komentar</h3>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Username"
                value={commentForm.username}
                onChange={(e) => setCommentForm({ ...commentForm, username: e.target.value })}
                className="form-input"
                required
                maxLength={50}
              />
            </div>
            <textarea
              placeholder="Tulis komentar Anda..."
              value={commentForm.comment}
              onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
              className="form-textarea mb-4"
              required
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={submittingComment}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingComment ? 'Mengirim...' : 'Kirim Komentar'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blue-400">{comment.username}</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(comment.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-300">{comment.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">
                Belum ada komentar. Jadilah yang pertama berkomentar!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


import axios from 'axios';

// Jikan API base URL
const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

// Rate limiting helper
let lastRequestTime = 0;
const RATE_LIMIT_DELAY = 1000; // 1 second between requests

async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const delay = RATE_LIMIT_DELAY - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastRequestTime = Date.now();
}

class AnimeAPI {
  // Get top anime
  static async getTopAnime(limit = 25) {
    try {
      await rateLimit();
      const response = await axios.get(`${JIKAN_BASE_URL}/top/anime`, {
        params: {
          limit: limit
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching top anime:', error);
      return [];
    }
  }

  // Get current season anime
  static async getCurrentSeason(limit = 25) {
    try {
      await rateLimit();
      const response = await axios.get(`${JIKAN_BASE_URL}/seasons/now`, {
        params: {
          limit: limit
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching current season:', error);
      return [];
    }
  }

  // Get anime by ID
  static async getAnimeById(id: number) {
    try {
      await rateLimit();
      const response = await axios.get(`${JIKAN_BASE_URL}/anime/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching anime by ID:', error);
      return null;
    }
  }

  // Search anime
  static async searchAnime(query: string, limit = 25) {
    try {
      await rateLimit();
      const response = await axios.get(`${JIKAN_BASE_URL}/anime`, {
        params: {
          q: query,
          limit: limit,
          order_by: 'score',
          sort: 'desc'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error searching anime:', error);
      return [];
    }
  }

  // Get anime schedule
  static async getSchedule(day?: string) {
    try {
      await rateLimit();
      const url = day ? `${JIKAN_BASE_URL}/schedules/${day}` : `${JIKAN_BASE_URL}/schedules`;
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return [];
    }
  }

  // Get anime characters
  static async getAnimeCharacters(id: number) {
    try {
      await rateLimit();
      const response = await axios.get(`${JIKAN_BASE_URL}/anime/${id}/characters`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching anime characters:', error);
      return [];
    }
  }

  // Get anime recommendations
  static async getAnimeRecommendations(id: number) {
    try {
      await rateLimit();
      const response = await axios.get(`${JIKAN_BASE_URL}/anime/${id}/recommendations`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching anime recommendations:', error);
      return [];
    }
  }

  // Get anime videos
  static async getAnimeVideos(id: number) {
    try {
      await rateLimit();
      const response = await axios.get(`${JIKAN_BASE_URL}/anime/${id}/videos`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching anime videos:', error);
      return null;
    }
  }
}

export default AnimeAPI;


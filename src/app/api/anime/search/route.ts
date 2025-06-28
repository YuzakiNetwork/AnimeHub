import { NextRequest, NextResponse } from 'next/server';
import AnimeAPI from '../../../../../lib/animeAPI';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '25');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const searchResults = await AnimeAPI.searchAnime(query, limit);

    return NextResponse.json({
      success: true,
      data: searchResults,
      query: query
    });
  } catch (error) {
    console.error('Error in anime search API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search anime' },
      { status: 500 }
    );
  }
}


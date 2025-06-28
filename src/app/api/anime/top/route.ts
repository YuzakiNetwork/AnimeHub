import { NextRequest, NextResponse } from 'next/server';
import AnimeAPI from '../../../../../lib/animeAPI';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25');

    const topAnime = await AnimeAPI.getTopAnime(limit);

    return NextResponse.json({
      success: true,
      data: topAnime
    });
  } catch (error) {
    console.error('Error in top anime API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch top anime' },
      { status: 500 }
    );
  }
}


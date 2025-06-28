import { NextRequest, NextResponse } from 'next/server';
import AnimeAPI from '../../../../../lib/animeAPI';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const animeId = parseInt(params.id);
    
    if (isNaN(animeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid anime ID' },
        { status: 400 }
      );
    }

    const anime = await AnimeAPI.getAnimeById(animeId);

    if (!anime) {
      return NextResponse.json(
        { success: false, error: 'Anime not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: anime
    });
  } catch (error) {
    console.error('Error in anime detail API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch anime details' },
      { status: 500 }
    );
  }
}


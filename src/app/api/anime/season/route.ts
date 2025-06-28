import { NextRequest, NextResponse } from 'next/server';
import AnimeAPI from '../../../../../lib/animeAPI';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25');

    const currentSeason = await AnimeAPI.getCurrentSeason(limit);

    return NextResponse.json({
      success: true,
      data: currentSeason
    });
  } catch (error) {
    console.error('Error in current season API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch current season anime' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import AnimeAPI from '../../../../../lib/animeAPI';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day');

    const schedule = await AnimeAPI.getSchedule(day || undefined);

    return NextResponse.json({
      success: true,
      data: schedule,
      day: day || 'all'
    });
  } catch (error) {
    console.error('Error in anime schedule API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch anime schedule' },
      { status: 500 }
    );
  }
}


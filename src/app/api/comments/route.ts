import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../lib/database';

interface Comment {
  id: number;
  anime_id: number;
  username: string;
  comment: string;
  created_at: string;
}

// GET - Fetch comments for an anime
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const animeId = searchParams.get('anime_id');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!animeId) {
      return NextResponse.json(
        { success: false, error: 'Anime ID is required' },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      db.all(
        'SELECT * FROM comments WHERE anime_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [parseInt(animeId), limit, offset],
        (err, rows: Comment[]) => {
          if (err) {
            resolve(NextResponse.json(
              { success: false, error: 'Failed to fetch comments' },
              { status: 500 }
            ));
          } else {
            resolve(NextResponse.json({
              success: true,
              data: rows,
              pagination: {
                limit,
                offset,
                total: rows.length
              }
            }));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in comments API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST - Create new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anime_id, username, comment } = body;

    if (!anime_id || !username || !comment) {
      return NextResponse.json(
        { success: false, error: 'Anime ID, username, and comment are required' },
        { status: 400 }
      );
    }

    // Basic validation
    if (username.length < 2 || username.length > 50) {
      return NextResponse.json(
        { success: false, error: 'Username must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    if (comment.length < 5 || comment.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Comment must be between 5 and 1000 characters' },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      db.run(
        'INSERT INTO comments (anime_id, username, comment) VALUES (?, ?, ?)',
        [anime_id, username, comment],
        function(err) {
          if (err) {
            resolve(NextResponse.json(
              { success: false, error: 'Failed to create comment' },
              { status: 500 }
            ));
          } else {
            resolve(NextResponse.json({
              success: true,
              data: {
                id: this.lastID,
                anime_id,
                username,
                comment
              }
            }));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}


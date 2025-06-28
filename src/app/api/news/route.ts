import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../lib/database';
import { getSessionFromRequest } from '../../../../lib/auth';

interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// GET - Fetch all news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    return new Promise((resolve) => {
      db.all(
        'SELECT * FROM news ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset],
        (err, rows: News[]) => {
          if (err) {
            resolve(NextResponse.json(
              { success: false, error: 'Failed to fetch news' },
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
    console.error('Error in news API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST - Create new news (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    
    if (!session.adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, image_url } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      db.run(
        'INSERT INTO news (title, content, image_url) VALUES (?, ?, ?)',
        [title, content, image_url || null],
        function(err) {
          if (err) {
            resolve(NextResponse.json(
              { success: false, error: 'Failed to create news' },
              { status: 500 }
            ));
          } else {
            resolve(NextResponse.json({
              success: true,
              data: {
                id: this.lastID,
                title,
                content,
                image_url
              }
            }));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create news' },
      { status: 500 }
    );
  }
}


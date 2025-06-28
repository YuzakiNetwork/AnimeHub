import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../../lib/database';
import { getSessionFromRequest } from '../../../../../lib/auth';

interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// GET - Fetch single news by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsId = parseInt(params.id);
    
    if (isNaN(newsId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid news ID' },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      db.get(
        'SELECT * FROM news WHERE id = ?',
        [newsId],
        (err, row: News) => {
          if (err) {
            resolve(NextResponse.json(
              { success: false, error: 'Failed to fetch news' },
              { status: 500 }
            ));
          } else if (!row) {
            resolve(NextResponse.json(
              { success: false, error: 'News not found' },
              { status: 404 }
            ));
          } else {
            resolve(NextResponse.json({
              success: true,
              data: row
            }));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in news detail API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// PUT - Update news (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(request);
    
    if (!session.adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const newsId = parseInt(params.id);
    
    if (isNaN(newsId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid news ID' },
        { status: 400 }
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
        'UPDATE news SET title = ?, content = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, content, image_url || null, newsId],
        function(err) {
          if (err) {
            resolve(NextResponse.json(
              { success: false, error: 'Failed to update news' },
              { status: 500 }
            ));
          } else if (this.changes === 0) {
            resolve(NextResponse.json(
              { success: false, error: 'News not found' },
              { status: 404 }
            ));
          } else {
            resolve(NextResponse.json({
              success: true,
              data: {
                id: newsId,
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
    console.error('Error updating news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

// DELETE - Delete news (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(request);
    
    if (!session.adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const newsId = parseInt(params.id);
    
    if (isNaN(newsId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid news ID' },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      db.run(
        'DELETE FROM news WHERE id = ?',
        [newsId],
        function(err) {
          if (err) {
            resolve(NextResponse.json(
              { success: false, error: 'Failed to delete news' },
              { status: 500 }
            ));
          } else if (this.changes === 0) {
            resolve(NextResponse.json(
              { success: false, error: 'News not found' },
              { status: 404 }
            ));
          } else {
            resolve(NextResponse.json({
              success: true,
              message: 'News deleted successfully'
            }));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}


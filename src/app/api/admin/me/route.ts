import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, AuthService } from '../../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    
    if (!session.adminId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const admin = await AuthService.getAdminById(session.adminId);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        created_at: admin.created_at
      }
    });
  } catch (error) {
    console.error('Error in admin me API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get admin info' },
      { status: 500 }
    );
  }
}


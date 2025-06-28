import { NextRequest, NextResponse } from 'next/server';
import { AuthService, createSessionCookie } from '../../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const admin = await AuthService.verifyAdmin(username, password);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session cookie
    const sessionCookie = createSessionCookie(admin.id);

    const response = NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username
      }
    });

    // Set session cookie
    response.cookies.set('admin_session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error in admin login:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-admin';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // 验证token
    const decoded = verify(token, JWT_SECRET) as any;

    // 检查token是否有效且是管理员
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        email: decoded.email,
        role: decoded.role
      }
    });

  } catch (error) {
    console.error('Admin token verification error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
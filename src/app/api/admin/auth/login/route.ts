import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

// 硬编码的管理员账户信息
const ADMIN_CREDENTIALS = {
  email: 'info@qixin.com.au',
  password: 'qixin@782540'
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 验证管理员凭据
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 生成JWT token
    const token = sign(
      { 
        email: ADMIN_CREDENTIALS.email,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24小时过期
      },
      JWT_SECRET
    );

    // 设置httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email: ADMIN_CREDENTIALS.email,
        role: 'admin'
      }
    });

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24小时
    });

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
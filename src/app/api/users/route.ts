import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { 
  getUserByEmail, 
  createOrUpdateUser, 
  updateUser, 
  deleteUser,
  User 
} from '@/lib/firebase/services/user';

// NextAuth配置
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }: any) {
      if (account?.id_token) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token?.sub && session.user) {
        (session.user as any).id = token.sub;
      }
      if (token?.id_token) {
        (session as any).idToken = token.id_token;
      }
      return session;
    },
  },
};

// GET - 获取用户信息
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const user = await getUserByEmail(userEmail);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('[Users API] Error getting user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - 创建或更新用户信息
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const body = await request.json();
    
    // 验证必要字段
    if (!body.firstName || !body.lastName) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
    }

    // 创建用户数据对象
    const userData: User = {
      email: userEmail,
      firstName: body.firstName,
      lastName: body.lastName,
      phoneNumber: body.phoneNumber || '',
      position: body.position || '',
      company: body.company || '',
      avatar: body.avatar || ''
    };

    await createOrUpdateUser(userData);
    
    return NextResponse.json({ 
      message: 'User created/updated successfully',
      user: userData 
    });
  } catch (error: any) {
    console.error('[Users API] Error creating/updating user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - 更新用户信息
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const body = await request.json();
    
    // 移除不应该更新的字段
    const { email, createdAt, updatedAt, ...updateData } = body;
    
    await updateUser(userEmail, updateData);
    
    return NextResponse.json({ 
      message: 'User updated successfully' 
    });
  } catch (error: any) {
    console.error('[Users API] Error updating user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - 删除用户
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;
    await deleteUser(userEmail);
    
    return NextResponse.json({ 
      message: 'User deleted successfully' 
    });
  } catch (error: any) {
    console.error('[Users API] Error deleting user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
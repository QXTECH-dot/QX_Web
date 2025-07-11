import { NextRequest, NextResponse } from 'next/server';
import { getBlogs } from '@/lib/firebase/services/blog';

// GET - 获取公开的博客文章
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    // 只获取已发布的博客
    const { blogs, totalCount } = await getBlogs({
      status: 'published',
      category: category || undefined,
      limit,
      page,
      search: search || undefined
    });

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Get public blogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
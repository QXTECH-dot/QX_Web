import { NextRequest, NextResponse } from 'next/server';
import { getBlogBySlug, incrementBlogViews } from '@/lib/firebase/services/blog';

// GET - 获取单个博客文章（通过slug）
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    const blog = await getBlogBySlug(slug);
    if (!blog || blog.status !== 'published') {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // 增加浏览量
    if (blog.id) {
      await incrementBlogViews(blog.id);
    }

    return NextResponse.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Get blog by slug error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { 
  getBlogs, 
  createBlog, 
  getBlogStats,
  Blog
} from '@/lib/firebase/services/blog';

// 验证管理员权限的中间件函数 - 临时禁用
function verifyAdminToken(request: NextRequest) {
  // 临时返回admin用户，跳过验证
  return { role: 'admin', email: 'admin@qxnet.com' };
}

// GET - 获取所有博客
export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';

    // 获取博客数据
    const { blogs, totalCount } = await getBlogs({
      status: status as any,
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
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - 创建新博客
export async function POST(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // 验证必填字段
    if (!data.title || !data.content || !data.author || !data.category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, author, category' },
        { status: 400 }
      );
    }

    // 创建博客数据
    const blogData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'> = {
      title: data.title,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
      content: data.content || [],
      excerpt: data.excerpt || '',
      category: data.category,
      tags: data.tags || [],
      author: data.author,
      publishedAt: data.publishedAt || new Date().toISOString(),
      image: data.image || '',
      readTime: data.readTime || 0,
      status: data.status || 'draft',
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt || '',
      views: 0,
      isFeatured: data.isFeatured || false,
      seoKeywords: data.seoKeywords || []
    };

    const blogId = await createBlog(blogData);

    return NextResponse.json({
      success: true,
      data: {
        id: blogId,
        ...blogData
      }
    });

  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
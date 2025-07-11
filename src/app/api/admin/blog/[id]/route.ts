import { NextRequest, NextResponse } from 'next/server';
import { 
  getBlogById, 
  updateBlog, 
  deleteBlog
} from '@/lib/firebase/services/blog';

// 验证管理员权限的中间件函数 - 临时禁用
function verifyAdminToken(request: NextRequest) {
  // 临时返回admin用户，跳过验证
  return { role: 'admin', email: 'admin@qxnet.com' };
}

// GET - 获取单个博客详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    const blog = await getBlogById(id);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Get blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - 更新博客信息
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const data = await request.json();
    
    console.log('PUT request received for blog:', id);
    console.log('Request data:', JSON.stringify(data, null, 2));

    // 更新博客数据
    const blogData = {
      title: data.title,
      slug: data.slug,
      content: data.content || [],
      excerpt: data.excerpt || '',
      category: data.category,
      tags: data.tags || [],
      author: data.author,
      publishedAt: data.publishedAt,
      image: data.image || '',
      readTime: data.readTime || 0,
      status: data.status || 'draft',
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt || '',
      isFeatured: data.isFeatured || false,
      seoKeywords: data.seoKeywords || []
    };

    await updateBlog(id, blogData);
    
    console.log('Blog update completed successfully for:', id);
    
    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully'
    });

  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - 删除博客
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    await deleteBlog(id);

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
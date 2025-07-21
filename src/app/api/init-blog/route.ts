import { NextRequest, NextResponse } from 'next/server';
import { createBlog } from '@/lib/firebase/services/blog';

export async function GET(request: NextRequest) {
  try {
    // 创建一个示例博客
    const sampleBlog = {
      title: 'Welcome to QX Web Blog',
      slug: 'welcome-to-qx-web-blog',
      content: [
        {
          id: '1',
          type: 'paragraph' as const,
          content: 'Welcome to our new blog! Here you will find insights about Australian businesses, technology trends, and industry news.',
          order: 1
        },
        {
          id: '2',
          type: 'heading' as const,
          content: 'What to Expect',
          level: 2,
          order: 2
        },
        {
          id: '3',
          type: 'paragraph' as const,
          content: 'We will be sharing regular updates about the Australian business landscape, including company profiles, industry analysis, and market trends.',
          order: 3
        }
      ],
      excerpt: 'Welcome to our new blog! Here you will find insights about Australian businesses and technology trends.',
      category: 'General',
      tags: ['welcome', 'announcement'],
      author: 'QX Web Team',
      publishedAt: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
      readTime: 2,
      status: 'published' as const,
      metaTitle: 'Welcome to QX Web Blog',
      metaDescription: 'Welcome to our new blog featuring insights about Australian businesses and technology trends.',
      views: 0,
      isFeatured: true,
      seoKeywords: ['qx web', 'blog', 'australian business']
    };

    const blogId = await createBlog(sampleBlog);

    return NextResponse.json({
      success: true,
      message: 'Sample blog created successfully',
      blogId
    });
  } catch (error) {
    console.error('Error creating sample blog:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
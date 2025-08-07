import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 测试blog数据...');
    
    // 检查blogs集合
    const blogsRef = collection(db, 'blogs');
    const allBlogsSnapshot = await getDocs(blogsRef);
    
    console.log(`📊 总共找到 ${allBlogsSnapshot.size} 个blog文档`);
    
    // 统计不同状态的blog
    const blogStats = {
      total: allBlogsSnapshot.size,
      published: 0,
      draft: 0,
      archived: 0,
      other: 0
    };
    
    const sampleBlogs: any[] = [];
    
    allBlogsSnapshot.forEach(doc => {
      const data = doc.data();
      
      switch (data.status) {
        case 'published': blogStats.published++; break;
        case 'draft': blogStats.draft++; break;
        case 'archived': blogStats.archived++; break;
        default: blogStats.other++; break;
      }
      
      // 收集前5个blog样本
      if (sampleBlogs.length < 5) {
        sampleBlogs.push({
          id: doc.id,
          title: data.title || 'No title',
          status: data.status || 'unknown',
          publishedAt: data.publishedAt || 'no date',
          excerpt: (data.excerpt || '').substring(0, 100) + '...',
          image: data.image || 'no image'
        });
      }
    });
    
    // 专门查询published状态的blog
    const publishedQuery = query(blogsRef, where('status', '==', 'published'), limit(3));
    const publishedSnapshot = await getDocs(publishedQuery);
    
    const publishedBlogs: any[] = [];
    publishedSnapshot.forEach(doc => {
      const data = doc.data();
      publishedBlogs.push({
        id: doc.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        publishedAt: data.publishedAt,
        image: data.image,
        readTime: data.readTime,
        category: data.category,
        author: data.author,
        status: data.status
      });
    });
    
    return NextResponse.json({
      success: true,
      statistics: blogStats,
      sampleBlogs,
      publishedBlogs,
      publishedCount: publishedSnapshot.size,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 测试blog数据失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
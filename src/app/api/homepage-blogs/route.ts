import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 获取首页blog数据...');
    
    // 查询已发布的blog，限制3个
    const blogsRef = collection(db, 'blogs');
    const publishedQuery = query(
      blogsRef, 
      where('status', '==', 'published'),
      limit(3)
    );
    
    const snapshot = await getDocs(publishedQuery);
    console.log(`📊 找到 ${snapshot.size} 个已发布的blog`);
    
    const blogs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'No Title',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        publishedAt: data.publishedAt || '',
        image: data.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
        readTime: data.readTime || 5,
        category: data.category || '',
        author: data.author || 'QX Web'
      };
    });
    
    // 按发布日期排序（最新的在前）
    blogs.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
    
    console.log('✅ 首页blog数据准备完成:', blogs.length, '个');
    
    return NextResponse.json({
      success: true,
      data: blogs,
      count: blogs.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 获取首页blog数据失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
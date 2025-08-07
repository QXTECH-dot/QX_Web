import { NextRequest, NextResponse } from 'next/server';
import { getBlogs } from '@/lib/firebase/services/blog';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('Debug: Starting blog fetch...');
    
    // 1. 直接查询所有博客
    const allBlogsSnapshot = await getDocs(collection(db, 'blogs'));
    const allBlogs = allBlogsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('Debug: All blogs count:', allBlogs.length);
    console.log('Debug: All blogs:', allBlogs.map(b => ({ id: b.id, title: b.title, status: b.status })));
    
    // 2. 查询已发布的博客
    const publishedQuery = query(collection(db, 'blogs'), where('status', '==', 'published'));
    const publishedSnapshot = await getDocs(publishedQuery);
    const publishedBlogs = publishedSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('Debug: Published blogs count:', publishedBlogs.length);
    console.log('Debug: Published blogs:', publishedBlogs.map(b => ({ id: b.id, title: b.title, status: b.status })));
    
    // 3. 使用 getBlogs 函数
    const { blogs: getBlogsResult, totalCount } = await getBlogs({
      status: 'published'
    });
    
    console.log('Debug: getBlogs result count:', getBlogsResult.length);
    console.log('Debug: getBlogs total count:', totalCount);
    
    return NextResponse.json({
      success: true,
      allBlogsCount: allBlogs.length,
      allBlogs: allBlogs,
      publishedBlogsCount: publishedBlogs.length,
      publishedBlogs: publishedBlogs,
      getBlogsResultCount: getBlogsResult.length,
      getBlogsResult: getBlogsResult,
      totalCount: totalCount
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
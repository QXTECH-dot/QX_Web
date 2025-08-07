import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('Starting blog ID migration...');
    
    // 获取所有博客
    const blogsSnapshot = await getDocs(collection(db, 'blogs'));
    const blogs = blogsSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));
    
    console.log(`Found ${blogs.length} blogs to migrate`);
    
    // 按创建时间排序（如果有的话）
    blogs.sort((a, b) => {
      const dateA = a.data.createdAt || a.data.publishedAt || '';
      const dateB = b.data.createdAt || b.data.publishedAt || '';
      return dateA.localeCompare(dateB);
    });
    
    const migrationResults = [];
    
    // 迁移每个博客
    for (let i = 0; i < blogs.length; i++) {
      const oldBlog = blogs[i];
      const newId = `blog_${String(i + 1).padStart(4, '0')}`;
      
      // 跳过已经是正确格式的博客
      if (oldBlog.id === newId) {
        migrationResults.push({
          oldId: oldBlog.id,
          newId: newId,
          status: 'skipped',
          message: 'Already in correct format'
        });
        continue;
      }
      
      try {
        // 创建新文档
        await setDoc(doc(db, 'blogs', newId), oldBlog.data);
        
        // 删除旧文档
        await deleteDoc(doc(db, 'blogs', oldBlog.id));
        
        migrationResults.push({
          oldId: oldBlog.id,
          newId: newId,
          status: 'success',
          title: oldBlog.data.title
        });
        
        console.log(`Migrated ${oldBlog.id} to ${newId}`);
      } catch (error) {
        console.error(`Failed to migrate ${oldBlog.id}:`, error);
        migrationResults.push({
          oldId: oldBlog.id,
          newId: newId,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog ID migration completed',
      totalBlogs: blogs.length,
      results: migrationResults
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
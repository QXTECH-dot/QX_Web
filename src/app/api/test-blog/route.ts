import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('Test API: Fetching all blogs...');
    
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    
    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('Test API: Found blogs:', blogs.length);
    
    return NextResponse.json({
      success: true,
      count: blogs.length,
      blogs: blogs
    });
  } catch (error) {
    console.error('Test API: Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
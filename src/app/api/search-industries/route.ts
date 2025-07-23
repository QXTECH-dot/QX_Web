import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get('search') || '';
    
    console.log('🔍 Searching for industries:', searchTerm);
    
    const industriesRef = collection(db, 'industry_classifications');
    const snapshot = await getDocs(industriesRef);
    
    // 搜索包含关键词的行业
    const results = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(industry => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (industry.popular_name && industry.popular_name.toLowerCase().includes(searchLower)) ||
          (industry.division_title && industry.division_title.toLowerCase().includes(searchLower)) ||
          (industry.subdivision_title && industry.subdivision_title.toLowerCase().includes(searchLower))
        );
      });
    
    // 按level排序
    results.sort((a, b) => (a.level || 0) - (b.level || 0));
    
    return NextResponse.json({
      success: true,
      searchTerm,
      count: results.length,
      results: results.slice(0, 10), // 返回前10个结果
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Industry search failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
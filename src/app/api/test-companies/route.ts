import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing companies collection...');
    
    // 测试companies表，按创建时间倒序
    const companiesRef = collection(db, 'companies');
    const q = query(companiesRef, orderBy('createdAt', 'desc'), limit(3));
    
    const querySnapshot = await getDocs(q);
    console.log('📊 Companies query result:', querySnapshot.size, 'documents');
    
    const companies = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unknown',
        trading_name: data.trading_name || '',
        industry_3: data.industry_3 || '',
        status: data.status || 'Unknown',
        servicesCount: data.services ? data.services.length : 0,
        createdAt: data.createdAt || 'Unknown'
      };
    });
    
    return NextResponse.json({
      success: true,
      message: 'Companies collection test successful',
      totalDocuments: querySnapshot.size,
      companies: companies,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Companies test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
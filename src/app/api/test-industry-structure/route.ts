import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing industry classifications structure...');
    
    // 获取各个级别的示例数据
    const industriesRef = collection(db, 'industry_classifications');
    
    // 获取一级行业
    const level1Query = query(industriesRef, where('level', '==', 1), limit(2));
    const level1Snapshot = await getDocs(level1Query);
    const level1Data = level1Snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // 获取二级行业
    const level2Query = query(industriesRef, where('level', '==', 2), limit(2));
    const level2Snapshot = await getDocs(level2Query);
    const level2Data = level2Snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // 获取三级行业
    const level3Query = query(industriesRef, where('level', '==', 3), limit(2));
    const level3Snapshot = await getDocs(level3Query);
    const level3Data = level3Snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({
      success: true,
      message: 'Industry structure test successful',
      data: {
        level1: level1Data,
        level2: level2Data,
        level3: level3Data
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Industry structure test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
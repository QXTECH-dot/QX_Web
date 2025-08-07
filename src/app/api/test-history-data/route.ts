import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, limit } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 检查history集合数据...');
    
    // 检查history集合
    const historyRef = collection(db, 'history');
    const historySnapshot = await getDocs(query(historyRef, limit(10)));
    
    console.log(`📊 history集合中找到 ${historySnapshot.size} 条记录`);
    
    const historyData = historySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // 检查companies集合中是否有history字段
    const companiesRef = collection(db, 'companies');
    const companiesSnapshot = await getDocs(query(companiesRef, limit(5)));
    
    const companiesWithHistory = [];
    companiesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.history && Array.isArray(data.history) && data.history.length > 0) {
        companiesWithHistory.push({
          id: doc.id,
          name: data.name,
          history: data.history
        });
      }
    });
    
    console.log(`📊 companies中有history字段的公司: ${companiesWithHistory.length} 个`);
    
    return NextResponse.json({
      success: true,
      historyCollection: {
        count: historySnapshot.size,
        data: historyData
      },
      companiesWithHistoryField: {
        count: companiesWithHistory.length,
        data: companiesWithHistory
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 检查history数据失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
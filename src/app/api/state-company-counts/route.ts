import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    console.log('Getting state company counts...');
    
    // 从offices表统计每个州的公司数量
    const officesSnapshot = await firestore.collection('offices').get();
    
    const stateCounts: { [state: string]: Set<string> } = {};
    
    officesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.state && data.companyId) {
        const state = data.state.toUpperCase();
        if (!stateCounts[state]) {
          stateCounts[state] = new Set();
        }
        stateCounts[state].add(data.companyId);
      }
    });
    
    // 转换为最终格式
    const result: { [state: string]: number } = {};
    Object.keys(stateCounts).forEach(state => {
      result[state] = stateCounts[state].size;
    });
    
    console.log('State counts:', result);
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error getting state company counts:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: {}
    }, { status: 500 });
  }
} 
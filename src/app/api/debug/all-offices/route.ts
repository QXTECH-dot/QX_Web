import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

/**
 * GET handler - 获取所有办公室数据，用于调试
 */
export async function GET() {
  try {
    console.log('Debug API: Fetching all offices');
    // 查询所有办公室
    const snapshot = await firestore.collection('offices').get();
    
    // 如果集合为空
    if (snapshot.empty) {
      console.log('Debug API: No offices found in database');
      return NextResponse.json({ offices: [] }, { status: 200 });
    }
    
    // 转换为数组
    const offices: any[] = [];
    snapshot.forEach(doc => {
      const officeData = doc.data();
      console.log('Debug API: Found office:', officeData);
      offices.push(officeData);
    });
    
    console.log(`Debug API: Returning ${offices.length} offices`);
    return NextResponse.json({ offices }, { status: 200 });
  } catch (error) {
    console.error('Debug API: Error fetching all offices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offices' },
      { status: 500 }
    );
  }
} 
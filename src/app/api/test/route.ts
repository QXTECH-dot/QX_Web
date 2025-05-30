import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';

export async function GET() {
  try {
    console.log('测试Firebase连接...');
    
    // 简单查询测试
    const snapshot = await firestore.collection('companies').limit(5).get();
    
    const companies = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      location: doc.data().location
    }));

    return NextResponse.json({
      success: true,
      message: 'Firebase连接成功！',
      totalCompanies: snapshot.size,
      sampleCompanies: companies,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Firebase连接测试失败:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const popularName = searchParams.get('popular_name');
    const popularCode = searchParams.get('popular_code');
    
    if (!popularName && !popularCode) {
      return NextResponse.json({
        success: false,
        error: 'popular_name or popular_code parameter is required'
      }, { status: 400 });
    }
    
    console.log(`🔍 获取服务数据 - popular_name: ${popularName}, popular_code: ${popularCode}`);
    
    // 查询industry_services表获取对应的服务
    const servicesRef = collection(db, 'industry_services');
    let q;
    
    if (popularCode) {
      q = query(servicesRef, where('popular_code', '==', popularCode));
    } else {
      q = query(servicesRef, where('popular_name', '==', popularName));
    }
    
    const querySnapshot = await getDocs(q);
    console.log(`📊 找到 ${querySnapshot.size} 个服务项目`);
    
    const services = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        service_name: data.service_name || '',
        service_description: data.service_description || '',
        popular_name: data.popular_name || '',
        popular_code: data.popular_code || '',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
    });
    
    return NextResponse.json({
      success: true,
      data: services,
      count: services.length,
      industry: {
        popular_name: popularName || services[0]?.popular_name || '',
        popular_code: popularCode || services[0]?.popular_code || ''
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 获取服务数据失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
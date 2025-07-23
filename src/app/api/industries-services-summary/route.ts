import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 生成行业和服务数据总结...');
    
    // 获取行业分类统计
    const industriesRef = collection(db, 'industry_classifications');
    const industriesSnapshot = await getDocs(industriesRef);
    
    const industryStats = {
      total: 0,
      level1: 0,
      level2: 0,
      level3: 0,
      newIndustries: 0
    };
    
    const sampleIndustries: any[] = [];
    
    industriesSnapshot.forEach(doc => {
      const data = doc.data();
      industryStats.total++;
      
      switch (data.level) {
        case 1: industryStats.level1++; break;
        case 2: industryStats.level2++; break;
        case 3: industryStats.level3++; break;
      }
      
      if (data.popular_code?.startsWith('NEW_')) {
        industryStats.newIndustries++;
      }
      
      // 收集一些样本
      if (sampleIndustries.length < 10) {
        sampleIndustries.push({
          name: data.popular_name || data.division_title || data.subdivision_title,
          code: data.popular_code,
          level: data.level
        });
      }
    });
    
    // 获取服务统计
    const servicesRef = collection(db, 'industry_services');
    const servicesSnapshot = await getDocs(servicesRef);
    
    const serviceStats = {
      total: 0,
      byIndustry: new Map<string, number>(),
      newServices: 0
    };
    
    const sampleServices: any[] = [];
    
    servicesSnapshot.forEach(doc => {
      const data = doc.data();
      serviceStats.total++;
      
      const industryName = data.popular_name;
      if (industryName) {
        serviceStats.byIndustry.set(
          industryName, 
          (serviceStats.byIndustry.get(industryName) || 0) + 1
        );
      }
      
      if (data.popular_code?.startsWith('NEW_')) {
        serviceStats.newServices++;
      }
      
      // 收集一些样本
      if (sampleServices.length < 10) {
        sampleServices.push({
          name: data.service_name,
          industry: data.popular_name,
          code: data.popular_code
        });
      }
    });
    
    // 转换Map为数组并排序
    const topIndustriesByServices = Array.from(serviceStats.byIndustry.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([industry, count]) => ({ industry, serviceCount: count }));
    
    console.log('✅ 总结生成完成！');
    
    return NextResponse.json({
      success: true,
      summary: {
        industries: industryStats,
        services: {
          total: serviceStats.total,
          newServices: serviceStats.newServices,
          industriesCovered: serviceStats.byIndustry.size
        },
        topIndustriesByServices,
        samples: {
          industries: sampleIndustries,
          services: sampleServices
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 总结生成失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
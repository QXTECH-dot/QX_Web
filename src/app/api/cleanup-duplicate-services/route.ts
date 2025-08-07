import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, writeBatch, doc, deleteDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 开始清理重复的服务数据...');
    
    const servicesRef = collection(db, 'industry_services');
    const snapshot = await getDocs(servicesRef);
    
    console.log(`📊 找到 ${snapshot.size} 个服务记录`);
    
    // 按 popular_name + service_name 分组找重复项
    const serviceGroups = new Map<string, any[]>();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const key = `${data.popular_name}_${data.service_name}`.toLowerCase();
      
      if (!serviceGroups.has(key)) {
        serviceGroups.set(key, []);
      }
      
      serviceGroups.get(key)!.push({
        id: doc.id,
        ...data
      });
    });
    
    console.log(`📊 找到 ${serviceGroups.size} 个不同的服务组合`);
    
    // 找出重复项
    let duplicateCount = 0;
    let keepCount = 0;
    const toDelete: string[] = [];
    
    serviceGroups.forEach((services, key) => {
      if (services.length > 1) {
        console.log(`🔍 发现重复服务: ${key} (${services.length} 个重复)`);
        
        // 优先保留新格式的数据（有更完整的字段）
        services.sort((a, b) => {
          // 优先保留有 industry_level 字段的（新数据）
          if (a.industry_level && !b.industry_level) return -1;
          if (!a.industry_level && b.industry_level) return 1;
          
          // 其次按创建时间排序
          const aTime = a.created_at?.seconds || a.created_at || 0;
          const bTime = b.created_at?.seconds || b.created_at || 0;
          return bTime - aTime; // 新的在前
        });
        
        // 保留第一个，删除其余的
        for (let i = 1; i < services.length; i++) {
          toDelete.push(services[i].id);
          duplicateCount++;
        }
        keepCount++;
      } else {
        keepCount++;
      }
    });
    
    console.log(`📊 需要删除 ${duplicateCount} 个重复记录，保留 ${keepCount} 个唯一记录`);
    
    if (toDelete.length > 0) {
      console.log('🔄 开始删除重复记录...');
      
      // 分批删除
      const batchSize = 450;
      let deletedCount = 0;
      
      for (let i = 0; i < toDelete.length; i += batchSize) {
        const batch = writeBatch(db);
        const batchIds = toDelete.slice(i, i + batchSize);
        
        batchIds.forEach(serviceId => {
          const serviceDoc = doc(db, 'industry_services', serviceId);
          batch.delete(serviceDoc);
        });
        
        await batch.commit();
        deletedCount += batchIds.length;
        console.log(`🗑️ 已删除 ${deletedCount}/${toDelete.length} 个重复记录`);
      }
    }
    
    console.log('✅ 清理完成！');
    
    return NextResponse.json({
      success: true,
      message: '重复服务数据清理完成',
      statistics: {
        totalRecords: snapshot.size,
        uniqueServices: serviceGroups.size,
        duplicatesFound: duplicateCount,
        duplicatesDeleted: toDelete.length,
        finalCount: keepCount
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 清理失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
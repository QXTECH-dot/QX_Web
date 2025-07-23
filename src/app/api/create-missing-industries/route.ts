import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, writeBatch, doc, query, where } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 开始创建缺失的行业分类...');
    
    // 获取有 "UNKNOWN" popular_code 的服务
    const servicesRef = collection(db, 'industry_services');
    const unknownQuery = query(servicesRef, where('popular_code', '==', 'UNKNOWN'));
    const unknownSnapshot = await getDocs(unknownQuery);
    
    // 收集所有未映射的行业名称
    const missingIndustries = new Set<string>();
    unknownSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.popular_name) {
        missingIndustries.add(data.popular_name);
      }
    });
    
    console.log(`📊 找到 ${missingIndustries.size} 个缺失的行业分类:`, Array.from(missingIndustries));
    
    if (missingIndustries.size === 0) {
      return NextResponse.json({
        success: true,
        message: '没有找到缺失的行业分类',
        created: 0
      });
    }
    
    // 生成行业分类数据
    const industriesRef = collection(db, 'industry_classifications');
    const newIndustries: any[] = [];
    
    let counter = 1;
    missingIndustries.forEach(industryName => {
      const popularCode = `NEW_${counter.toString().padStart(3, '0')}`;
      
      newIndustries.push({
        id: popularCode,
        popular_name: industryName,
        popular_code: popularCode,
        level: 3, // 默认为三级行业
        division_code: 'X', // 新增分类使用 X
        division_title: 'Additional Services',
        subdivision_code: 'X1',
        subdivision_title: 'Professional Services',
        created_at: new Date(),
        updated_at: new Date(),
        status: 1,
        active: true,
        sort_order: 9000 + counter // 排在后面
      });
      
      counter++;
    });
    
    console.log(`🔄 准备创建 ${newIndustries.length} 个新的行业分类...`);
    
    // 批量创建行业分类
    const batch = writeBatch(db);
    newIndustries.forEach(industry => {
      const industryDoc = doc(industriesRef, industry.id);
      batch.set(industryDoc, industry);
    });
    
    await batch.commit();
    console.log('✅ 新行业分类创建完成！');
    
    // 更新对应的服务记录
    console.log('🔄 更新服务记录的 popular_code...');
    
    let updatedServices = 0;
    
    // 为每个新行业更新对应的服务
    for (const industry of newIndustries) {
      const updateQuery = query(servicesRef, 
        where('popular_name', '==', industry.popular_name),
        where('popular_code', '==', 'UNKNOWN')
      );
      
      const updateSnapshot = await getDocs(updateQuery);
      
      if (updateSnapshot.size > 0) {
        const updateBatch = writeBatch(db);
        
        updateSnapshot.forEach(serviceDoc => {
          const serviceRef = doc(db, 'industry_services', serviceDoc.id);
          updateBatch.update(serviceRef, {
            popular_code: industry.popular_code,
            updated_at: new Date()
          });
        });
        
        await updateBatch.commit();
        updatedServices += updateSnapshot.size;
        console.log(`📝 更新了 ${updateSnapshot.size} 个 "${industry.popular_name}" 的服务记录`);
      }
    }
    
    console.log('✅ 所有更新完成！');
    
    return NextResponse.json({
      success: true,
      message: '缺失的行业分类创建完成',
      statistics: {
        missingIndustries: missingIndustries.size,
        newIndustriesCreated: newIndustries.length,
        servicesUpdated: updatedServices
      },
      newIndustries: newIndustries.map(i => ({
        name: i.popular_name,
        code: i.popular_code
      })),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 创建失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
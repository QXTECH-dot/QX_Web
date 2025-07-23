import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 开始处理新的Industries_Services.csv文件...');
    
    // 读取CSV文件
    const csvPath = path.join(process.cwd(), 'QX Net company data', 'Industries_Services.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV文件不存在: ${csvPath}`);
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    console.log(`📊 CSV文件包含 ${lines.length - 1} 行数据（除去标题行）`);
    
    // 解析CSV数据
    const services: any[] = [];
    const headers = lines[0].split(',').map(h => h.replace(/\"/g, '').trim());
    console.log('📋 CSV标题:', headers);
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= 3) {
        const popular_name = values[0].replace(/\"/g, '').trim().replace(/^﻿/, ''); // 移除BOM
        const service_name = values[1].replace(/\"/g, '').trim();
        const service_description = values[2].replace(/\"/g, '').trim();
        
        if (popular_name && service_name) {
          services.push({
            popular_name,
            service_name,
            service_description
          });
        }
      }
    }
    
    console.log(`✅ 解析出 ${services.length} 个服务项目`);
    
    // 获取现有的industry_classifications数据进行映射
    console.log('🔄 获取现有行业分类数据...');
    const industriesRef = collection(db, 'industry_classifications');
    const industriesSnapshot = await getDocs(industriesRef);
    
    const industryMap = new Map<string, any>();
    industriesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.popular_name) {
        industryMap.set(data.popular_name.toLowerCase(), {
          id: doc.id,
          popular_code: data.popular_code,
          popular_name: data.popular_name,
          level: data.level
        });
      }
    });
    
    console.log(`📊 找到 ${industryMap.size} 个现有行业分类`);
    
    // 映射服务到行业代码
    const mappedServices: any[] = [];
    const unmappedIndustries = new Set<string>();
    
    services.forEach(service => {
      const industryKey = service.popular_name.toLowerCase();
      const industry = industryMap.get(industryKey);
      
      if (industry) {
        // 生成服务ID
        const serviceId = generateServiceId(industry.popular_code, service.service_name);
        
        mappedServices.push({
          id: serviceId,
          service_name: service.service_name,
          service_description: service.service_description,
          popular_name: industry.popular_name, // 使用标准化的名称
          popular_code: industry.popular_code,
          industry_level: industry.level,
          created_at: new Date(),
          updated_at: new Date()
        });
      } else {
        unmappedIndustries.add(service.popular_name);
      }
    });
    
    console.log(`✅ 成功映射 ${mappedServices.length} 个服务`);
    console.log(`⚠️ 未映射的行业 (${unmappedIndustries.size}个):`, Array.from(unmappedIndustries).slice(0, 10));
    
    // 批量上传到Firebase
    console.log('🔄 开始批量上传到Firebase...');
    
    const batch = writeBatch(db);
    const servicesRef = collection(db, 'industry_services');
    
    // 分批处理（Firebase批处理限制为500）
    const batchSize = 450; // 留点余量
    let uploadCount = 0;
    
    for (let i = 0; i < mappedServices.length; i += batchSize) {
      const currentBatch = writeBatch(db);
      const batchServices = mappedServices.slice(i, i + batchSize);
      
      batchServices.forEach(service => {
        const serviceDoc = doc(servicesRef, service.id);
        currentBatch.set(serviceDoc, service);
      });
      
      await currentBatch.commit();
      uploadCount += batchServices.length;
      console.log(`📤 已上传 ${uploadCount}/${mappedServices.length} 个服务`);
    }
    
    console.log('✅ 所有服务上传完成！');
    
    return NextResponse.json({
      success: true,
      message: '新的Industries_Services数据处理完成',
      statistics: {
        totalInCsv: services.length,
        mapped: mappedServices.length,
        uploaded: uploadCount,
        unmappedIndustries: unmappedIndustries.size,
        unmappedList: Array.from(unmappedIndustries).slice(0, 20)
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 处理失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// 简单的CSV行解析
function parseCSVLine(line: string): string[] {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '\"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}

// 生成服务ID
function generateServiceId(popularCode: string, serviceName: string): string {
  // 清理服务名称，只保留字母和数字
  const cleanName = serviceName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 20);
  
  return `${popularCode}_${cleanName}`;
}
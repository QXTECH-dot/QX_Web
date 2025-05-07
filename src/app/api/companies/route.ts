import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Company } from '@/types/company';
import { Office } from '@/types/office';
import { DocumentData, Query, CollectionReference } from 'firebase-admin/firestore';

// 告诉 Next.js 这个路由需要动态处理
export const dynamic = 'force-dynamic';

/**
 * GET 处理器 - 获取公司数据，支持搜索功能和权重排序
 */
export async function GET(request: Request) {
  console.log('GET /api/companies - Starting request processing');
  
  try {
    // 获取 URL 并解析查询参数
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('query') || '';
    const location = searchParams.get('location') || '';
    const abn = searchParams.get('abn') || '';
    const industry = searchParams.get('industry') || '';
    const services = searchParams.getAll('service');
    
    console.log('Search params:', { query, location, abn, industry, services });
    
    // 检查 Firebase Admin 是否已初始化
    if (!firestore) {
      console.error('Firestore is not initialized');
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }
    
    // 开始构建 Firestore 查询
    let companiesQuery: Query<DocumentData> | CollectionReference<DocumentData> = firestore.collection('companies');
    
    try {
      console.log('Starting Firestore query construction');
      
      // 如果有 ABN 查询，优先使用 ABN 查询（精确匹配）
      if (abn) {
        console.log('Adding ABN filter:', abn);
        companiesQuery = (companiesQuery as CollectionReference<DocumentData>).where('abn', '==', abn);
      }
      
      // 如果有行业查询
      if (industry) {
        console.log('Adding industry filter:', industry);
        companiesQuery = (companiesQuery as CollectionReference<DocumentData>).where('industry', '==', industry);
      }
      
      console.log('Executing base query');
      // 执行基础查询
      let snapshot = await companiesQuery.get();
      
      // 如果集合不存在或为空
      if (snapshot.empty) {
        console.log('No companies found matching the query');
        return NextResponse.json({ companies: [] }, { status: 200 });
      }
      
      console.log(`Found ${snapshot.docs.length} companies`);
      
      // 获取所有公司 ID
      const companyIds = snapshot.docs.map(doc => doc.id);
      
      // 将公司 ID 分成最多 30 个一组的批次
      const batchSize = 30;
      const companyIdBatches = [];
      for (let i = 0; i < companyIds.length; i += batchSize) {
        companyIdBatches.push(companyIds.slice(i, i + batchSize));
      }
      
      console.log(`Split companies into ${companyIdBatches.length} batches`);
      
      // 办公室数据映射
      const officesByCompany: Record<string, Office[]> = {};
      
      // 批量查询办公室数据
      for (const batch of companyIdBatches) {
        console.log(`Querying offices for batch of ${batch.length} companies`);
        try {
          const batchOfficesSnapshot = await firestore.collection('offices')
            .where('companyId', 'in', batch)
            .get();
          
          batchOfficesSnapshot.docs.forEach(officeDoc => {
            const officeData = officeDoc.data();
            const companyId = officeData.companyId as string;
            
            if (!officesByCompany[companyId]) {
              officesByCompany[companyId] = [];
            }
            
            const office: Office = {
              id: officeDoc.id,
              officeId: officeDoc.id,
              companyId: companyId,
              name: officeData.name || '',
              address: officeData.address || '',
              city: officeData.city || '',
              state: officeData.state || '',
              country: officeData.country || 'Australia',
              latitude: officeData.latitude || 0,
              longitude: officeData.longitude || 0,
              isHeadquarter: officeData.isHeadquarter || false,
              createdAt: officeData.createdAt,
              updatedAt: officeData.updatedAt
            };
            
            officesByCompany[companyId].push(office);
          });
        } catch (error) {
          console.error('Error querying offices:', error);
          throw error;
        }
      }
      
      console.log('Finished querying offices');
      
      // 服务数据映射
      const servicesByCompany: Record<string, string[]> = {};
      
      // 批量查询服务数据
      for (const batch of companyIdBatches) {
        console.log(`Querying services for batch of ${batch.length} companies`);
        try {
          const batchServicesSnapshot = await firestore.collection('services')
            .where('companyId', 'in', batch)
            .get();
          
          batchServicesSnapshot.docs.forEach(serviceDoc => {
            const serviceData = serviceDoc.data();
            const companyId = serviceData.companyId as string;
            
            if (!servicesByCompany[companyId]) {
              servicesByCompany[companyId] = [];
            }
            
            servicesByCompany[companyId].push(serviceData.title || '');
          });
        } catch (error) {
          console.error('Error querying services:', error);
          throw error;
        }
      }
      
      console.log('Finished querying services');
      
      // 组合所有数据
      let companies = snapshot.docs.map(doc => {
        const data = doc.data();
        const companyId = doc.id;
        
        return {
          id: companyId,
          ...data as Omit<Company, 'id'>,
          offices: officesByCompany[companyId] || [],
          services: servicesByCompany[companyId] || []
        };
      });
      
      console.log('Combined all data for companies');
      
      // 应用位置过滤
      if (location) {
        console.log('Applying location filter:', location);
        
        // 将位置参数拆分为多个地区
        const locations = location.split(',').map(loc => loc.trim().toLowerCase());
        console.log('Locations after splitting:', locations);
        
        companies = companies.filter(company => {
          // 如果没有选择地区，则不进行筛选
          if (locations.length === 0) {
            return true;
          }
          
          // 检查公司自身的 location 字段
          if (company.location) {
            const companyLocation = company.location.toLowerCase();
            // 检查任何地区是否匹配公司位置
            for (const loc of locations) {
              if (companyLocation.includes(loc)) {
                return true;
              }
            }
          }
          
          // 检查公司的办公室是否在任何选定地区
          if (company.offices && company.offices.length > 0) {
            return company.offices.some(office => {
              if (!office.state) return false;
              
              const stateValue = office.state.toLowerCase();
              
              // 检查任何地区是否匹配办公室的州/地区
              return locations.some(loc => 
                stateValue === loc || 
                stateValue.includes(loc)
              );
            });
          }
          
          return false;
        });
        
        console.log(`After location filtering, found ${companies.length} companies`);
      }
      
      // 应用通用查询过滤和权重排序
      if (query) {
        console.log('Applying query filter:', query);
        const queryLower = query.toLowerCase();
        
        // 创建带有权重得分的公司数组
        const scoredCompanies = companies.map(company => {
          // 初始化匹配得分
          let score = 0;
          let matchFields: string[] = [];
          
          // 名称匹配 - 最高权重 (10分)
          if (company.name_en && typeof company.name_en === 'string' && company.name_en.toLowerCase().includes(queryLower)) {
            score += 10;
            matchFields.push('name');
          }
          
          // ABN 匹配 - 高权重 (8分)
          if (company.abn && typeof company.abn === 'string' && company.abn.includes(queryLower)) {
            score += 8;
            matchFields.push('abn');
          }
          
          // 行业匹配 - 中高权重 (6分)
          if (company.industry && typeof company.industry === 'string' && company.industry.toLowerCase().includes(queryLower)) {
            score += 6;
            matchFields.push('industry');
          }
          
          // 服务匹配 - 中等权重 (5分)
          if (company.services && Array.isArray(company.services) && company.services.some(s => 
            typeof s === 'string' && s.toLowerCase().includes(queryLower)
          )) {
            score += 5;
            matchFields.push('services');
          }
          
          // 简介匹配 - 中低权重 (4分)
          if (company.shortDescription && typeof company.shortDescription === 'string' && 
              company.shortDescription.toLowerCase().includes(queryLower)) {
            score += 4;
            matchFields.push('shortDescription');
          }
          
          // 详细描述匹配 - 低权重 (3分)
          if (company.description && typeof company.description === 'string' && 
              company.description.toLowerCase().includes(queryLower)) {
            score += 3;
            matchFields.push('description');
          }
          
          // 团队规模匹配 - 低权重 (2分)
          if (company.teamSize && typeof company.teamSize === 'string' && 
              company.teamSize.toLowerCase().includes(queryLower)) {
            score += 2;
            matchFields.push('teamSize');
          }
          
          // 任何其他字段匹配 - 最低权重 (1分)
          const otherFields = ['slogan', 'website', 'email', 'phone'] as const;
          for (const field of otherFields) {
            const value = (company as any)[field];
            if (value && typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
              score += 1;
              matchFields.push(field);
            }
          }
          
          return {
            ...company,
            _score: score,
            _matchFields: matchFields
          };
        });
        
        // 按得分排序
        companies = scoredCompanies
          .filter(company => company._score > 0)
          .sort((a, b) => b._score - a._score)
          .map(({ _score, _matchFields, ...company }) => company);
      }
      
      console.log(`Returning ${companies.length} companies`);
      return NextResponse.json({ companies }, { status: 200 });
    } catch (error) {
      console.error('Error in Firestore query:', error);
      return NextResponse.json(
        { error: 'Failed to query Firestore database', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/companies:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST 处理器 - 创建新公司
 * 可以在后续扩展
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 这里可以添加数据验证逻辑
    
    // 创建新的公司文档
    const docRef = await firestore.collection('companies').add(data);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Company created successfully',
        id: docRef.id 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
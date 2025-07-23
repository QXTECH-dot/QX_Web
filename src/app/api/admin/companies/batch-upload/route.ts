import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, doc, setDoc, writeBatch } from 'firebase/firestore';

interface CompanyCSVData {
  name: string;
  trading_name?: string;
  abn?: string;
  industry?: string;
  industry_1?: string;
  industry_2?: string;
  industry_3?: string;
  status?: 'active' | 'pending' | 'suspended';
  foundedYear?: number;
  website?: string;
  email?: string;
  phone?: string;
  employeeCount?: string;
  shortDescription?: string;
  fullDescription?: string;
  // Office information
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

interface GeneratedService {
  title: string;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    const { companies } = await request.json() as { companies: CompanyCSVData[] };
    
    if (!companies || !Array.isArray(companies) || companies.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No companies data provided'
      }, { status: 400 });
    }
    
    console.log(`🔄 开始批量处理 ${companies.length} 个公司...`);
    
    // 1. 首先获取所有industry_services数据用于匹配
    const servicesRef = collection(db, 'industry_services');
    const servicesSnapshot = await getDocs(servicesRef);
    
    const industryServicesMap: { [key: string]: any[] } = {};
    servicesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const popularName = data.popular_name;
      
      if (popularName) {
        if (!industryServicesMap[popularName]) {
          industryServicesMap[popularName] = [];
        }
        industryServicesMap[popularName].push({
          title: data.service_name,
          description: data.service_description || ''
        });
      }
    });
    
    console.log(`📊 载入了 ${Object.keys(industryServicesMap).length} 个行业的服务模板`);
    
    // 2. 处理每个公司数据
    const processedCompanies = [];
    const results = {
      total: companies.length,
      success: 0,
      failed: 0,
      errors: [] as string[],
      servicesGenerated: 0
    };
    
    for (let i = 0; i < companies.length; i++) {
      const companyData = companies[i];
      
      try {
        // 生成唯一的公司ID和slug
        const companyId = `comp_${Date.now()}_${i}`;
        const slug = generateSlug(companyData.trading_name || companyData.name);
        
        // 确定要使用的行业名称（优先级：industry_3 > industry_2 > industry_1 > industry）
        const industryForServices = companyData.industry_3 || 
                                   companyData.industry_2 || 
                                   companyData.industry_1 || 
                                   companyData.industry;
        
        // 自动生成对应的服务
        let generatedServices: GeneratedService[] = [];
        if (industryForServices && industryServicesMap[industryForServices]) {
          generatedServices = industryServicesMap[industryForServices].map(service => ({
            title: service.title,
            description: service.description
          }));
          results.servicesGenerated += generatedServices.length;
        }
        
        // 处理办公室信息
        const offices = [];
        if (companyData.address || companyData.city || companyData.state) {
          offices.push({
            address: companyData.address || '',
            city: companyData.city || '',
            state: companyData.state || 'NSW',
            postalCode: companyData.postalCode || '',
            isHeadquarter: true
          });
        }
        
        // 构建完整的公司数据
        const processedCompany = {
          id: companyId,
          name: companyData.name,
          trading_name: companyData.trading_name || '',
          slug: slug,
          abn: companyData.abn || '',
          industry: companyData.industry || '',
          industry_1: companyData.industry_1 || '',
          industry_2: companyData.industry_2 || '',
          industry_3: companyData.industry_3 || '',
          status: companyData.status || 'pending',
          foundedYear: companyData.foundedYear || new Date().getFullYear(),
          website: companyData.website || '',
          email: companyData.email || '',
          phone: companyData.phone || '',
          employeeCount: companyData.employeeCount || '1-10',
          shortDescription: companyData.shortDescription || '',
          fullDescription: companyData.fullDescription || '',
          offices: offices,
          services: generatedServices, // 自动生成的服务
          history: [],
          languages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          verified: false,
          featured: false
        };
        
        processedCompanies.push(processedCompany);
        results.success++;
        
        if (results.success % 100 === 0) {
          console.log(`📤 已处理 ${results.success} 个公司...`);
        }
        
      } catch (error) {
        results.failed++;
        const errorMsg = `公司 "${companyData.name}" 处理失败: ${error instanceof Error ? error.message : 'Unknown error'}`;
        results.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }
    
    // 3. 批量写入Firebase（分批处理避免超时）
    const batchSize = 500; // Firebase批处理限制
    let uploadedCount = 0;
    
    for (let i = 0; i < processedCompanies.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchCompanies = processedCompanies.slice(i, i + batchSize);
      
      batchCompanies.forEach(company => {
        const docRef = doc(db, 'companies', company.id);
        batch.set(docRef, company);
      });
      
      await batch.commit();
      uploadedCount += batchCompanies.length;
      
      console.log(`📤 已上传 ${uploadedCount}/${processedCompanies.length} 个公司到数据库`);
    }
    
    console.log(`🎉 批量上传完成: 成功 ${results.success}, 失败 ${results.failed}, 生成服务 ${results.servicesGenerated} 个`);
    
    return NextResponse.json({
      success: true,
      message: '批量上传完成',
      results: {
        ...results,
        uploadedToDatabase: uploadedCount
      },
      sampleCompanies: processedCompanies.slice(0, 3) // 返回前3个作为示例
    });
    
  } catch (error) {
    console.error('❌ 批量上传失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 生成URL友好的slug
function generateSlug(name: string): string {
  if (!name) return `company-${Date.now()}`;
  
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 空格替换为横杠
    .replace(/-+/g, '-') // 多个横杠替换为一个
    .replace(/^-|-$/g, '') // 移除开头和结尾的横杠
    .trim() || `company-${Date.now()}`;
}
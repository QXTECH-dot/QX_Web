import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { 
  getCompanies, 
  createCompany, 
  updateCompany, 
  deleteCompany,
  getCompanyById,
  getOfficesByCompanyId,
  getServicesByCompanyId,
  getHistoryByCompanyId
} from '@/lib/firebase/services/company';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-admin';

// 验证管理员权限的中间件函数 - 临时禁用
function verifyAdminToken(request: NextRequest) {
  // 临时返回admin用户，跳过验证
  return { role: 'admin', email: 'admin@qxnet.com' };
  
  // 原始验证逻辑（暂时注释）
  /*
  const token = request.cookies.get('admin-token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
  */
}

// GET - 获取所有公司
export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const industry = searchParams.get('industry') || '';

    // 获取所有公司
    const companies = await getCompanies();

    // 先将公司转换为基本信息格式
    const companiesBasic = companies.map(company => ({
      id: company.companyId,
      name: company.name || company.name_en,
      trading_name: company.trading_name, // 添加trading_name字段
      slug: company.slug, // 添加slug字段
      abn: company.abn,
      industry: company.industry,
      industry_1: company.industry_1 || '', // 一级行业
      industry_2: company.industry_2 || '', // 二级行业 
      industry_3: company.industry_3 || '', // 三级行业
      status: 'active', // 默认状态，可以根据需要调整
      foundedYear: company.foundedYear,
      website: company.website,
      email: company.email,
      phone: company.phone,
      logo: company.logo,
      shortDescription: company.shortDescription,
      fullDescription: company.fullDescription,
      employeeCount: company.size,
      languages: company.languages || [],
      offices: [],
      services: [],
      history: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }));

    // 过滤和搜索
    let filteredCompanies = companiesBasic;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredCompanies = filteredCompanies.filter(company =>
        company.name?.toLowerCase().includes(searchLower) ||
        company.trading_name?.toLowerCase().includes(searchLower) ||
        company.abn?.includes(search) ||
        company.email?.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== 'all') {
      filteredCompanies = filteredCompanies.filter(company =>
        company.status === status
      );
    }

    if (industry && industry !== 'all') {
      filteredCompanies = filteredCompanies.filter(company =>
        company.industry === industry
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

    // 只对当前页的公司查询关联数据
    const companiesWithDetails = await Promise.all(
      paginatedCompanies.map(async (company) => {
        try {
          const [offices, services, history] = await Promise.all([
            getOfficesByCompanyId(company.id!),
            getServicesByCompanyId(company.id!),
            getHistoryByCompanyId(company.id!)
          ]);

          return {
            ...company,
            offices: offices.map(office => ({
              id: office.officeId,
              address: office.address,
              city: office.city,
              state: office.state,
              postalCode: office.postalCode,
              phone: office.phone,
              email: office.email,
              contactPerson: office.contactPerson,
              isHeadquarter: office.isHeadquarter
            })),
            services: services.map(service => ({
              id: service.serviceId,
              title: service.title,
              description: service.description
            })),
            history: history
              .filter(h => h.date && h.description) // 只返回有完整数据的历史记录
              .map(h => ({
                id: h.historyId,
                year: h.date,
                event: h.description
              }))
          };
        } catch (error) {
          console.error(`Error fetching details for company ${company.id}:`, error);
          // 如果查询失败，返回基本信息
          return company;
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: companiesWithDetails,
      pagination: {
        page,
        limit,
        total: filteredCompanies.length,
        totalPages: Math.ceil(filteredCompanies.length / limit)
      }
    });

  } catch (error) {
    console.error('Get companies error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - 创建新公司
export async function POST(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // 创建公司基本信息
    const companyData = {
      name: data.name,
      name_en: data.name,
      trading_name: data.trading_name || '', // 添加trading_name字段
      abn: data.abn,
      industry: data.industry,
      industry_1: data.industry_1 || '', // 一级行业
      industry_2: data.industry_2 || '', // 二级行业
      industry_3: data.industry_3 || '', // 三级行业
      foundedYear: data.foundedYear?.toString() || '',
      website: data.website || '',
      email: data.email || '',
      phone: data.phone || '',
      logo: data.logo || '',
      shortDescription: data.shortDescription || '',
      fullDescription: data.fullDescription || '',
      size: data.employeeCount || '',
      state: data.offices?.[0]?.state || '',
      languages: data.languages || []
    };

    const companyId = await createCompany(companyData);

    // 创建办公室、服务和历史记录的逻辑可以在这里添加
    // 为了简化，这里先返回创建的公司信息

    return NextResponse.json({
      success: true,
      data: {
        id: companyId,
        ...companyData
      }
    });

  } catch (error) {
    console.error('Create company error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
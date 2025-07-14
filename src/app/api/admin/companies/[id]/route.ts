import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { 
  getCompanyById,
  updateCompany,
  deleteCompany,
  getOfficesByCompanyId,
  getServicesByCompanyId,
  getHistoryByCompanyId,
  createOffice,
  createService,
  createHistory,
  updateOffice,
  updateService,
  updateHistory,
  deleteOffice,
  deleteService,
  deleteHistory
} from '@/lib/firebase/services/company';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  setDoc, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

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

// GET - 获取单个公司详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // 获取公司基本信息
    const company = await getCompanyById(id);
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // 获取相关数据
    const [offices, services, history] = await Promise.all([
      getOfficesByCompanyId(id),
      getServicesByCompanyId(id),
      getHistoryByCompanyId(id)
    ]);

    const companyWithDetails = {
      id: company.companyId,
      name: company.name || company.name_en,
      trading_name: company.trading_name, // 添加trading_name字段
      slug: company.slug, // 添加slug字段
      abn: company.abn,
      industry: company.industry,
      industry_1: company.industry_1 || '', // 一级行业
      industry_2: company.industry_2 || '', // 二级行业 
      industry_3: company.industry_3 || '', // 三级行业
      status: 'active',
      foundedYear: company.foundedYear,
      website: company.website,
      email: company.email,
      phone: company.phone,
      logo: company.logo,
      shortDescription: company.shortDescription,
      fullDescription: company.fullDescription,
      employeeCount: company.size,
      languages: company.languages || [],
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
      history: history.map(h => ({
        id: h.historyId,
        year: h.date,
        event: h.description
      }))
    };

    return NextResponse.json({
      success: true,
      data: companyWithDetails
    });

  } catch (error) {
    console.error('Get company error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - 更新公司信息
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const data = await request.json();
    
    console.log('PUT request received for company:', id);
    console.log('Request data:', JSON.stringify(data, null, 2));

    // 更新公司基本信息
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

    const updatedCompanyId = await updateCompany(id, companyData);

    // 更新办公室信息
    if (data.offices) {
      // 删除现有办公室（使用原始ID和新ID搜索）
      const officesRef = collection(db, 'offices');
      const q1 = query(officesRef, where('companyId', '==', id));
      const q2 = query(officesRef, where('companyId', '==', updatedCompanyId));
      
      const [querySnapshot1, querySnapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2)
      ]);
      
      const allDocs = [...querySnapshot1.docs, ...querySnapshot2.docs];
      for (const docSnapshot of allDocs) {
        await deleteDoc(docSnapshot.ref);
      }

      // 创建新的办公室
      const stateCounters: { [state: string]: number } = {};
      
      for (const office of data.offices) {
        const state = office.state || 'UNK';
        
        if (!stateCounters[state]) {
          stateCounters[state] = 1;
        } else {
          stateCounters[state]++;
        }
        
        const docId = `${updatedCompanyId}_${state}_${String(stateCounters[state]).padStart(2, '0')}`;
        
        await setDoc(doc(db, 'offices', docId), {
          companyId: updatedCompanyId,
          address: office.address || '',
          city: office.city || '',
          state: office.state || '',
          postalCode: office.postalCode || '',
          phone: office.phone || '',
          email: office.email || '',
          contactPerson: office.contactPerson || '',
          isHeadquarter: office.isHeadquarter || false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
    }

    // 更新服务信息
    if (data.services) {
      // 删除现有服务（使用原始ID和新ID搜索）
      const servicesRef = collection(db, 'services');
      const q1 = query(servicesRef, where('companyId', '==', id));
      const q2 = query(servicesRef, where('companyId', '==', updatedCompanyId));
      
      const [querySnapshot1, querySnapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2)
      ]);
      
      const allDocs = [...querySnapshot1.docs, ...querySnapshot2.docs];
      for (const docSnapshot of allDocs) {
        await deleteDoc(docSnapshot.ref);
      }

      // 创建新的服务
      for (let i = 0; i < data.services.length; i++) {
        const service = data.services[i];
        const docId = `${updatedCompanyId}_SERVICES_${String(i + 1).padStart(2, '0')}`;
        
        await setDoc(doc(db, 'services', docId), {
          companyId: updatedCompanyId,
          title: service.title || '',
          description: service.description || '',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
    }

    // 更新历史信息
    if (data.history) {
      // 删除现有历史（使用原始ID和新ID搜索）
      const historyRef = collection(db, 'history');
      const q1 = query(historyRef, where('companyId', '==', id));
      const q2 = query(historyRef, where('companyId', '==', updatedCompanyId));
      
      const [querySnapshot1, querySnapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2)
      ]);
      
      const allDocs = [...querySnapshot1.docs, ...querySnapshot2.docs];
      for (const docSnapshot of allDocs) {
        await deleteDoc(docSnapshot.ref);
      }

      // 创建新的历史记录
      const yearCounters: { [year: string]: number } = {};
      
      for (const historyItem of data.history) {
        const year = historyItem.year || 'UNK';
        
        if (!yearCounters[year]) {
          yearCounters[year] = 1;
        } else {
          yearCounters[year]++;
        }
        
        const docId = `${updatedCompanyId}_HISTORY_${year}_${String(yearCounters[year]).padStart(2, '0')}`;
        
        await setDoc(doc(db, 'history', docId), {
          companyId: updatedCompanyId,
          date: historyItem.year || '',
          description: historyItem.event || '',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
    }

    console.log('Company update completed successfully for:', updatedCompanyId);
    
    return NextResponse.json({
      success: true,
      message: 'Company updated successfully',
      data: {
        originalId: id,
        updatedId: updatedCompanyId,
        idChanged: id !== updatedCompanyId
      }
    });

  } catch (error) {
    console.error('Update company error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - 删除公司
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // 删除相关的办公室、服务和历史记录
    const collections = ['offices', 'services', 'history'];
    
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, where('companyId', '==', id));
      const querySnapshot = await getDocs(q);
      
      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(docSnapshot.ref);
      }
    }

    // 删除公司主记录
    await deleteCompany(id);

    return NextResponse.json({
      success: true,
      message: 'Company deleted successfully'
    });

  } catch (error) {
    console.error('Delete company error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
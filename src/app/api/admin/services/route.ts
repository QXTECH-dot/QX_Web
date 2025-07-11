import { NextRequest, NextResponse } from 'next/server';
import { 
  getServicesByCompanyId,
  createService,
  updateService,
  deleteService 
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

// 验证管理员权限的中间件函数 - 临时禁用
function verifyAdminToken(request: NextRequest) {
  // 临时返回admin用户，跳过验证
  return { role: 'admin', email: 'admin@qxnet.com' };
}

// GET - 获取公司的所有服务
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
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const services = await getServicesByCompanyId(companyId);

    const formattedServices = services.map(service => ({
      id: service.serviceId,
      companyId: service.companyId,
      title: service.title,
      description: service.description,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedServices
    });

  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - 创建新服务
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
    const { companyId, title, description } = data;

    if (!companyId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 获取该公司的现有服务数量以生成ID
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, where('companyId', '==', companyId));
    const querySnapshot = await getDocs(q);
    const serviceCount = querySnapshot.size + 1;

    const docId = `${companyId}_SERVICES_${String(serviceCount).padStart(2, '0')}`;

    await setDoc(doc(db, 'services', docId), {
      companyId,
      title: title || '',
      description: description || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return NextResponse.json({
      success: true,
      data: {
        id: docId,
        companyId,
        title,
        description
      }
    });

  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
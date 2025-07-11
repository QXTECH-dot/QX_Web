import { NextRequest, NextResponse } from 'next/server';
import { 
  getOfficesByCompanyId,
  createOffice,
  updateOffice,
  deleteOffice 
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

// GET - 获取公司的所有办公室
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

    const offices = await getOfficesByCompanyId(companyId);

    const formattedOffices = offices.map(office => ({
      id: office.officeId,
      companyId: office.companyId,
      address: office.address,
      city: office.city,
      state: office.state,
      postalCode: office.postalCode,
      phone: office.phone,
      email: office.email,
      contactPerson: office.contactPerson,
      isHeadquarter: office.isHeadquarter,
      createdAt: office.createdAt,
      updatedAt: office.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedOffices
    });

  } catch (error) {
    console.error('Get offices error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - 创建新办公室
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
    const { companyId, address, city, state, postalCode, phone, email, contactPerson, isHeadquarter } = data;

    if (!companyId || !address || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 获取该州的现有办公室数量以生成ID
    const officesRef = collection(db, 'offices');
    const q = query(officesRef, where('companyId', '==', companyId), where('state', '==', state));
    const querySnapshot = await getDocs(q);
    const stateOfficeCount = querySnapshot.size + 1;

    const docId = `${companyId}_${state}_${String(stateOfficeCount).padStart(2, '0')}`;

    await setDoc(doc(db, 'offices', docId), {
      companyId,
      address: address || '',
      city: city || '',
      state: state || '',
      postalCode: postalCode || '',
      phone: phone || '',
      email: email || '',
      contactPerson: contactPerson || '',
      isHeadquarter: isHeadquarter || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return NextResponse.json({
      success: true,
      data: {
        id: docId,
        companyId,
        address,
        city,
        state,
        postalCode,
        phone,
        email,
        contactPerson,
        isHeadquarter
      }
    });

  } catch (error) {
    console.error('Create office error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
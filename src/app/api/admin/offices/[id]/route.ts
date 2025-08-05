import { NextRequest, NextResponse } from 'next/server';
import { 
  updateOffice,
  deleteOffice 
} from '@/lib/firebase/services/company';
import { 
  deleteDoc, 
  doc, 
  setDoc, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// 验证管理员权限的中间件函数 - 临时禁用
function verifyAdminToken(request: NextRequest) {
  // 临时返回admin用户，跳过验证
  return { role: 'admin', email: 'admin@qxnet.com' };
}

// GET - 获取单个办公室详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    const docRef = doc(db, 'offices', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Office not found' },
        { status: 404 }
      );
    }

    const office = docSnap.data();

    return NextResponse.json({
      success: true,
      data: {
        id: docSnap.id,
        ...office
      }
    });

  } catch (error) {
    console.error('Get office error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - 更新办公室信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const data = await request.json();

    const docRef = doc(db, 'offices', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Office not found' },
        { status: 404 }
      );
    }

    const updateData = {
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      postalCode: data.postalCode || '',
      phone: data.phone || '',
      email: data.email || '',
      contactPerson: data.contactPerson || '',
      isHeadquarter: data.isHeadquarter || false,
      updatedAt: Timestamp.now()
    };

    await setDoc(docRef, updateData, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Office updated successfully'
    });

  } catch (error) {
    console.error('Update office error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - 删除办公室
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const docRef = doc(db, 'offices', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Office not found' },
        { status: 404 }
      );
    }

    await deleteDoc(docRef);

    return NextResponse.json({
      success: true,
      message: 'Office deleted successfully'
    });

  } catch (error) {
    console.error('Delete office error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
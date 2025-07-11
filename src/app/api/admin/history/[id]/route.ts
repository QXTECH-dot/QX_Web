import { NextRequest, NextResponse } from 'next/server';
import { 
  updateHistory,
  deleteHistory 
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

// GET - 获取单个历史记录详情
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
    
    const docRef = doc(db, 'history', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'History record not found' },
        { status: 404 }
      );
    }

    const history = docSnap.data();

    return NextResponse.json({
      success: true,
      data: {
        id: docSnap.id,
        ...history,
        year: history.date,
        event: history.description
      }
    });

  } catch (error) {
    console.error('Get history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - 更新历史记录信息
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

    const docRef = doc(db, 'history', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'History record not found' },
        { status: 404 }
      );
    }

    const updateData = {
      date: data.year || '',
      description: data.event || '',
      updatedAt: Timestamp.now()
    };

    await setDoc(docRef, updateData, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'History record updated successfully'
    });

  } catch (error) {
    console.error('Update history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - 删除历史记录
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

    const docRef = doc(db, 'history', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'History record not found' },
        { status: 404 }
      );
    }

    await deleteDoc(docRef);

    return NextResponse.json({
      success: true,
      message: 'History record deleted successfully'
    });

  } catch (error) {
    console.error('Delete history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
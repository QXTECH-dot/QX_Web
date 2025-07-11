import { NextRequest, NextResponse } from 'next/server';
import { 
  getHistoryByCompanyId,
  createHistory,
  updateHistory,
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

// 验证管理员权限的中间件函数 - 临时禁用
function verifyAdminToken(request: NextRequest) {
  // 临时返回admin用户，跳过验证
  return { role: 'admin', email: 'admin@qxnet.com' };
}

// GET - 获取公司的所有历史记录
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

    const history = await getHistoryByCompanyId(companyId);

    const formattedHistory = history.map(item => ({
      id: item.historyId,
      companyId: item.companyId,
      year: item.date || '',
      event: item.description || '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedHistory
    });

  } catch (error) {
    console.error('Get history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - 创建新历史记录
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
    const { companyId, year, event } = data;

    if (!companyId || !year || !event) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 获取该年份的现有历史记录数量以生成ID
    const historyRef = collection(db, 'history');
    const q = query(historyRef, where('companyId', '==', companyId), where('date', '==', year));
    const querySnapshot = await getDocs(q);
    const yearHistoryCount = querySnapshot.size + 1;

    const docId = `${companyId}_HISTORY_${year}_${String(yearHistoryCount).padStart(2, '0')}`;

    await setDoc(doc(db, 'history', docId), {
      companyId,
      date: year,
      description: event,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return NextResponse.json({
      success: true,
      data: {
        id: docId,
        companyId,
        year,
        event
      }
    });

  } catch (error) {
    console.error('Create history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
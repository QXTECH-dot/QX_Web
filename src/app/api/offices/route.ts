import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Office } from '@/types/company';

// 告诉 Next.js 这个路由需要动态处理
export const dynamic = 'force-dynamic';

/**
 * GET 处理器 - 获取所有办公室数据
 */
export async function GET() {
  try {
    // 查询 Firestore 中的 offices 集合
    const snapshot = await firestore.collection('offices').get();
    
    // 如果集合不存在或为空
    if (snapshot.empty) {
      return NextResponse.json({ offices: [] }, { status: 200 });
    }
    
    // 将文档数据转换为数组
    const offices: Office[] = [];
    snapshot.forEach(doc => {
      offices.push(doc.data() as Office);
    });
    
    // 返回办公室数据
    return NextResponse.json({ offices }, { status: 200 });
  } catch (error) {
    console.error('Error fetching offices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offices' },
      { status: 500 }
    );
  }
}

/**
 * POST 处理器 - 创建新办公室
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 验证必填字段
    if (!data.companyId || !data.officeId || !data.state || !data.city || !data.address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // 确保 isHeadquarter 是布尔值
    data.isHeadquarter = !!data.isHeadquarter;
    
    // 检查 officeId 是否已存在
    const docRef = firestore.collection('offices').doc(data.officeId);
    const doc = await docRef.get();
    
    if (doc.exists) {
      return NextResponse.json(
        { error: 'Office with this ID already exists' },
        { status: 409 }
      );
    }
    
    // 创建办公室文档
    await docRef.set(data);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Office created successfully',
        officeId: data.officeId
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating office:', error);
    return NextResponse.json(
      { error: 'Failed to create office' },
      { status: 500 }
    );
  }
} 
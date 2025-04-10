import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Company } from '@/types/company';

// 告诉 Next.js 这个路由需要动态处理
export const dynamic = 'force-dynamic';

/**
 * GET 处理器 - 获取单个公司数据
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // 查询指定 ID 的公司文档
    const docRef = firestore.collection('companies').doc(id);
    const doc = await docRef.get();

    // 如果文档不存在
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // 返回公司数据
    const company: Company = {
      id: doc.id,
      ...doc.data() as Omit<Company, 'id'>
    };

    return NextResponse.json({ company }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching company with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

/**
 * PUT 处理器 - 更新公司数据
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const data = await request.json();
    
    // 这里可以添加数据验证逻辑
    
    // 检查公司是否存在
    const docRef = firestore.collection('companies').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    // 更新公司文档
    await docRef.update(data);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Company updated successfully' 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error updating company with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

/**
 * DELETE 处理器 - 删除公司
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // 检查公司是否存在
    const docRef = firestore.collection('companies').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    // 删除公司文档
    await docRef.delete();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Company deleted successfully' 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting company with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
} 
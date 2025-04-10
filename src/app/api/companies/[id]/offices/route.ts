import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Office } from '@/types/company';

// 告诉 Next.js 这个路由需要动态处理
export const dynamic = 'force-dynamic';

/**
 * GET 处理器 - 获取特定公司的所有办公室
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log('GET /api/companies/[id]/offices - Company ID:', id);

  try {
    // 查询指定公司的所有办公室
    console.log('Querying Firestore for offices with companyId:', id);
    const snapshot = await firestore.collection('offices')
      .where('companyId', '==', id)
      .get();
    
    // 如果没有找到办公室
    if (snapshot.empty) {
      console.log('No offices found for company ID:', id);
      
      // 尝试获取所有办公室，检查是否有相关联的办公室但companyId不匹配
      const allOfficesSnapshot = await firestore.collection('offices').get();
      let allOffices: any[] = [];
      allOfficesSnapshot.forEach(doc => {
        allOffices.push(doc.data());
      });
      console.log('All available offices in Firestore:', allOffices);
      
      return NextResponse.json({ offices: [] }, { status: 200 });
    }
    
    // 将文档数据转换为数组
    const offices: Office[] = [];
    snapshot.forEach(doc => {
      const officeData = doc.data() as Office;
      console.log('Found office:', officeData);
      offices.push(officeData);
    });
    
    console.log('Returning offices:', offices);
    // 返回办公室数据
    return NextResponse.json({ offices }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching offices for company ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch offices' },
      { status: 500 }
    );
  }
}

/**
 * POST 处理器 - 为特定公司创建新办公室
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const data = await request.json();
    
    // 确保使用路径中的公司 ID
    data.companyId = id;
    
    // 验证必填字段
    if (!data.state || !data.city || !data.address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // 确保 isHeadquarter 是布尔值
    data.isHeadquarter = !!data.isHeadquarter;
    
    // 查询该公司在指定城市的办公室数量
    const cityOfficesSnapshot = await firestore.collection('offices')
      .where('companyId', '==', id)
      .where('city', '==', data.city)
      .get();
    
    // 计算新办公室的序号
    const sequence = cityOfficesSnapshot.size + 1;
    const formattedSequence = sequence.toString().padStart(2, '0');
    
    // 格式化城市名称（大写，移除空格）
    const formattedCity = data.city.toUpperCase().replace(/\s+/g, '');
    
    // 生成办公室 ID
    const officeId = `${id}_${formattedCity}_${formattedSequence}`;
    data.officeId = officeId;
    
    // 创建办公室文档
    await firestore.collection('offices').doc(officeId).set(data);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Office created successfully',
        officeId: officeId
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error(`Error creating office for company ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to create office' },
      { status: 500 }
    );
  }
} 
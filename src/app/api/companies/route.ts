import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Company } from '@/types/company';
import { Office } from '@/types/office';

// 告诉 Next.js 这个路由需要动态处理
export const dynamic = 'force-dynamic';

/**
 * GET 处理器 - 获取所有公司数据
 */
export async function GET() {
  try {
    // 查询 Firestore 中的 companies 集合
    const snapshot = await firestore.collection('companies').get();
    
    // 如果集合不存在或为空
    if (snapshot.empty) {
      return NextResponse.json({ companies: [] }, { status: 200 });
    }
    
    // 将文档数据转换为数组
    const companies: Company[] = [];
    
    // 获取所有公司数据
    for (const doc of snapshot.docs) {
      const data = doc.data();
      console.log('Company data:', data);
      
      // 获取该公司的办公室数据
      const officesSnapshot = await firestore.collection('offices')
        .where('companyId', '==', doc.id)
        .get();
      
      const offices: Office[] = officesSnapshot.docs.map(officeDoc => {
        const officeData = officeDoc.data() as Office;
        return {
          ...officeData,
          officeId: officeDoc.id,
          id: officeDoc.id,
          isHeadquarter: officeData.isHeadquarter || false
        };
      });

      // 获取该公司的服务数据
      const servicesSnapshot = await firestore.collection('services')
        .where('companyId', '==', doc.id)
        .get();
      
      const services: string[] = servicesSnapshot.docs.map(serviceDoc => {
        const serviceData = serviceDoc.data();
        return serviceData.title || '';
      });
      
      companies.push({
        id: doc.id,
        ...data as Omit<Company, 'id'>,
        offices: offices,
        services: services
      });
    }
    
    console.log('Processed companies with offices and services:', companies);
    
    // 返回公司数据
    return NextResponse.json({ companies }, { status: 200 });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

/**
 * POST 处理器 - 创建新公司
 * 可以在后续扩展
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 这里可以添加数据验证逻辑
    
    // 创建新的公司文档
    const docRef = await firestore.collection('companies').add(data);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Company created successfully',
        id: docRef.id 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
} 
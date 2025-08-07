import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companySlug = searchParams.get('slug') || 'geocon';
    
    console.log(`🔄 测试公司 ${companySlug} 的history数据...`);
    
    // 1. 查找公司数据
    const companiesRef = collection(db, 'companies');
    const companyQuery = query(companiesRef, where('slug', '==', companySlug));
    const companySnapshot = await getDocs(companyQuery);
    
    if (companySnapshot.empty) {
      // 尝试用slug作为ID查找
      const companyDoc = await getDoc(doc(db, 'companies', companySlug));
      if (!companyDoc.exists()) {
        return NextResponse.json({
          success: false,
          error: `Company with slug '${companySlug}' not found`,
          timestamp: new Date().toISOString()
        });
      }
      
      const companyData = companyDoc.data();
      const companyId = companyData.companyId || companyDoc.id;
      
      console.log(`📊 找到公司 ID: ${companyDoc.id}, companyId字段: ${companyData.companyId}`);
      
      // 2. 查找对应的history数据
      const historyRef = collection(db, 'history');
      const historyQuery = query(historyRef, where('companyId', '==', companyId));
      const historySnapshot = await getDocs(historyQuery);
      
      const historyData = historySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return NextResponse.json({
        success: true,
        company: {
          id: companyDoc.id,
          name: companyData.name,
          companyId: companyData.companyId,
          slug: companyData.slug
        },
        history: {
          count: historySnapshot.size,
          data: historyData
        },
        searchDetails: {
          searchedSlug: companySlug,
          usedCompanyId: companyId,
          foundBySlug: false
        },
        timestamp: new Date().toISOString()
      });
    } else {
      const companyDoc = companySnapshot.docs[0];
      const companyData = companyDoc.data();
      const companyId = companyData.companyId || companyDoc.id;
      
      console.log(`📊 找到公司 ID: ${companyDoc.id}, companyId字段: ${companyData.companyId}`);
      
      // 2. 查找对应的history数据
      const historyRef = collection(db, 'history');
      const historyQuery = query(historyRef, where('companyId', '==', companyId));
      const historySnapshot = await getDocs(historyQuery);
      
      const historyData = historySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return NextResponse.json({
        success: true,
        company: {
          id: companyDoc.id,
          name: companyData.name,
          companyId: companyData.companyId,
          slug: companyData.slug
        },
        history: {
          count: historySnapshot.size,
          data: historyData
        },
        searchDetails: {
          searchedSlug: companySlug,
          usedCompanyId: companyId,
          foundBySlug: true
        },
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('❌ 测试公司history失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
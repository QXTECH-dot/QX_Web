import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const companySlug = 'geocon-constructors-act-pty-ltd';
    
    console.log(`🔄 模拟CompanyProfile获取history的过程...`);
    
    // 模拟CompanyProfile中的fetchHistory逻辑
    let companyId: string;
    
    // 1. 按slug查找公司
    const companiesRef = collection(db, 'companies');
    const slugQuery = query(companiesRef, where('slug', '==', companySlug));
    const slugSnapshot = await getDocs(slugQuery);
    
    if (!slugSnapshot.empty) {
      const companyData = slugSnapshot.docs[0].data();
      companyId = companyData.companyId || slugSnapshot.docs[0].id;
      console.log(`✅ 通过slug找到公司: ${slugSnapshot.docs[0].id}, companyId: ${companyId}`);
    } else {
      // 如果按slug找不到，尝试按ID查找
      const companyRef = doc(db, 'companies', companySlug);
      const companySnap = await getDoc(companyRef);
      if (companySnap.exists()) {
        const companyData = companySnap.data();
        companyId = companyData.companyId || companySnap.id;
        console.log(`✅ 通过ID找到公司: ${companySnap.id}, companyId: ${companyId}`);
      } else {
        return NextResponse.json({
          success: false,
          error: 'Company not found',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // 2. 获取history数据
    const historyRef = collection(db, 'history');
    const q = query(historyRef, where('companyId', '==', companyId));
    const querySnapshot = await getDocs(q);
    
    console.log(`📊 找到 ${querySnapshot.docs.length} 条history记录`);
    
    // 3. 按修复后的逻辑处理数据
    const historyData = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        year: data.date || data.year, // 使用date字段，回退到year
        event: data.description || data.event // 使用description字段，回退到event
      };
    });
    
    // 4. 排序
    historyData.sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      return yearB - yearA;
    });
    
    return NextResponse.json({
      success: true,
      companySlug,
      companyId,
      historyCount: historyData.length,
      historyData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 测试history修复失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
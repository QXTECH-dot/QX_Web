import { NextRequest, NextResponse } from 'next/server';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { isValidCompanyId, fixCompanyId } from '@/lib/firebase/services/company';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-admin';

// 验证管理员权限的中间件函数 - 临时禁用
function verifyAdminToken(request: NextRequest) {
  // 临时返回admin用户，跳过验证
  return { role: 'admin', email: 'admin@qxnet.com' };
}

// POST - 批量修复不符合规则的Company ID
export async function POST(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Batch ID Fix] Starting company ID validation and fixing...');
    
    // 获取所有公司
    const companiesSnapshot = await getDocs(collection(db, 'companies'));
    const companies = companiesSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    const invalidCompanies = companies.filter(company => !isValidCompanyId(company.id));
    
    console.log(`[Batch ID Fix] Found ${invalidCompanies.length} companies with invalid IDs`);
    
    if (invalidCompanies.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All company IDs are already in correct format',
        totalCompanies: companies.length,
        invalidCount: 0,
        fixedCount: 0,
        results: []
      });
    }

    const fixResults = [];

    // 逐个修复无效的ID
    for (const company of invalidCompanies) {
      try {
        console.log(`[Batch ID Fix] Fixing company ID: ${company.id}`);
        const newId = await fixCompanyId(company.id);
        
        fixResults.push({
          originalId: company.id,
          newId: newId,
          status: 'success',
          companyName: company.data.name || 'Unknown'
        });
        
        console.log(`[Batch ID Fix] Successfully fixed ${company.id} → ${newId}`);
      } catch (error) {
        console.error(`[Batch ID Fix] Failed to fix ${company.id}:`, error);
        fixResults.push({
          originalId: company.id,
          newId: null,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          companyName: company.data.name || 'Unknown'
        });
      }
    }

    const successCount = fixResults.filter(result => result.status === 'success').length;
    const errorCount = fixResults.filter(result => result.status === 'error').length;

    console.log(`[Batch ID Fix] Completed: ${successCount} fixed, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      message: `ID fixing completed: ${successCount} fixed, ${errorCount} errors`,
      totalCompanies: companies.length,
      invalidCount: invalidCompanies.length,
      fixedCount: successCount,
      errorCount: errorCount,
      results: fixResults
    });

  } catch (error) {
    console.error('[Batch ID Fix] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - 检查有多少公司需要修复ID
export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 获取所有公司
    const companiesSnapshot = await getDocs(collection(db, 'companies'));
    const companies = companiesSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || 'Unknown'
    }));

    const validCompanies = companies.filter(company => isValidCompanyId(company.id));
    const invalidCompanies = companies.filter(company => !isValidCompanyId(company.id));

    return NextResponse.json({
      success: true,
      data: {
        totalCompanies: companies.length,
        validCount: validCompanies.length,
        invalidCount: invalidCompanies.length,
        invalidCompanies: invalidCompanies.map(company => ({
          id: company.id,
          name: company.name
        }))
      }
    });

  } catch (error) {
    console.error('[ID Check] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
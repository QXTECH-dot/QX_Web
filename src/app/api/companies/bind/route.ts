import { NextRequest, NextResponse } from 'next/server';
import { bindUserToCompany } from '@/lib/firebase/services/userCompany';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function POST(request: NextRequest) {
  try {
    const { userId, companyData, email, role = 'owner' } = await request.json();

    console.log('[Company Bind] Received data:', { userId, companyData, email, role });

    if (!email || !companyData) {
      console.error('[Company Bind] Missing required data:', { email: !!email, companyData: !!companyData });
      return NextResponse.json(
        { success: false, error: 'Missing required data' },
        { status: 400 }
      );
    }

    // 验证数据格式
    if (typeof email !== 'string' || !email.includes('@')) {
      console.error('[Company Bind] Invalid email:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!companyData.name && !companyData.abn) {
      console.error('[Company Bind] Company data missing name and ABN:', companyData);
      return NextResponse.json(
        { success: false, error: 'Company must have either name or ABN' },
        { status: 400 }
      );
    }

    console.log('[Company Bind] Starting bind process...', { email, companyData });

    // 1. 首先查找或创建公司记录
    let companyId = null;
    
    if (companyData.abn) {
      // 如果有ABN，查找现有公司
      const companiesQuery = query(
        collection(db, 'companies'), 
        where('abn', '==', companyData.abn)
      );
      const existingCompanies = await getDocs(companiesQuery);
      
      if (!existingCompanies.empty) {
        // 使用现有公司
        companyId = existingCompanies.docs[0].id;
        console.log('[Company Bind] Found existing company:', companyId);
      }
    }
    
    if (!companyId) {
      // 创建新的公司记录
      const newCompanyData = {
        name: companyData.name,
        abn: companyData.abn || '',
        industry: companyData.industry || '',
        website: '',
        logo: '',
        verifiedEmail: email,
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'verified'
      };
      
      const companyDoc = await addDoc(collection(db, 'companies'), newCompanyData);
      companyId = companyDoc.id;
      console.log('[Company Bind] Created new company:', companyId);
    }

    // 2. 创建用户公司绑定关系 - 使用新格式
    console.log('[Company Bind] Creating user-company binding...');
    const bindingId = await bindUserToCompany(email, companyId, role);
    console.log('[Company Bind] Created binding:', bindingId);

    // 3. 保存邮箱验证记录
    console.log('[Company Bind] Saving email verification record...');
    const emailVerificationRef = await addDoc(collection(db, 'email_verifications'), {
      email,
      companyId,
      verifiedAt: new Date(),
      createdAt: new Date()
    });
    console.log('[Company Bind] Saved email verification:', emailVerificationRef.id);

    return NextResponse.json({
      success: true,
      data: {
        companyId,
        bindingId,
        message: 'Company binding successful'
      }
    });

  } catch (error: any) {
    console.error('[Company Bind] Error:', error);
    console.error('[Company Bind] Error message:', error.message);
    console.error('[Company Bind] Error code:', error.code);
    console.error('[Company Bind] Error stack:', error.stack);
    
    if (error.message && error.message.includes('已被绑定')) {
      return NextResponse.json(
        { success: false, error: 'This company is already bound to another account' },
        { status: 409 }
      );
    }
    
    // 返回更详细的错误信息以便调试
    return NextResponse.json(
      { 
        success: false, 
        error: `Internal server error: ${error.message}`,
        details: error.code || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
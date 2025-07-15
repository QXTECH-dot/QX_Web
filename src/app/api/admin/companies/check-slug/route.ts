import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';

// GET - Check slug uniqueness
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const excludeId = searchParams.get('excludeId') || '';

    if (!slug) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Slug parameter is required' 
        },
        { status: 400 }
      );
    }

    // 查询是否存在相同的slug
    const companiesSnapshot = await firestore.collection('companies')
      .where('slug', '==', slug)
      .get();
    
    // 检查是否唯一（排除当前编辑的公司）
    const existingCompanies = companiesSnapshot.docs.filter(doc => doc.id !== excludeId);
    const isUnique = existingCompanies.length === 0;

    return NextResponse.json({
      success: true,
      isUnique,
      existingCount: existingCompanies.length
    });

  } catch (error) {
    console.error('Check slug API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    console.log(`Getting offices for company: ${companyId}`);

    // 从offices表获取该公司的办公室信息
    const officesSnapshot = await firestore
      .collection('offices')
      .where('companyId', '==', companyId)
      .get();

    const offices = officesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`Found ${offices.length} offices for company ${companyId}`);

    return NextResponse.json({
      success: true,
      offices: offices,
      total: offices.length
    });

  } catch (error) {
    console.error(`Error getting offices for company ${params.id}:`, error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      offices: []
    }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const companyId = resolvedParams.id;

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Get company by ID or slug
    const companiesRef = firestore.collection('companies');
    
    // First try to get by document ID
    let companyDoc = await companiesRef.doc(companyId).get();
    
    // If not found by ID, try to find by slug
    if (!companyDoc.exists) {
      const slugQuery = await companiesRef.where('slug', '==', companyId).limit(1).get();
      if (!slugQuery.empty) {
        companyDoc = slugQuery.docs[0];
      }
    }

    if (!companyDoc.exists) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const companyData = {
      id: companyDoc.id,
      ...companyDoc.data(),
    };

    // Serialize the data to remove Firestore Timestamp objects
    const serializedData = JSON.parse(JSON.stringify(companyData));

    return NextResponse.json({ 
      success: true, 
      data: serializedData 
    });

  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company data' },
      { status: 500 }
    );
  }
}
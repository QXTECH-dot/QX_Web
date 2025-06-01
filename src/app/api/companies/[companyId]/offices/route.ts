import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const { companyId } = params;
  if (!companyId) {
    return NextResponse.json({ error: 'Missing companyId' }, { status: 400 });
  }

  try {
    const officesRef = collection(db, 'offices');
    const q = query(officesRef, where('companyId', '==', companyId));
    const snapshot = await getDocs(q);
    const offices = snapshot.docs.map(doc => ({ officeId: doc.id, ...doc.data() }));
    return NextResponse.json({ offices });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch offices', details: String(error) }, { status: 500 });
  }
} 
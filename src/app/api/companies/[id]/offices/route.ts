import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ offices: [] }, { status: 400 });
  }
  try {
    const officesCol = collection(db, 'offices');
    const q = query(officesCol, where('companyId', '==', id));
    const snapshot = await getDocs(q);
    const offices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ offices });
  } catch (error) {
    return NextResponse.json({ offices: [], error: String(error) }, { status: 500 });
  }
} 
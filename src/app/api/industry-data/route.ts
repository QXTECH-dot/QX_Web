import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const collection = db.collection('industry_visualization_data');
    const snapshot = await collection.get();
    
    if (snapshot.empty) {
      return NextResponse.json({ data: [] });
    }
    
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching industry data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch industry data' },
      { status: 500 }
    );
  }
}
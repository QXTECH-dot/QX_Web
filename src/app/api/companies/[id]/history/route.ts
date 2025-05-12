import { NextResponse } from 'next/server';
import { getHistoryByCompanyId, createHistory, updateHistory, deleteHistory } from '@/lib/firebase/services/company';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const histories = await getHistoryByCompanyId(params.id);
    return NextResponse.json(histories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch company history' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const history = await createHistory(params.id, data);
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create company history' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    await updateHistory(data.historyId, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update company history' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { historyId } = await request.json();
    await deleteHistory(historyId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete company history' }, { status: 500 });
  }
} 
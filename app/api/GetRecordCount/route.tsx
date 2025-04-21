import { NextResponse } from 'next/server';
import { GetRecordCount } from '../../lib/dbcmd';

export async function GET() {
  try {
    const count = await GetRecordCount();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch record count' }, { status: 500 });
  }
}
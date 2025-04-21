import { NextRequest, NextResponse } from "next/server";
import { GetRecordCount } from '../../lib/dbcmd';

export async function POST(request: NextRequest) {
    if (request.method === 'POST') {
        try {
            const currentCount = Number(await GetRecordCount());
            const body = await request.json();
            
            return NextResponse.json(body);
        } catch {
            return NextResponse.json(
                { error: "Failed to fetch HTML record" },
                { status: 500 }
            );
        }
    }
}
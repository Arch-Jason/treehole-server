import { NextRequest, NextResponse } from "next/server";
import { AddRecord } from '../../lib/dbcmd';

export async function POST(request: NextRequest) {
    if (request.method === 'POST') {
        try {
            const body = await request.json();
            const res = await AddRecord(body["htmlList"]);
            let ret = {code: 200};
            return NextResponse.json(ret);
        } catch {
            return NextResponse.json(
                { error: "Failed to fetch HTML record" },
                { status: 500 }
            );
        }
    }
}
import { NextRequest, NextResponse } from "next/server";
import { GetLatestRecord, GetOneRecord } from "../../lib/dbcmd";

export async function GET(request: NextRequest) {
    try {
        const html = await GetLatestRecord();
        const html_list = html.html_list;
        return NextResponse.json(html_list);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch HTML record" },
            { status: 500 }
        );
    }
}

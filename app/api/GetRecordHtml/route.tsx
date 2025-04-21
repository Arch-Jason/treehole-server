import { NextRequest, NextResponse } from "next/server";
import { GetOneRecord } from "../../lib/dbcmd";

export async function GET(request: NextRequest) {
    try {
        const recordNumber = request.nextUrl.searchParams.get("recordNumber");

        if (!recordNumber || isNaN(Number(recordNumber))) {
            return NextResponse.json(
                { error: "Invalid or missing recordNumber parameter" },
                { status: 400 }
            );
        }

        const html = await GetOneRecord(Number(recordNumber));
        return NextResponse.json({ html });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch HTML record" },
            { status: 500 }
        );
    }
}

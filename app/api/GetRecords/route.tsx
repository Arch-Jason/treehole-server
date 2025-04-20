import { NextRequest, NextResponse } from "next/server";
import { GetRecordsList } from "../../lib/dbcmd";

export async function GET(request: NextRequest) {
    try {
        const data = await GetRecordsList();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch HTML record" },
            { status: 500 }
        );
    }
}
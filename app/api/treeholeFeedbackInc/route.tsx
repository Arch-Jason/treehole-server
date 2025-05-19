import { NextRequest, NextResponse } from "next/server";
import { treeholeFeedbackPositiveInc, treeholeFeedbackNegativeInc } from '../../lib/dbcmd';

export async function POST(request: NextRequest) {
    if (request.method === 'POST') {
        const body = await request.json();
        const { id, isPositive } = body;
        console.log(id, isPositive);

        try {
            if (isPositive) {
                treeholeFeedbackPositiveInc(id);
            } else {
                treeholeFeedbackNegativeInc(id);
            }
            let ret = { code: 200 };
            return NextResponse.json(ret);
        } catch(error) {
            console.log(error)
            return NextResponse.json(
                { error: "Failed to fetch treehole record" },
                { status: 500 }
            );
        }
    }
}
import { NextRequest, NextResponse } from "next/server";
import { GetTreeholeRecordsList } from "../../lib/dbcmd";

export async function GET(request: NextRequest) {
    try {
        const records = await GetTreeholeRecordsList(); // 获取所有记录
        const response = records.map(record => ({
            id: record.id,
            html: record.html,
            feedback: record.feedback,
            timestamp: record.timestamp
        })); // 格式化返回的记录
        return NextResponse.json(response); // 返回记录数组作为 JSON 响应
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch treehole record" },
            { status: 500 }
        );
    }
}

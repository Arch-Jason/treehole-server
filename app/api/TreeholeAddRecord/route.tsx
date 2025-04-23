import { NextRequest, NextResponse } from "next/server";
import { AddTreeHoleRecord } from '../../lib/dbcmd';

export async function POST(request: NextRequest) {
    if (request.method === 'POST') {
        try {
            const body = await request.json();
            const { isAnonymous, name, htmlList } = body;

            // 构建 HTML 内容
            const htmlContent = htmlList.map((html: string) => {
                return `<div class="treehole-entry">
                            <p><strong>发布者:</strong> ${isAnonymous ? '匿名' : name}</p>
                            <p>${html}</p>
                        </div>`;
            }).join('<hr/>'); // 使用 <hr/> 分隔每一条记录

            const res = await AddTreeHoleRecord(htmlContent);

            let ret = { code: 200 };
            return NextResponse.json(ret);
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: "Failed to fetch treehole record" },
                { status: 500 }
            );
        }
    }
}
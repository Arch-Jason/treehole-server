import { RowDataPacket } from 'mysql2/promise';
import db from './db'

export async function GetRecordCount() {
    const [res, _] = await db.query<RowDataPacket[]>("SELECT COUNT(*) FROM html_list");
    const count = res[0]['COUNT(*)'];
    return Number(count);
}

export async function GetOneRecord(id:Number) {
    const [res, _] = await db.query<RowDataPacket[]>("SELECT * FROM html_list LIMIT ?, 1", [Number(id) - 1]);
    return res[0];
}

export async function GetRecordsList() {
    const [res, _] = await db.query<RowDataPacket[]>("SELECT * FROM html_list");
    return res;
}

export async function AddRecord(payload: Array<String>) {
    const [res, _] = await db.query<RowDataPacket[]>(
        "INSERT INTO html_list (html_list) VALUES (?)",
        JSON.stringify(payload)
    );
    return res;
}
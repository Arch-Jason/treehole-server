import { RowDataPacket } from "mysql2/promise";
import db from "./db";

export async function GetRecordCount() {
  const [res, _] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) FROM html_list"
  );
  const count = res[0]["COUNT(*)"];
  return Number(count);
}

export async function GetOneRecord(id: Number) {
  const [res, _] = await db.query<RowDataPacket[]>(
    "SELECT * FROM html_list WHERE id = ?",
    [Number(id)]
  );
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

export async function GetLatestRecord() {
  const [res, _] = await db.query<RowDataPacket[]>(
    "SELECT html_list FROM html_list ORDER BY id DESC LIMIT 1"
  );
  return res[0];
}

export async function AddTreeHoleRecord(htmlContent: string) {
  const [res, _] = await db.query<RowDataPacket[]>(
    'INSERT INTO treehole (html, feedback) VALUES (?, \'{"positive": 0, "negative": 0}\')',
    [htmlContent]
  );
  return res;
}

export async function GetTreeholeRecordsList() {
  const [res, _] = await db.query<RowDataPacket[]>("SELECT * FROM treehole");
  return res;
}

export async function treeholeFeedbackPositiveInc(id: number) {
  const [res, _] = await db.query<RowDataPacket[]>(
    "SELECT feedback FROM treehole WHERE id = ?",
    [id]
  );

  if (res.length > 0) {
    let feedback = res[0].feedback;
    feedback.positive += 1;

    await db.query<RowDataPacket[]>(
      "UPDATE treehole SET feedback = ? WHERE id = ?",
      [JSON.stringify(feedback), id]
    );
    return true;
  } else {
    return false;
  }
}

export async function treeholeFeedbackNegativeInc(id: number) {
  const [res, _] = await db.query<RowDataPacket[]>(
    "SELECT feedback FROM treehole WHERE id = ?",
    [id]
  );

  if (res.length > 0) {
    let feedback = res[0].feedback;
    feedback.negative += 1;

    await db.query<RowDataPacket[]>(
      "UPDATE treehole SET feedback = ? WHERE id = ?",
      [JSON.stringify(feedback), id]
    );
    return true;
  } else {
    return false;
  }
}

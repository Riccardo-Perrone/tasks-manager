import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";

export async function GET(req: NextRequest) {
  try {
    const result = await db.query(`
      SELECT id, name, created_at FROM projects
      ORDER BY created_at ASC;
    `);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "name are required" }, { status: 400 });
    }

    const result = await db.query(
      `INSERT INTO projects (name)
       VALUES ($1)
       RETURNING *`,
      [name]
    );

    const resultTaskList = await db.query(
      `INSERT INTO tasks_list (projects_id, status, order_list) VALUES
      ($1, 'to-do', 0),
      ($1, 'in-progress', 1),
      ($1, 'done', 2);`,
      [result.rows[0].id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: `Server error: ${err}` },
      { status: 500 }
    );
  }
}

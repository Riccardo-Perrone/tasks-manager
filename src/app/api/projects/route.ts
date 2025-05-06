import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Utente non autenticato" },
        { status: 401 }
      );
    }

    const result = await db.query(
      `SELECT id, name, created_at
       FROM projects
       WHERE creator_id = $1
       ORDER BY created_at ASC;`,
      [userId]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Utente non autenticato" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const result = await db.query(
      `INSERT INTO projects (name, creator_id)
       VALUES ($1, $2)
       RETURNING *`,
      [name, userId]
    );

    await db.query(
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

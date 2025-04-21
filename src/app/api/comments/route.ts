import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author_id, task_id, message } = body;

    if (!author_id || !task_id || !message) {
      return NextResponse.json(
        { error: "author_id, task_id and message are required" },
        { status: 400 }
      );
    }

    const result = await db.query(
      `INSERT INTO comments (author_id, task_id, message)
         VALUES ($1, $2, $3)
         RETURNING *`,
      [author_id, task_id, message]
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

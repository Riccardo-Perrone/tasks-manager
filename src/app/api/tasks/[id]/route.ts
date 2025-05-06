import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";

type Params = {
  params: Promise<any>;
};

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const responseTask = await db.query("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);

    if (responseTask.rows.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const responseComments = await db.query(
      `SELECT c.message, u.username, c.created_at
        FROM comments c
        JOIN users u ON c.author_id = u.id
        WHERE c.task_id = $1
        ORDER BY c.created_at DESC;
        `,
      [id]
    );

    return NextResponse.json({
      ...responseTask.rows[0],
      comments: responseComments.rows,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const { title, description, time_estimated, task_list_id } =
      await req.json();

    if (!title || !task_list_id) {
      return NextResponse.json(
        { error: "title and task_list_id are required" },
        { status: 400 }
      );
    }

    const result = await db.query(
      `UPDATE tasks 
       SET title = $1, description = $2, time_estimated = $3, task_list_id = $4 
       WHERE id = $5 
       RETURNING *`,
      [title, description, time_estimated, task_list_id, id]
    );

    if (result.rows.length === 0)
      return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    return NextResponse.json(
      { error: `Server error: ${err}` },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const result = await db.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json({ message: "Task deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

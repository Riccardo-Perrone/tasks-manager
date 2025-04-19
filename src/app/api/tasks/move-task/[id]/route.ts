// src/app/api/tasks/move-task/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";

// PUT /api/tasks/move-task/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { task_list_id, order_task } = await req.json();

    if (!task_list_id || typeof order_task !== "number") {
      return NextResponse.json(
        { error: "task_list_id and numeric order_task are required" },
        { status: 400 }
      );
    }

    const result = await db.query(
      `UPDATE tasks 
       SET task_list_id = $1, order_task = $2 
       WHERE id = $3 
       RETURNING *`,
      [task_list_id, order_task, params.id]
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

import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, time_estimated, task_list_id } = body;

    if (!title || !task_list_id) {
      return NextResponse.json(
        { error: "title and task_list_id are required" },
        { status: 400 }
      );
    }

    const orderQuery = await db.query(
      "SELECT MAX(order_task) AS max_order FROM tasks WHERE task_list_id = $1",
      [task_list_id]
    );
    const maxOrder = orderQuery.rows[0].max_order;
    const newOrder = maxOrder !== null ? maxOrder + 1 : 0;

    const result = await db.query(
      `INSERT INTO tasks (title, description, time_estimated, order_task, task_list_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
      [title, description, time_estimated, newOrder, task_list_id]
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

import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const result = await db.query(
      `
      SELECT 
        tl.id AS task_list_id,
        tl.status,
        tl.order_list,
        tl.projects_id AS project_id,
        t.id AS task_id,
        t.title,
        t.time_estimated,
        t.order_task
      FROM tasks_list tl
      LEFT JOIN tasks t ON t.task_list_id = tl.id
      WHERE tl.projects_id = $1
      ORDER BY tl.order_list, t.order_task;
      `,
      [id]
    );

    const grouped: Record<string, any> = {};
    for (const row of result.rows) {
      const listKey = row.status;
      if (!grouped[listKey]) {
        grouped[listKey] = {
          project_id: row.project_id,
          status: row.status,
          order_list: row.order_list,
          task_list_id: row.task_list_id,
          tasks: [],
        };
      }
      if (row.task_id) {
        grouped[listKey].tasks.push({
          id: row.task_id,
          title: row.title,
          time_estimated: row.time_estimated,
          order_task: row.order_task,
        });
      }
    }

    const response = Object.values(grouped).sort(
      (a: any, b: any) => a.order_list - b.order_list
    );

    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

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

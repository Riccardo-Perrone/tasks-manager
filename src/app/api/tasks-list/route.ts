import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { status, projects_id } = body;

    if (!status || !projects_id) {
      return NextResponse.json(
        { error: "status and projects_id are required" },
        { status: 400 }
      );
    }

    const orderQuery = await db.query(
      "SELECT MAX(order_list) AS max_order FROM tasks_list WHERE projects_id = $1",
      [projects_id]
    );
    const maxOrder = orderQuery.rows[0].max_order;
    const newOrder = maxOrder !== null ? maxOrder + 1 : 0;

    const result = await db.query(
      `INSERT INTO tasks_list (projects_id, status, order_list)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [projects_id, status, newOrder]
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

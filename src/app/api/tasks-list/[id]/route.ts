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
      SELECT id, status, order_list
      FROM tasks_list
      WHERE projects_id = $1 
    `,
      [id]
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json(
      { error: `Server error: ${err}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { order_list } = await req.json();

    // Validazione dei dati
    if (order_list === undefined || typeof order_list !== "number") {
      return NextResponse.json(
        { error: "order_list is required and must be a number" },
        { status: 400 }
      );
    }

    const result = await db.query(
      `UPDATE tasks_list 
       SET order_list = $1
       WHERE id = $2 
       RETURNING *`,
      [order_list, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "TasksList not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    return NextResponse.json(
      { error: `Server error: ${err}` },
      { status: 500 }
    );
  }
}

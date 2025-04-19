import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";

// GET /api/tasks-list
export async function GET() {
  try {
    const result = await db.query(`
      SELECT id, status, order_list
      FROM tasks_list
    `);
    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

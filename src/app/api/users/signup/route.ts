import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";
import { hashPassword } from "@/src/utils/hashPassowrd";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "username and task_list_id are required" },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);

    const result = await db.query(
      `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING id, username
    `,
      [username, hashed]
    );
    const user = result.rows[0];

    return NextResponse.json(user.username, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: `Server error: ${err}` },
      { status: 500 }
    );
  }
}

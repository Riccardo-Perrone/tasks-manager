import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    return NextResponse.json({
      message: "Utente trovato",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

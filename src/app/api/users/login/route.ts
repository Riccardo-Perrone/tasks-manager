import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/db/db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Password errata" }, { status: 401 });
    }

    (await cookies()).set("user_id", user.id, { httpOnly: true });

    return NextResponse.json({
      message: "Login riuscito",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

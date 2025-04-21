import { NextRequest, NextResponse } from "next/server";
import api from "./lib/axios";

export async function middleware(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;

  if (
    !userId &&
    PROTECTED_PATHS.some((path) => req.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const apiUrl = `${req.nextUrl.origin}/api/users/me/${userId}`;

  try {
    const userIsPresent = await api.get(apiUrl);
    if (!userIsPresent || !userIsPresent.data) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

const PROTECTED_PATHS = ["/dashboard", "/"];

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};

import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;

  if (
    !userId &&
    PROTECTED_PATHS.some((path) => req.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
const PROTECTED_PATHS = ["/dashboard", "/"];

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};

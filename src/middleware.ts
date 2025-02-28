import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Get token from cookies (session) or Authorization header

  const basePath = process.env.AUTH_URL

  console.log(basePath)

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // If the user is NOT logged in and trying to access a protected page, redirect to /login
  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(basePath + "/login");
  }

  if (req.nextUrl.pathname === "/" && token) {
    return NextResponse.redirect(basePath + "/pesquisa");
  }

  return NextResponse.next();
}

// 🔥 Optional: Define which routes require authentication
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

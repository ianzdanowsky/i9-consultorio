import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Get token from cookies (session) or Authorization header
  // const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // // If the user is NOT logged in and trying to access a protected page, redirect to /login
  // if (!token && req.nextUrl.pathname !== "/login") {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // if (req.nextUrl.pathname === "/" && token) {
  //   return NextResponse.redirect(new URL("/pesquisa", req.url));
  // }

  return NextResponse.next();
}

// 🔥 Optional: Define which routes require authentication
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

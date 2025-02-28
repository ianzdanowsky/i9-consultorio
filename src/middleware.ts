import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Get token from cookies (session) or Authorization header

  const basePath = process.env.AUTH_URL

  console.log("Base Path :", basePath)

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  console.log("Token: ", token)

  // If the user is NOT logged in and trying to access a protected page, redirect to /login
  if (!token && req.nextUrl.pathname !== "/login") {
    console.log("Pathname: ", req.nextUrl.pathname)
    console.log("Redirecting to login")
    return NextResponse.redirect(basePath + "/login");
  }

  if (req.nextUrl.pathname === "/" && token) {
    console.log("Redirecting to pesquisa")
    return NextResponse.redirect(basePath + "/pesquisa");
  }

  return NextResponse.next();
}

// 🔥 Optional: Define which routes require authentication
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

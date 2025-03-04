import { getToken, type GetTokenParams } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { use } from "react";

export async function middleware(req: NextRequest) {
  // Get token from cookies (session) or Authorization header

  const basePath = process.env.AUTH_URL

  const userCookies = req.cookies.get('__Secure-authjs.session-token')
  console.log(userCookies)

  if (!cookies) {
    console.error("Failed to retrieve token in production");
    console.log("Headers: ", req.headers.get("authorization"));
    console.log("Cookies: ", req.cookies);
  }
  
  // If the user is NOT logged in and trying to access a protected page, redirect to /login
  if (!userCookies && req.nextUrl.pathname !== "/login") {
    console.log("Pathname: ", req.nextUrl.pathname)
    console.log("Redirecting to login")
    return NextResponse.redirect(basePath + "/login");
  }

  if (req.nextUrl.pathname === "/" && userCookies) {
    console.log("Redirecting to pesquisa")
    return NextResponse.redirect(basePath + "/pesquisa");
  }

  return NextResponse.next();
}

// 🔥 Optional: Define which routes require authentication
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const basePath = process.env.AUTH_URL ?? "";

  console.log("🔍 Base Path:", basePath);
  console.log("🔍 Incoming Cookies:", req.cookies.getAll());
  console.log("🔍 Authorization Header:", req.headers.get("authorization"));

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    console.warn("❌ No token found!");
    return NextResponse.redirect(basePath + "/login");
  }

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(basePath + "/pesquisa");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

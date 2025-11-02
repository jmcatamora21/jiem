import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";


const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET!;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read the cookie
  const token = req.cookies.get("admin_token")?.value;

  // Protect /admin routes except login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as any;
      if (decoded.role !== "admin") throw new Error("Not admin");
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Redirect logged-in admins away from login
  if (pathname.startsWith("/admin/login") && token) {
  
    try {
     
      const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as any;
   
      if (decoded.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    } catch (error) {
      // ignore bad token
      console.log(error)
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
  runtime: "nodejs",
};

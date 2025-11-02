import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // if you want hashed passwords later

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET!;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Simple check for demonstration. In production, use hashed passwords.
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { role: "admin", email },
    ADMIN_JWT_SECRET,
    { expiresIn: "1d" } // token expires in 1 day
  );

  const res = NextResponse.json({ success: true, message: "Logged in" });

  // Set token as secure, httpOnly cookie
  res.cookies.set({
    name: "admin_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/", // important: middleware can read it on any route
  });

  return res;
}

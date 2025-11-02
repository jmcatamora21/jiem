import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {

  const cookieStore = await cookies(); // ✅ await it
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET!);
    if ((decoded as any).role !== "admin") throw new Error();

    return Response.json({ success: true, message: "Authorized" });
  } catch {
    return Response.json({ success: false, message: "Invalid token" }, { status: 403 });
  }
}

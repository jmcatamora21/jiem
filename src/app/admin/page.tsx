
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function AdminPage() {
  const cookieStore = await cookies(); // ✅ await it
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    // Not logged in → go to login
    redirect("/admin/login");
  }

  // Logged in → go to dashboard
  redirect("/admin/dashboard");
}

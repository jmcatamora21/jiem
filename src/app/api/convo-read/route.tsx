
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { v4 as uuidv4 } from "uuid"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const anon_id = searchParams.get("anon_id");
  const token = searchParams.get("token");

  console.log("TEST")
  const { data, error } = await supabaseAdmin
    .from("convo")
    .update({ read: true })
    .eq("token", token)
    .eq("anon_id", anon_id);

  if (error) {
    console.log(error.message)
     return new Response(JSON.stringify({ message: error.message, is_success: false }), { status: 500 });
     
  }
    
   

  return new Response(JSON.stringify({ message: "success", data, is_success: true }), { status: 200 });
}
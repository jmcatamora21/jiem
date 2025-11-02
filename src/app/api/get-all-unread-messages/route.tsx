import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function GET(req: Request) {
  const query = supabaseAdmin.from('convo').select('*')
  query.eq("read", false).order("id", {ascending: false})
  const { data, error } = await query

  if (error) return new Response(JSON.stringify({ data: {message: error.message, is_success: false } }), { status: 500 })
  return Response.json({ data: {message: "success", is_success: true, data: data } })
}

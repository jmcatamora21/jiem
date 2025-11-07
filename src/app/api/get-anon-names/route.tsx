import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const anon_id = searchParams.get('anon_id')

  const { data, error } = await supabaseAdmin
  .from('convo')
  .select('sender_name')
  .eq("anon_id", anon_id)
  .neq("is_admin", true)
  if (error) return new Response(JSON.stringify({ data: {message: error.message, is_success: false } }), { status: 500 })
  return Response.json({ data: {message: "success", is_success: true, data: data } })
}

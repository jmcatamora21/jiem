import { supabase } from "../../lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const anon_id = searchParams.get('anon_id')
  const token = searchParams.get('token')

  const query = supabase.from('convo').select('*')

  if (anon_id) query.eq('anon_id', anon_id).eq('token', token)

  const { data, error } = await query

  if (error) return new Response(JSON.stringify({ data: {message: error.message, is_success: false } }), { status: 500 })
  return Response.json({ data: {message: "success", is_success: true, data: data } })
}

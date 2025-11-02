import { supabase } from "../../lib/supabase";
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {

    const body = await req.json()
    const { name, message, anon_id, token } = body

    const { data, error } = await supabase
      .from('messages')
      .insert([
        { name, message, anon_id : anon_id, token:  token}
    ])

    if (error) {
      return new Response(JSON.stringify({ data: {message: error.message, is_success: false } }), { status: 500 })
    }

    return new Response(JSON.stringify({ data: {message: "success", data: data, is_success: true} }), { status: 201 })
  } catch (err: any) {
 
    return new Response(JSON.stringify({ data: {message: err.message, is_success: false } }), { status: 500 })
  }
}
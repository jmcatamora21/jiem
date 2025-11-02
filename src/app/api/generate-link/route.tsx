import { supabase } from "../../lib/supabase";
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {

    const body = await req.json()
    const { anon_id, name } = body

    if (!anon_id) {
      return new Response(JSON.stringify({ error: 'Missing anon_id' }), { status: 400 })
    }
    
    const nowIso = new Date().toISOString()

    // Step 1: Check for existing valid link
    const { data: existing, error: existingError } = await supabase
      .from('anon_links')
      .select('*')
      .eq('anon_id', anon_id)
      .gt('expires_at', nowIso)
      .maybeSingle()

    if (existingError) {
      return new Response(JSON.stringify({ data: {message: existingError.message, is_success: false}}), { status: 500 })
    }

    // ✅ Step 2: If valid existing link found, reuse it
    if (existing) {
      const existingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/r/${existing.token}`
      return new Response(JSON.stringify({data: {message: "success", url: existingUrl, token: existing.token, is_success: true}}), { status: 200 })
    }

    

    // 🆕 Step 3: Otherwise, create a new token
    const token = uuidv4()
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    const { error: insertError } = await supabase.from('anon_links').insert([
      {
        anon_id,
        token,
        expires_at: expires_at.toISOString(),
        name: name
      },
    ])

    if (insertError) {
      console.log(insertError.message)
      return new Response(JSON.stringify({ data: {message: insertError.message, is_success: false}}), { status: 500 })
    }
     
    const newUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/r/${token}`
   
    return new Response(JSON.stringify({ data: {message: "success", url: newUrl, is_success: true, token: token} }), { status: 201 })
  } catch (err: any) {
    return new Response(JSON.stringify({ data: {message: err.message, is_success: false}}), { status: 500 })
  }
}
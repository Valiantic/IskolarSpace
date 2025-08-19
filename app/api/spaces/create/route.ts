import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, code, userId } = body;
  if (!name || !code || !userId) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  // Create Space
  const { data: space, error: spaceError } = await supabase
    .from('tbl_spaces')
    .insert([{ name, code, created_by: userId }])
    .select()
    .single();
  if (spaceError) {
    console.error('Supabase space insert error:', spaceError);
    return new Response(JSON.stringify({ error: spaceError.message }), { status: 500 });
  }

  // Add Creator as Member
  const { error: memberError } = await supabase
    .from('tbl_space_members')
    .insert([{ user_id: userId, space_id: space.id }]);
  if (memberError) {
    return new Response(JSON.stringify({ error: memberError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ space }), { status: 200 });
}
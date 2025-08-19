import { NextRequest } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: NextRequest){
 const body = await req.json();
 const { code, userId } = body;
if (!code || !userId) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }
   // Find space by code
  const { data: space, error: spaceError } = await supabase
    .from('tbl_spaces')
    .select('id')
    .eq('code', code)
    .single();
  if (spaceError || !space) {
    return new Response(JSON.stringify({ error: 'Space not found' }), { status: 404 });
  }

  // Check if already a member
  const { data: member } = await supabase
    .from('tbl_space_members')
    .select('id')
    .eq('user_id', userId)
    .eq('space_id', space.id)
    .single();
  if (member) {
    return new Response(JSON.stringify({ error: 'Already a member' }), { status: 409 });
  }

  // Add member
  const { error: joinError } = await supabase
    .from('tbl_space_members')
    .insert([{ user_id: userId, space_id: space.id }]);
  if (joinError) {
    return new Response(JSON.stringify({ error: joinError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// note search params are use to fetch data
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spaceId = searchParams.get("spaceId");

  if (!spaceId) {
    return new Response(JSON.stringify({ error: 'Missing spaceId' }), { status: 400 });
  }

  // Get members of the space
  const { data, error } = await supabase
    .from('tbl_space_members')
    .select('user_id, tbl_users(id, full_name)')
    .eq('space_id', spaceId);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return NextResponse.json({ members: data }, { status: 200 });
}
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "../../../../lib/auth/apiAuth";

// POST: create a space. The creator is taken from the session, not the body.
export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const body = await req.json().catch(() => null);
  const name = body?.name;
  const code = body?.code;

  if (typeof name !== "string" || !name.trim() || typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (name.length > 100 || code.length > 32) {
    return NextResponse.json({ error: "Name or code too long" }, { status: 400 });
  }

  const { data: space, error: spaceError } = await auth.supabase
    .from("tbl_spaces")
    .insert([{ name: name.trim(), code: code.trim(), created_by: auth.userId }])
    .select()
    .single();

  if (spaceError) {
    console.error("Supabase space insert error:", spaceError);
    return NextResponse.json({ error: spaceError.message }, { status: 500 });
  }

  // Add the creator as admin.
  const { error: memberError } = await auth.supabase
    .from("tbl_space_members")
    .insert([{ user_id: auth.userId, space_id: space.id, role: "admin" }]);

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json({ space }, { status: 200 });
}

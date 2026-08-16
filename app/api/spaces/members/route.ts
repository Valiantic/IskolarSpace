import { NextRequest, NextResponse } from "next/server";
import { requireSpaceMember } from "../../../../lib/auth/apiAuth";

// GET: roster of a space. Only members of that space may read it.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spaceId = searchParams.get("spaceId");

  if (!spaceId) {
    return NextResponse.json({ error: "Missing spaceId" }, { status: 400 });
  }

  const auth = await requireSpaceMember(req, spaceId);
  if ("response" in auth) return auth.response;

  // Names only. Emails are never exposed to other members.
  const { data, error } = await auth.supabase
    .from("tbl_space_members")
    .select("user_id, role, tbl_users(id, full_name)")
    .eq("space_id", spaceId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ members: data }, { status: 200 });
}

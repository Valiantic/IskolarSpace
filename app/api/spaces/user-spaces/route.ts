import { NextRequest, NextResponse } from "next/server";
import {
  requireUser,
  requireSpaceAdmin,
  requireSpaceMember,
} from "../../../../lib/auth/apiAuth";

// GET: spaces the CALLER belongs to. The userId query param is ignored; the
// identity comes from the session so one user cannot enumerate another's spaces.
export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if ("response" in auth) return auth.response;

  const { data, error } = await auth.supabase
    .from("tbl_space_members")
    .select("space_id, tbl_spaces(name, code)")
    .eq("user_id", auth.userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ spaces: data }, { status: 200 });
}

// PUT: rename a space. Admins only.
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { spaceId, name } = body;

  if (!spaceId || !name || typeof name !== "string") {
    return NextResponse.json({ error: "Missing spaceId or name" }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json({ error: "Name too long" }, { status: 400 });
  }

  const auth = await requireSpaceAdmin(request, spaceId);
  if ("response" in auth) return auth.response;

  const { error } = await auth.supabase
    .from("tbl_spaces")
    .update({ name })
    .eq("id", spaceId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Space name updated" }, { status: 200 });
}

// DELETE: delete a space (admin) or leave one (self).
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { spaceId, action } = body;

  if (!spaceId || !action) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  if (action === "delete_space") {
    const auth = await requireSpaceAdmin(request, spaceId);
    if ("response" in auth) return auth.response;

    const { error } = await auth.supabase
      .from("tbl_spaces")
      .delete()
      .eq("id", spaceId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Space deleted" }, { status: 200 });
  }

  if (action === "leave_space") {
    const auth = await requireSpaceMember(request, spaceId);
    if ("response" in auth) return auth.response;

    // Always removes the CALLER. A userId in the body is ignored, so this
    // cannot be used to evict somebody else.
    const { error } = await auth.supabase
      .from("tbl_space_members")
      .delete()
      .eq("space_id", spaceId)
      .eq("user_id", auth.userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Left space" }, { status: 200 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// PATCH: toggle a member's admin flag. Admins only.
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { spaceId, memberId, makeAdmin } = body;

  if (!spaceId || !memberId || typeof makeAdmin !== "boolean") {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const auth = await requireSpaceAdmin(request, spaceId);
  if ("response" in auth) return auth.response;

  const { error } = await auth.supabase
    .from("tbl_space_members")
    .update({ role: makeAdmin ? "admin" : "member" })
    .eq("space_id", spaceId)
    .eq("user_id", memberId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Member admin status updated" }, { status: 200 });
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Get Space Members 
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tbl_space_members")
    .select("space_id, tbl_spaces(name, code)")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ spaces: data }, { status: 200 });
}

// Update Space Name
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { spaceId, name } = body;

  if (!spaceId || !name) {
    return NextResponse.json({ error: "Missing spaceId or name" }, { status: 400 });
  }

  const { error } = await supabase
    .from("tbl_spaces")
    .update({ name })
    .eq("id", spaceId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Space name updated" }, { status: 200 });
}

// Delte Space Name 
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { spaceId, userId, action } = body;

  if (!spaceId || !userId || !action) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  if (action === "delete_space") {
    const { error } = await supabase
      .from("tbl_spaces")
      .delete()
      .eq("id", spaceId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Space deleted" }, { status: 200 });
  }

  if (action === "leave_space") {
    const { error } = await supabase
      .from("tbl_space_members")
      .delete()
      .eq("space_id", spaceId)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Left space" }, { status: 200 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// Update Member Role
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { spaceId, memberId, makeAdmin } = body;

  if (!spaceId || !memberId || typeof makeAdmin !== "boolean") {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const { error } = await supabase
    .from("tbl_space_members")
    .update({ is_admin: makeAdmin })
    .eq("space_id", spaceId)
    .eq("user_id", memberId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Member admin status updated" }, { status: 200 });
}
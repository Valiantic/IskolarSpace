import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "../../../../lib/auth/apiAuth";
import { sendWelcomeEmail } from "../../../../lib/emailSender/welcomeMember";

// POST: join a space by code. Always enrolls the CALLER as a plain member —
// the userId and role are never read from the request body.
export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const body = await req.json().catch(() => null);
  const code = body?.code;

  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Resolving a code to a space requires reading tbl_spaces, which RLS hides
  // from non-members. join_space_by_code is a SECURITY DEFINER function that
  // performs the lookup and the enrollment atomically. See
  // sql/01_security_hardening.sql section 10.
  const { data: spaceId, error: joinError } = await auth.supabase.rpc(
    "join_space_by_code",
    { p_code: code.trim() }
  );

  if (joinError) {
    const message = joinError.message ?? "";
    if (message.includes("space not found")) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }
    console.error("Join space error:", joinError);
    return NextResponse.json({ error: "Failed to join space" }, { status: 500 });
  }

  if (!spaceId) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  // Welcome email. Never blocks the join.
  // Reading your OWN email is still permitted after the column revoke in
  // sql/01 section 6b, because the grant covers the owner's own row.
  try {
    const { data: userData } = await auth.supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", auth.userId)
      .single();

    const { data: spaceData } = await auth.supabase
      .from("tbl_spaces")
      .select("name")
      .eq("id", spaceId)
      .single();

    if (userData?.email && spaceData?.name) {
      await sendWelcomeEmail(
        userData.email,
        userData.full_name,
        spaceData.name,
        spaceId,
        ""
      );
    }
  } catch (e) {
    console.error("Failed to send welcome email:", e);
  }

  return NextResponse.json({ success: true, spaceId }, { status: 200 });
}

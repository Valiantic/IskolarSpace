import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side auth helpers for API routes.
 *
 * Every route in this app talks to Supabase with the public anon key, so the
 * database's RLS policies are the real enforcement layer (see
 * sql/01_security_hardening.sql). These helpers do two things on top of that:
 *
 *   1. Build a Supabase client that carries the CALLER's access token, so RLS
 *      evaluates `auth.uid()` as the real user instead of an anonymous session.
 *   2. Verify membership/role before the handler runs, so the API returns a
 *      clean 401/403 rather than a confusing empty result from a denied policy.
 *
 * Never trust a user id from the request body. Read it from the token.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

/** Pulls the bearer token off the request, if present. */
function getAccessToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length).trim() || null;
  }
  return null;
}

/**
 * A Supabase client scoped to the caller. Queries made through it run as that
 * user, so RLS applies.
 */
export function getAuthedClient(accessToken?: string | null): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : {},
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface AuthContext {
  supabase: SupabaseClient;
  userId: string;
  accessToken: string;
}

type AuthResult<T> = T | { response: NextResponse };

/**
 * Verifies the caller's token and returns their user id. The token is validated
 * against Supabase rather than decoded locally, so a forged or expired JWT is
 * rejected.
 */
export async function requireUser(
  request: NextRequest
): Promise<AuthResult<AuthContext>> {
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return { response: unauthorized("Missing access token") };
  }

  const supabase = getAuthedClient(accessToken);
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data?.user) {
    return { response: unauthorized("Invalid or expired session") };
  }

  return { supabase, userId: data.user.id, accessToken };
}

/** Verifies the caller is a member of the given space. */
export async function requireSpaceMember(
  request: NextRequest,
  spaceId: string
): Promise<AuthResult<AuthContext & { role: string }>> {
  const auth = await requireUser(request);
  if ("response" in auth) return auth;

  const { data, error } = await auth.supabase
    .from("tbl_space_members")
    .select("role")
    .eq("space_id", spaceId)
    .eq("user_id", auth.userId)
    .maybeSingle();

  if (error) {
    return { response: forbidden("Could not verify membership") };
  }
  if (!data) {
    return { response: forbidden("You are not a member of this space") };
  }

  return { ...auth, role: data.role };
}

/** Verifies the caller is an admin of the given space. */
export async function requireSpaceAdmin(
  request: NextRequest,
  spaceId: string
): Promise<AuthResult<AuthContext & { role: string }>> {
  const auth = await requireSpaceMember(request, spaceId);
  if ("response" in auth) return auth;

  if (auth.role !== "admin") {
    return { response: forbidden("Admin role required") };
  }
  return auth;
}

/**
 * Resolves a task id to its space and verifies the caller belongs to it. Used
 * by PUT/DELETE, which receive only a task id.
 */
export async function requireTaskAccess(
  request: NextRequest,
  taskId: string
): Promise<AuthResult<AuthContext & { spaceId: string; role: string }>> {
  const auth = await requireUser(request);
  if ("response" in auth) return auth;

  const { data: task, error } = await auth.supabase
    .from("tbl_tasks")
    .select("id, space_id")
    .eq("id", taskId)
    .maybeSingle();

  // A task in a space the caller cannot see is indistinguishable from a task
  // that does not exist, which avoids leaking which ids are real.
  if (error || !task) {
    return { response: forbidden("Task not found or not accessible") };
  }

  const membership = await requireSpaceMember(request, task.space_id);
  if ("response" in membership) return membership;

  return { ...membership, spaceId: task.space_id };
}

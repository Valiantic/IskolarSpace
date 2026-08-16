import { NextRequest, NextResponse } from "next/server";
import { sendAssignmentEmail } from "../../../../lib/emailSender/sendAssignment";
import { sendDeadlineReminderEmail } from "../../../../lib/emailSender/deadlineReminder";
import {
  getAuthedClient,
  requireSpaceMember,
  requireTaskAccess,
  unauthorized,
} from "../../../../lib/auth/apiAuth";

/** Task fields a client is allowed to set. Anything else in the body is dropped. */
const PRIORITIES = ["low", "moderate", "high"] as const;
const KANBAN_STATUSES = ["todo", "in_progress", "done"] as const;

const isPriority = (v: unknown): v is (typeof PRIORITIES)[number] =>
  typeof v === "string" && (PRIORITIES as readonly string[]).includes(v);

const isKanbanStatus = (v: unknown): v is (typeof KANBAN_STATUSES)[number] =>
  typeof v === "string" && (KANBAN_STATUSES as readonly string[]).includes(v);

const MAX_TITLE = 200;
const MAX_DESCRIPTION = 10_000;

/** Coerces the incoming assignee field into a clean, de-duplicated id array. */
function parseAssignees(body: Record<string, unknown>): string[] | undefined {
  const raw = body.assignees ?? body.assigned_to;
  if (raw === undefined) return undefined;
  if (raw === null) return [];

  const list = Array.isArray(raw) ? raw : [raw];
  const ids = list.filter(
    (id): id is string => typeof id === "string" && id.trim().length > 0
  );
  return Array.from(new Set(ids));
}

/** Replaces a task's assignee set, returning the ids that are newly added. */
async function setAssignees(
  supabase: ReturnType<typeof getAuthedClient>,
  taskId: string,
  spaceId: string,
  assignees: string[],
  actorId: string
): Promise<{ added: string[]; error?: string }> {
  // Only real members of this space may be assigned. This is what stops a
  // caller from attaching an arbitrary user id to a task.
  let valid: string[] = [];
  if (assignees.length > 0) {
    const { data: members, error: membersError } = await supabase
      .from("tbl_space_members")
      .select("user_id")
      .eq("space_id", spaceId)
      .in("user_id", assignees);

    if (membersError) return { added: [], error: membersError.message };
    valid = (members ?? []).map((m: { user_id: string }) => m.user_id);
  }

  const { data: existingRows, error: existingError } = await supabase
    .from("tbl_task_assignees")
    .select("user_id")
    .eq("task_id", taskId);

  if (existingError) return { added: [], error: existingError.message };

  const existing = (existingRows ?? []).map((r: { user_id: string }) => r.user_id);
  const added = valid.filter((id) => !existing.includes(id));
  const removed = existing.filter((id) => !valid.includes(id));

  if (removed.length > 0) {
    const { error } = await supabase
      .from("tbl_task_assignees")
      .delete()
      .eq("task_id", taskId)
      .in("user_id", removed);
    if (error) return { added: [], error: error.message };
  }

  if (added.length > 0) {
    const { error } = await supabase.from("tbl_task_assignees").insert(
      added.map((userId) => ({
        task_id: taskId,
        user_id: userId,
        assigned_by: actorId,
      }))
    );
    if (error) return { added: [], error: error.message };
  }

  return { added };
}

/** Attaches an `assignees: string[]` array to each task row. */
async function withAssignees(
  supabase: ReturnType<typeof getAuthedClient>,
  tasks: Array<Record<string, any>>
) {
  if (tasks.length === 0) return tasks;

  const { data: rows } = await supabase
    .from("tbl_task_assignees")
    .select("task_id, user_id")
    .in(
      "task_id",
      tasks.map((t) => t.id)
    );

  const byTask = new Map<string, string[]>();
  for (const row of rows ?? []) {
    const list = byTask.get(row.task_id) ?? [];
    list.push(row.user_id);
    byTask.set(row.task_id, list);
  }

  return tasks.map((task) => ({
    ...task,
    assignees: byTask.get(task.id) ?? [],
  }));
}

/** Fire-and-forget assignment notifications. Never blocks the response. */
async function notifyAssignees(
  supabase: ReturnType<typeof getAuthedClient>,
  userIds: string[],
  actorId: string,
  taskTitle: string,
  priority: string,
  spaceId: string,
  deadline?: string | null
) {
  if (userIds.length === 0) return;
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error("GMAIL_USER or GMAIL_PASS not set, assignment emails skipped.");
    return;
  }

  try {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", [...userIds, actorId]);

    const assignerName =
      profiles?.find((p: { id: string }) => p.id === actorId)?.full_name ?? "Unknown";

    let spaceName = "";
    if (deadline) {
      const { data: spaceData } = await supabase
        .from("tbl_spaces")
        .select("name")
        .eq("id", spaceId)
        .single();
      spaceName = spaceData?.name ?? "";
    }

    const today = new Date().toISOString().split("T")[0];

    await Promise.allSettled(
      userIds.map(async (userId) => {
        const profile = profiles?.find((p: { id: string }) => p.id === userId);
        if (!profile?.email) return;

        await sendAssignmentEmail(
          profile.email,
          profile.full_name,
          taskTitle,
          assignerName,
          priority,
          spaceId
        );

        if (deadline) {
          const deadlineDate = new Date(deadline).toISOString().split("T")[0];
          if (deadlineDate === today) {
            await sendDeadlineReminderEmail(
              profile.email,
              profile.full_name,
              taskTitle,
              deadlineDate,
              spaceName,
              spaceId
            );
          }
        }
      })
    );
  } catch (emailErr) {
    console.error("Email send error:", emailErr);
  }
}

// GET: Fetch all tasks for a space
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const spaceId = searchParams.get("spaceId");
  if (!spaceId) {
    return NextResponse.json({ error: "Missing spaceId" }, { status: 400 });
  }

  const auth = await requireSpaceMember(request, spaceId);
  if ("response" in auth) return auth.response;
  const { supabase } = auth;

  const { data, error } = await supabase
    .from("tbl_tasks")
    .select("*")
    .eq("space_id", spaceId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { tasks: await withAssignees(supabase, data ?? []) },
    { status: 200 }
  );
}

// POST: Create a new task
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const spaceId = searchParams.get("spaceId");
  if (!spaceId) {
    return NextResponse.json({ error: "Missing spaceId" }, { status: 400 });
  }

  const auth = await requireSpaceMember(request, spaceId);
  if ("response" in auth) return auth.response;
  const { supabase, userId } = auth;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { title, description, status, deadline, kanban_status } = body;
  const assignees = parseAssignees(body) ?? [];

  if (typeof description !== "string" || description.trim().length === 0) {
    return NextResponse.json({ error: "Missing description" }, { status: 400 });
  }
  if (description.length > MAX_DESCRIPTION) {
    return NextResponse.json({ error: "Description too long" }, { status: 400 });
  }
  if (title != null && (typeof title !== "string" || title.length > MAX_TITLE)) {
    return NextResponse.json({ error: "Invalid title" }, { status: 400 });
  }
  if (status !== undefined && status !== null && !isPriority(status)) {
    return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
  }
  if (
    kanban_status !== undefined &&
    kanban_status !== null &&
    !isKanbanStatus(kanban_status)
  ) {
    return NextResponse.json({ error: "Invalid kanban status" }, { status: 400 });
  }

  // created_by comes from the verified session, never from the request body.
  const { data, error } = await supabase
    .from("tbl_tasks")
    .insert([
      {
        space_id: spaceId,
        title: title ?? null,
        description,
        created_by: userId,
        status: status ?? "low",
        kanban_status: kanban_status ?? "todo",
        deadline: deadline ?? null,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { added, error: assignError } = await setAssignees(
    supabase,
    data.id,
    spaceId,
    assignees,
    userId
  );
  if (assignError) {
    return NextResponse.json({ error: assignError }, { status: 500 });
  }

  await notifyAssignees(
    supabase,
    added,
    userId,
    title ?? description.slice(0, 80),
    status ?? "low",
    spaceId,
    deadline ?? null
  );

  return NextResponse.json(
    { task: { ...data, assignees: added } },
    { status: 200 }
  );
}

// PUT: Edit a task
export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { id, title, description, status, deadline, kanban_status } = body;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }

  const auth = await requireTaskAccess(request, id);
  if ("response" in auth) return auth.response;
  const { supabase, userId, spaceId } = auth;

  const updateFields: Record<string, unknown> = {};

  if (title !== undefined) {
    if (title !== null && (typeof title !== "string" || title.length > MAX_TITLE)) {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }
    updateFields.title = title;
  }
  if (description !== undefined) {
    if (typeof description !== "string" || description.length > MAX_DESCRIPTION) {
      return NextResponse.json({ error: "Invalid description" }, { status: 400 });
    }
    updateFields.description = description;
  }
  if (status !== undefined) {
    if (!isPriority(status)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    }
    updateFields.status = status;
  }
  if (kanban_status !== undefined) {
    if (!isKanbanStatus(kanban_status)) {
      return NextResponse.json({ error: "Invalid kanban status" }, { status: 400 });
    }
    updateFields.kanban_status = kanban_status;
  }
  if (deadline !== undefined) {
    updateFields.deadline = deadline;
  }

  if (Object.keys(updateFields).length > 0) {
    const { error } = await supabase
      .from("tbl_tasks")
      .update(updateFields)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // Only touch assignments when the client actually sent the field, so a
  // partial update (a kanban drag, say) does not wipe the assignee list.
  let added: string[] = [];
  const assignees = parseAssignees(body);
  if (assignees !== undefined) {
    const result = await setAssignees(supabase, id, spaceId, assignees, userId);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    added = result.added;
  }

  await notifyAssignees(
    supabase,
    added,
    userId,
    typeof title === "string" ? title : "",
    isPriority(status) ? status : "low",
    spaceId,
    deadline ?? null
  );

  const { data: updated } = await supabase
    .from("tbl_tasks")
    .select("*")
    .eq("id", id)
    .single();

  const [task] = await withAssignees(supabase, updated ? [updated] : []);
  return NextResponse.json({ task }, { status: 200 });
}

// DELETE: Delete a task
export async function DELETE(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { id, ids } = body ?? {};

  // Accepts a single id or an array for bulk delete.
  const targets: string[] = Array.isArray(ids)
    ? ids.filter((v): v is string => typeof v === "string" && v.length > 0)
    : typeof id === "string" && id.length > 0
    ? [id]
    : [];

  if (targets.length === 0) {
    return NextResponse.json({ error: "Missing task id or ids" }, { status: 400 });
  }

  // Authorize the first target to establish the caller's space, then confirm
  // every remaining id belongs to that same space. Without this, one authorized
  // id would be enough to delete tasks anywhere.
  const auth = await requireTaskAccess(request, targets[0]);
  if ("response" in auth) return auth.response;
  const { supabase, spaceId } = auth;

  const { data: owned, error: lookupError } = await supabase
    .from("tbl_tasks")
    .select("id")
    .eq("space_id", spaceId)
    .in("id", targets);

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }
  if ((owned?.length ?? 0) !== targets.length) {
    return NextResponse.json(
      { error: "One or more tasks are not accessible" },
      { status: 403 }
    );
  }

  // tbl_task_assignees cascades on task delete.
  const { error } = await supabase
    .from("tbl_tasks")
    .delete()
    .eq("space_id", spaceId)
    .in("id", targets);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendAssignmentEmail } from "../../../../lib/emailSender/sendAssignment";
import { sendDeadlineReminderEmail } from "../../../../lib/emailSender/deadlineReminder";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Fetch all tasks for a space
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const spaceId = searchParams.get("spaceId");
  if (!spaceId) {
    return NextResponse.json({ error: "Missing spaceId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tbl_tasks")
    .select("*")
    .eq("space_id", spaceId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ tasks: data }, { status: 200 });
}

// POST: Create a new task
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const spaceId = searchParams.get("spaceId");
  if (!spaceId) {
    return NextResponse.json({ error: "Missing spaceId" }, { status: 400 });
  }
  const body = await request.json();
  const { title, description, assigned_to, created_by, status, deadline } = body;
  if (!title || !created_by) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("tbl_tasks")
    .insert([{ space_id: spaceId, title, description, assigned_to, created_by, status, deadline }]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

    if (assigned_to) {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', assigned_to)
        .single();
      let assignerName = 'Unknown';
      if (created_by) {
        const { data: assignerProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', created_by)
          .single();
        if (assignerProfile?.full_name) {
          assignerName = assignerProfile.full_name;
        }
      }
      if (userProfile?.email && process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        await sendAssignmentEmail(userProfile.email, userProfile.full_name, title, assignerName, status, spaceId);
      } else {
        console.error('GMAIL_USER or GMAIL_PASS not set, email not sent.', error);
      }
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
    }
  }

  return NextResponse.json({ task: data }, { status: 200 });
}

// PUT: Edit a task
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, title, description, status, assigned_to, created_by, deadline, kanban_status } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }
  const updateFields: any = {};
  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (status !== undefined) updateFields.status = status;
  if (assigned_to !== undefined) updateFields.assigned_to = assigned_to;
  if (deadline !== undefined) updateFields.deadline = deadline;
  if (kanban_status !== undefined) updateFields.kanban_status = kanban_status;
  const { data, error } = await supabase
    .from("tbl_tasks")
    .update(updateFields)
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send assignment email if assigned_to is present
  if (assigned_to) {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', assigned_to)
        .single();
      let assignerName = 'Unknown';
      if (created_by) {
        const { data: assignerProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', created_by)
          .single();
        if (assignerProfile?.full_name) {
          assignerName = assignerProfile.full_name;
        }
      }
      if (userProfile?.email && process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        await sendAssignmentEmail(userProfile.email, userProfile.full_name, title ?? '', assignerName, status ?? '', id);
        // Send deadline reminder email if deadline is today
        if (deadline) {
          const today = new Date().toISOString().split('T')[0];
          const deadlineDate = new Date(deadline).toISOString().split('T')[0];
          if (deadlineDate === today) {
            // Fetch space name
            let spaceName = '';
            if (id) {
              const { data: taskData } = await supabase
                .from('tbl_tasks')
                .select('space_id')
                .eq('id', id)
                .single();
              if (taskData?.space_id) {
                const { data: spaceData } = await supabase
                  .from('tbl_spaces')
                  .select('name')
                  .eq('id', taskData.space_id)
                  .single();
                if (spaceData?.name) {
                  spaceName = spaceData.name;
                }
              }
            }
            await sendDeadlineReminderEmail(
              userProfile.email,
              userProfile.full_name,
              title ?? '',
              deadlineDate,
              spaceName,
              id
            );
          }
        }
      } else {
        console.error('GMAIL_USER or GMAIL_PASS not set, email not sent.', error);
      }
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
    }
  }

  return NextResponse.json({ task: data }, { status: 200 });
}

// DELETE: Delete a task
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }
  const { error } = await supabase
    .from("tbl_tasks")
    .delete()
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
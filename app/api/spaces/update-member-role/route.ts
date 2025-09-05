import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PUT(request: NextRequest) {
  try {
    const { spaceId, userId, role } = await request.json();

    if (!spaceId || !userId || !role) {
      return NextResponse.json(
        { message: 'Space ID, user ID, and role are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'member'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role. Must be admin or member' },
        { status: 400 }
      );
    }

    // Update member role
    const { error } = await supabase
      .from('tbl_space_members')
      .update({ role })
      .eq('space_id', spaceId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating member role:', error);
      return NextResponse.json(
        { message: 'Failed to update member role' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Member role updated successfully' });
  } catch (error) {
    console.error('Error in update-member-role API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireSpaceAdmin } from '../../../../lib/auth/apiAuth';

// PUT: change a member's role. Admins only.
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

    const auth = await requireSpaceAdmin(request, spaceId);
    if ('response' in auth) return auth.response;

    // Refuse to demote the last admin, which would strand the space with
    // nobody able to manage it.
    if (role === 'member') {
      const { data: admins } = await auth.supabase
        .from('tbl_space_members')
        .select('user_id')
        .eq('space_id', spaceId)
        .eq('role', 'admin');

      const adminIds = (admins ?? []).map((a: { user_id: string }) => a.user_id);
      if (adminIds.length <= 1 && adminIds.includes(userId)) {
        return NextResponse.json(
          { message: 'Cannot demote the last admin of a space' },
          { status: 400 }
        );
      }
    }

    const { error } = await auth.supabase
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

import { NextRequest, NextResponse } from 'next/server';
import { requireSpaceAdmin } from '../../../../lib/auth/apiAuth';

// DELETE: remove a member from a space. Admins only.
export async function DELETE(request: NextRequest) {
  try {
    const { spaceId, userId } = await request.json();

    if (!spaceId || !userId) {
      return NextResponse.json(
        { message: 'Space ID and user ID are required' },
        { status: 400 }
      );
    }

    const auth = await requireSpaceAdmin(request, spaceId);
    if ('response' in auth) return auth.response;

    // An admin cannot kick themselves; they should leave the space instead.
    // This also prevents a space being left with no admin by accident.
    if (userId === auth.userId) {
      return NextResponse.json(
        { message: 'Use "leave space" to remove yourself' },
        { status: 400 }
      );
    }

    const { error } = await auth.supabase
      .from('tbl_space_members')
      .delete()
      .eq('space_id', spaceId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error kicking member:', error);
      return NextResponse.json(
        { message: 'Failed to kick member' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Member kicked successfully' });
  } catch (error) {
    console.error('Error in kick-member API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

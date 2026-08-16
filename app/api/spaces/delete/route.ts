import { NextRequest, NextResponse } from 'next/server';
import { requireSpaceAdmin } from '../../../../lib/auth/apiAuth';

// DELETE: remove a space. Admins of that space only.
export async function DELETE(request: NextRequest) {
  try {
    const { spaceId } = await request.json();

    if (!spaceId || typeof spaceId !== 'string') {
      return NextResponse.json(
        { message: 'Space ID is required' },
        { status: 400 }
      );
    }

    const auth = await requireSpaceAdmin(request, spaceId);
    if ('response' in auth) return auth.response;

    // Cascades to members and tasks.
    const { error } = await auth.supabase
      .from('tbl_spaces')
      .delete()
      .eq('id', spaceId);

    if (error) {
      console.error('Error deleting space:', error);
      return NextResponse.json(
        { message: 'Failed to delete space' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Space deleted successfully' });
  } catch (error) {
    console.error('Error in delete space API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

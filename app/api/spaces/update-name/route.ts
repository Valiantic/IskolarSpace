import { NextRequest, NextResponse } from 'next/server';
import { requireSpaceAdmin } from '../../../../lib/auth/apiAuth';

// PUT: rename a space. Admins only.
export async function PUT(request: NextRequest) {
  try {
    const { spaceId, newName } = await request.json();

    if (!spaceId || !newName?.trim()) {
      return NextResponse.json(
        { message: 'Space ID and new name are required' },
        { status: 400 }
      );
    }

    if (typeof newName !== 'string' || newName.length > 100) {
      return NextResponse.json({ message: 'Invalid name' }, { status: 400 });
    }

    const auth = await requireSpaceAdmin(request, spaceId);
    if ('response' in auth) return auth.response;

    const { error } = await auth.supabase
      .from('tbl_spaces')
      .update({ name: newName.trim() })
      .eq('id', spaceId);

    if (error) {
      console.error('Error updating space name:', error);
      return NextResponse.json(
        { message: 'Failed to update space name' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Space name updated successfully' });
  } catch (error) {
    console.error('Error in update-name API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

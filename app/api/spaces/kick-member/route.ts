import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(request: NextRequest) {
  try {
    const { spaceId, userId } = await request.json();

    if (!spaceId || !userId) {
      return NextResponse.json(
        { message: 'Space ID and user ID are required' },
        { status: 400 }
      );
    }

    // Remove member from space
    const { error } = await supabase
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

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PUT(request: NextRequest) {
  try {
    const { spaceId, newName } = await request.json();

    if (!spaceId || !newName?.trim()) {
      return NextResponse.json(
        { message: 'Space ID and new name are required' },
        { status: 400 }
      );
    }

    // Update space name
    const { error } = await supabase
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

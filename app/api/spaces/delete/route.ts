import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(request: NextRequest) {
  try {
    const { spaceId } = await request.json();

    if (!spaceId) {
      return NextResponse.json(
        { message: 'Space ID is required' },
        { status: 400 }
      );
    }

    // Delete space (this will cascade delete related records)
    const { error } = await supabase
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

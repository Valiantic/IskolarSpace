import { supabase } from '../../../lib/supabaseClient';

export async function GET(){
    await supabase.from('keep_alive').select('id').limit(1);
    return new Response('Pinged Supabase', { status: 200 });
}
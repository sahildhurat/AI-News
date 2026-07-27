import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { articleId, action } = await request.json();

    if (!articleId || (action !== 'save' && action !== 'unsave')) {
      return NextResponse.json({ error: 'Invalid or missing fields' }, { status: 400 });
    }

    if (action === 'save') {
      const { error } = await supabase
        .from('saved_articles')
        .insert({ user_id: user.id, article_id: articleId });

      // Ignore uniqueness constraint errors (already saved)
      if (error && error.code !== '23505') throw error;
      
    } else if (action === 'unsave') {
      const { error } = await supabase
        .from('saved_articles')
        .delete()
        .match({ user_id: user.id, article_id: articleId });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/save:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

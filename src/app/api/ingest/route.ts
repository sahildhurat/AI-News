import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import crypto from 'crypto';

// Hash function to deduplicate articles
function generateHash(title: string): string {
  const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
  return crypto.createHash('sha256').update(normalizedTitle).digest('hex');
}

export async function GET(request: Request) {
  // Basic security: only allow the cron job to run this endpoint
  const authHeader = request.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // 1. Fetch active topics
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*')
      .eq('is_active', true);

    if (topicsError) throw topicsError;
    if (!topics || topics.length === 0) {
      return NextResponse.json({ message: 'No active topics found' });
    }

    const gnewsApiKey = process.env.GNEWS_API_KEY;
    if (!gnewsApiKey) {
      throw new Error('GNEWS_API_KEY is not defined');
    }

    let totalInserted = 0;

    // 2. Loop through topics and query GNews
    for (const topic of topics) {
      // Free tier allows ~100 requests/day, so use 'search' endpoint per topic
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic.query_terms)}&lang=en&apikey=${gnewsApiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 429) {
          console.warn('GNews API rate limit reached. Halting ingestion loop.');
          break; // Stop fetching more topics
        }
        console.error(`Failed to fetch for topic ${topic.label}:`, response.statusText);
        continue; // Skip this topic and proceed to the next
      }

      const data = await response.json();
      const articles = data.articles || [];

      for (const article of articles) {
        // 3. Trigram Deduplication
        const { data: isSimilar, error: simError } = await supabase.rpc('check_similar_article_exists', { 
            p_title: article.title, 
            threshold: 0.65 
        });

        if (simError) {
          console.error(`Error checking similarity for: ${article.title}`, simError);
        }

        if (isSimilar) {
           console.log(`Skipping fuzzy duplicate: ${article.title}`);
           continue;
        }

        const contentHash = generateHash(article.title);

        // 4. Insert New Article
        const { data: insertedArticle, error: insertError } = await supabase
          .from('articles')
          .insert({
            source: article.source.name,
            title: article.title,
            url: article.url,
            description: article.description,
            image_url: article.image,
            published_at: article.publishedAt,
            content_hash: contentHash
          })
          .select('id')
          .single();

        // 23505 is the Postgres error code for unique_violation (duplicate url or content_hash)
        if (insertError && insertError.code !== '23505') {
            console.error(`Error inserting article: ${article.title}`, insertError);
        } else if (insertedArticle) {
            // 4. Map the newly inserted article to the topic
            await supabase.from('article_topics').insert({
                article_id: insertedArticle.id,
                topic_id: topic.id
            });
            totalInserted++;
        }
      }
    }

    return NextResponse.json({ message: `Ingestion complete. Inserted ${totalInserted} new articles.` });
  } catch (error: any) {
    console.error('Ingestion failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { createClient } from '@/utils/supabase/server';
import ArticleCard from '@/components/ArticleCard';
import TopicChips from '@/components/TopicChips';
import SkeletonLoader from '@/components/SkeletonLoader';
import FollowButton from '@/components/FollowButton';
import { Suspense } from 'react';

export const revalidate = 60;

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const selectedTopicSlug = typeof searchParams.topic === 'string' ? searchParams.topic : undefined;

  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .eq('is_active', true)
    .order('label');

  let savedArticleIds = new Set<string>();
  let followedTopicIds = new Set<string>();

  if (user) {
    const { data: saved } = await supabase.from('saved_articles').select('article_id').eq('user_id', user.id);
    if (saved) saved.forEach((s: any) => savedArticleIds.add(s.article_id));

    const { data: follows } = await supabase.from('user_follows').select('topic_id').eq('user_id', user.id);
    if (follows) follows.forEach((f: any) => followedTopicIds.add(f.topic_id));
  }

  let articlesQuery = supabase
    .from('articles')
    .select(`
      id, title, source, url, image_url, published_at,
      article_topics!inner(
        topic_id,
        topics!inner(slug)
      )
    `)
    .order('published_at', { ascending: false })
    .limit(50);

  if (selectedTopicSlug) {
    articlesQuery = articlesQuery.eq('article_topics.topics.slug', selectedTopicSlug);
  } else if (user && followedTopicIds.size > 0) {
    articlesQuery = articlesQuery.in('article_topics.topic_id', Array.from(followedTopicIds));
  }

  const { data: rawArticles, error } = await articlesQuery;
  
  if (error) {
    console.error("Error fetching articles:", error);
  }

  const articles = (rawArticles || []).map((a: any) => ({
    id: a.id,
    title: a.title,
    source: a.source,
    url: a.url,
    image_url: a.image_url,
    published_at: a.published_at,
  }));

  const activeTopicObj = topics?.find((t: any) => t.slug === selectedTopicSlug);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 rounded-[100%] blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-[1280px] mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        
        <header className="mb-14">
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Your Intelligence Feed.
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-xl text-on-surface-variant">
            <p>
              {activeTopicObj ? activeTopicObj.label : (user && followedTopicIds.size > 0 ? 'Your Curated Signal' : 'The Global AI Front')}
            </p>
            {activeTopicObj && (
              <div className="md:ml-4">
                <FollowButton topicId={activeTopicObj.id} initialFollowed={followedTopicIds.has(activeTopicObj.id)} />
              </div>
            )}
          </div>
        </header>

        <section aria-label="Topic Filters" className="mb-10">
          <TopicChips topics={topics || []} selectedSlug={selectedTopicSlug} />
        </section>

        <section aria-label="News Feed" className="flex flex-col gap-8">
          <Suspense fallback={<div className="flex flex-col gap-8"><SkeletonLoader /><SkeletonLoader /></div>}>
            {articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} isSaved={savedArticleIds.has(article.id)} />
              ))
            ) : (
              <div className="text-center py-32 glass rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-display font-bold text-on-surface">No news detected</h3>
                  <p className="mt-4 text-lg text-on-surface-variant max-w-md mx-auto">
                    {user && followedTopicIds.size === 0 && !selectedTopicSlug 
                      ? "You aren't tracking any topics yet. Select a node above to begin ingestion."
                      : "We're currently scanning the network for new signals on this topic. Check back soon."}
                  </p>
                </div>
              </div>
            )}
          </Suspense>
        </section>

      </div>
    </main>
  );
}

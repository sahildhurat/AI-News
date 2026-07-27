-- AI News Supabase Migration: 001_initial_schema.sql

-- Topics Table
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    query_terms TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Articles Table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    published_at TIMESTAMPTZ NOT NULL,
    content_hash TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Article-Topics Join Table
CREATE TABLE article_topics (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, topic_id)
);

-- User Follows Table
CREATE TABLE user_follows (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, topic_id)
);

-- Saved Articles Table
CREATE TABLE saved_articles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('saved', 'read')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, article_id)
);

-- Row Level Security (RLS) Setup

-- Enable RLS on all tables
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

-- Policies for public reads on core data
CREATE POLICY "Topics are readable by everyone" ON topics FOR SELECT USING (true);
CREATE POLICY "Articles are readable by everyone" ON articles FOR SELECT USING (true);
CREATE POLICY "Article_topics are readable by everyone" ON article_topics FOR SELECT USING (true);

-- Policies for authenticated user data
CREATE POLICY "Users can read their own follows" ON user_follows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own follows" ON user_follows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own follows" ON user_follows FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own saved articles" ON saved_articles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own saved articles" ON saved_articles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own saved articles" ON saved_articles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved articles" ON saved_articles FOR DELETE USING (auth.uid() = user_id);

-- Seeding Initial Topics
INSERT INTO topics (slug, label, query_terms) VALUES
('agents', 'AI Agents', '"AI agents" OR "agentic" OR "autonomous agents"'),
('models-research', 'Models & Research', '"large language model" OR "foundation model" OR OpenAI OR Anthropic'),
('policy-safety', 'Policy & Safety', '"AI policy" OR "AI regulation" OR "AI safety" OR "alignment"'),
('business-funding', 'Business & Funding', '"AI startup" OR "AI funding" OR "venture capital AI" OR "generative AI business"'),
('tools-products', 'Tools & Products', '"AI tool" OR "new AI product" OR "AI feature"'),
('hardware-chips', 'Hardware & Chips', '"AI chips" OR "Nvidia GPU" OR "AI hardware"');

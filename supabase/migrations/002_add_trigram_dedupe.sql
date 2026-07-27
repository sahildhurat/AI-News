-- Enable the pg_trgm extension for fuzzy string matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create an RPC function to check if a similar article exists
CREATE OR REPLACE FUNCTION check_similar_article_exists(p_title text, threshold float)
RETURNS boolean AS $$
DECLARE
    similar_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM articles 
        WHERE created_at > now() - interval '2 days'
        AND similarity(title, p_title) > threshold
    ) INTO similar_exists;
    RETURN similar_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

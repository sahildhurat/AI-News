# AI News Edge Cases & Corner Scenarios

This document outlines the edge cases and corner scenarios for the **AI News** tracker, categorized by system domain. Addressing these ensures system resilience and a smooth user experience.

---

## 1. Data Ingestion & API Layer

| Scenario | System Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **GNews API Rate Limit Reached (429 Error)** | The cron job will fail to fetch new articles. | **Graceful Degradation:** The frontend remains fully operational serving "stale" data from Supabase. Ensure the `/api/ingest` route catches the 429 error and exits cleanly without crashing. |
| **Malformed API Response** | Ingestion pipeline might throw a runtime exception if expected fields (e.g., `image_url`, `description`) are missing. | Use optional chaining and default fallback values during insertion (e.g., a default placeholder image or empty string for descriptions). |
| **Zero Articles Returned** | A highly specific topic query might return no news for a given window. | Ensure the database insertion loop can handle an empty array gracefully without throwing errors. |
| **GNews API Outage (5xx Error)** | Complete failure to ingest data. | Log the error and rely on the database for serving the app. Implement retry logic in later versions if necessary. |

## 2. De-duplication & Database Integrity

| Scenario | System Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Concurrent Cron Executions** | If Vercel Cron misfires and runs the ingest route twice simultaneously, duplicate inserts could be attempted. | Supabase's `UNIQUE` constraint on `content_hash` and `url` is the hard defense. The ingest API must use an `UPSERT` (e.g., `onConflict: 'content_hash'`) or silently catch duplicate key exceptions. |
| **Same Title, Different Content** | E.g., A generic title like "AI Weekly Update" from different publishers on different days. | If the `content_hash` relies *only* on the title, it will reject the newer article. **Fix:** Ensure the hash function incorporates a combination of `title` + `source` + `published_date` (day resolution) to prevent false positives. |
| **Special Character Encoding** | "AI's Future" vs "AI’s Future" (straight vs. curly quote) might yield different hashes and bypass de-duplication. | The normalization function must strip *all* non-alphanumeric characters, not just whitespace, before hashing. |
| **Database Bloat** | Over months, the `articles` table will grow massive, potentially slowing down queries. | In v2, implement a background cleanup job that deletes or archives un-saved articles older than 30 days. |

## 3. User Experience & Frontend

| Scenario | System Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **New User / No Followed Topics** | The main feed query will return zero articles, resulting in a blank dashboard. | Implement a dedicated "Onboarding Empty State" prompting the user to select their first topics immediately upon login. |
| **Deleted Topics** | Admin deletes a topic from the database that users are still actively following. | Use foreign key cascading (`ON DELETE CASCADE` on `user_follows.topic_id`) so the system automatically cleans up orphaned follows. |
| **Expired Magic Link** | User clicks an old login link and authentication fails. | The frontend must catch the Supabase Auth error and redirect to the login page with a clear toast notification: *"This link has expired. Please request a new one."* |
| **Session Expiry During Use** | A user tries to click "Save Article", but their authentication session just expired. | The database mutation will fail via RLS. Catch the 401 Unauthorized error and trigger a redirect to the login screen, preserving their intended action if possible. |
| **Pagination/Infinite Scroll Exhaustion** | User scrolls past the currently cached/fetched articles. | Implement a clean "You've caught up!" message instead of a generic loading spinner that never resolves. |

## 4. Security & Privacy

| Scenario | System Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Malicious API Requests** | Someone discovers the `/api/ingest` endpoint URL and pings it repeatedly to drive up your GNews quota. | Protect the `/api/ingest` route using a secret authorization header verified against an environment variable (e.g., checking `req.headers.authorization === process.env.CRON_SECRET`). |
| **Cross-User Data Manipulation** | User A tries to send a direct API request to save an article to User B's `user_id`. | Strictly enforce Row Level Security (RLS) on the `saved_articles` and `user_follows` tables so a user can *only* insert or select rows where `user_id = auth.uid()`. |

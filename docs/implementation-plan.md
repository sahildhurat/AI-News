# AI News Implementation Plan

This document outlines the phase-wise execution strategy for building the **AI News** tracker. It is derived from the architecture and project context requirements, breaking down the project into actionable, testable milestones.

---

## Phase 1: Foundation & Data Modeling

**Objective:** Set up the core framework, external services, and database schema.

1. **Repository Setup**
   - Initialize a Next.js App Router project with Tailwind CSS (`npx create-next-app@latest`).
   - Clean up default boilerplate and establish a component directory structure.

2. **Supabase Initialization**
   - Create a new project in Supabase.
   - Configure Row Level Security (RLS) policies for user data protection.
   - Set up the database schema defined in the architecture document:
     - `topics`, `articles`, `article_topics`, `user_follows`, `saved_articles`.

3. **Seeding Initial Data**
   - Insert the MVP topics into the `topics` table with their tuned boolean queries:
     - *Agents, Models/Research, Policy/Safety, Business/Funding, Tools/Products, Hardware/Chips*.

---

## Phase 2: Background Data Ingestion Engine

**Objective:** Build the automated pipeline that fetches, deduplicates, and stores articles.

1. **Ingestion Route (`/api/ingest`)**
   - Create a server-only API route in Next.js.
   - Implement logic to fetch active topics from the Supabase database.
   - Loop through topics and call the GNews API using their respective `query_terms`.

2. **De-duplication Logic**
   - Implement the hashing function: normalize article titles (lowercase, strip whitespace/punctuation) and generate a `content_hash`.
   - Write insertion logic that skips rows if `content_hash` or `url` already exists in the database.

3. **Cron Job Configuration**
   - Test the ingestion route manually.
   - Configure `vercel.json` to trigger `/api/ingest` on a schedule.
   - *Note on Rate Limits:* Due to GNews's ~100 req/day free limit, configure the cron job to run hourly or batch query execution to prevent limit breaches.

---

## Phase 3: Core User Interface

**Objective:** Build a read-only feed that surfaces the ingested data cleanly and quickly.

1. **The Global Feed**
   - Build the main dashboard component to fetch and display the latest articles directly from the `articles` Supabase table.
   - Ensure the query sorts by `published_at` descending.

2. **UI Components**
   - Develop reusable UI components: Article Cards, Topic Chips, and Recency Badges.
   - Implement topic filtering on the frontend (e.g., "Show me only Policy").

3. **Responsive Design & Empty States**
   - Ensure the layout is mobile-friendly.
   - Add empty states for when no articles match a filter or if ingestion hasn't run yet.
   - Add skeleton loaders for initial page load.

---

## Phase 4: Authentication & User Personalization

**Objective:** Enable users to log in, curate their feed, and save items.

1. **Authentication**
   - Integrate Supabase Auth using email magic links.
   - Build a simple Login/Signup UI page.
   - Protect personalized routes using Next.js middleware or server-side session checks.

2. **Topic Following**
   - Build the UI for users to browse and follow/unfollow topics.
   - Wire up mutations to the `user_follows` table.
   - Modify the main Feed query to filter articles based on the authenticated user's followed topics.

3. **Save for Later**
   - Add a "Save" button to Article Cards.
   - Wire up mutations to the `saved_articles` table (handling "saved" and "read" states).
   - Create a dedicated `/saved` page for users to view their bookmarked content.

---

## Phase 5: Polish, Testing & Deployment

**Objective:** Finalize the application for production release.

1. **Review & Refine**
   - Verify all Next.js server components are correctly reading from Supabase without client-side API exposure.
   - Double-check that GNews API keys are strictly stored as server-side environment variables.

2. **Vercel Deployment**
   - Deploy the repository to Vercel.
   - Add Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GNEWS_API_KEY`) to the Vercel project settings.

3. **End-to-End Validation**
   - Perform a full user flow test: signup -> follow topics -> view filtered feed -> save article.
   - Monitor the first automated Vercel Cron run in the production environment.
   - Evaluate feed quality and adjust GNews boolean queries if necessary to improve signal-to-noise ratio.

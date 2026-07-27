# Pulse AI News Tracker - Evaluation Report

## 1. Environment Note
**Live Deployment:** https://ai-newss-spd2.vercel.app/
The live Vercel deployment has **Vercel Deployment Protection** enabled (requiring Vercel login). Therefore, the evaluation was conducted locally (`http://localhost:3000`) where the application successfully connected to the Supabase backend and GNews API.

---

## 2. Feature Evaluation

### Core Feed & Reading Experience
- **Status: Functional**
- **Observations:**
  - The feed successfully loads and displays recent AI news articles.
  - Articles show appropriate metadata: Title, Publisher/Source (e.g., "NEWSBYTES"), relative publish time (e.g., "about 17 hours ago").
  - The UI is clean, scannable, and adheres to a premium dark-mode aesthetic.
- **Issues Found:**
  - **Broken Images:** Some articles in the feed (e.g., when filtering by "AI Agents") had broken images, falling back to raw alt-text. This happens because GNews image URLs sometimes expire or fail to load.

### Authentication
- **Status: Functional (with UX hiccups)**
- **Observations:**
  - The "Sign In" flow uses an Email/Password modal.
  - Successfully signing in updates the navigation bar, displaying a "Saved Articles" link and replacing "Sign In" with "Sign Out".
- **Issues Found:**
  - **Error Handling:** During the signup/signin flow, a misleading error message ("Could not authenticate user. Check your credentials.") temporarily appeared before successfully routing the user. The error message is rendered in a green box instead of standard error colors (red/orange).

### Topic Management
- **Status: Functional**
- **Observations:**
  - Topic chips (All Feed, AI Agents, Business & Funding, Hardware & Chips, Models & Research, Policy & Safety, Tools & Products) are clearly visible and function as filters.
  - Selecting a topic properly filters the feed.
  - A "Follow Topic" button dynamically appears when a specific topic is selected.

### Saving & Interacting
- **Status: Functional**
- **Observations:**
  - Articles display a clear "Save for later" bookmark icon.
  - A dedicated "Saved Articles" page is accessible from the top navigation (once logged in).

---

## 3. Areas for Improvement (Recommendations)

Based on the evaluation, here is what can be improved for the next iteration:

1. **Remove Vercel Deployment Protection:** If this is a portfolio piece meant for reviewers, disable Vercel Authentication in your project settings so the public URL is accessible.
2. **Graceful Image Fallbacks:** The GNews API frequently returns invalid or hotlink-protected image URLs. Implement an `onError` handler on the Next.js `<Image>` component to fall back to a default placeholder or hide the image container entirely when a load fails.
3. **Refine Auth UX:**
   - Fix the color of error messages in the Auth modal (currently green for an error).
   - Ensure the transition between "Create Account" and successful login is seamless without flashing false authentication errors.
4. **Deduplication Logic:** The system relies on exact title-hashes. In the news aggregation space, publishers often rewrite titles. Moving toward a lightweight embedding-based deduplication (or fuzzy string matching) would significantly reduce the redundancy in the feed.
5. **Rate Limit Resilience:** GNews has a strict 100 requests/day limit on free tiers. Ensure the Vercel Cron job ingestion frequency is tuned so it doesn't exhaust the quota, and handle API exhaustion gracefully (e.g., don't wipe the DB, just serve stale news).

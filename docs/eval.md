# Evaluation Plan for Pulse (AI News Tracker)

## 1. Authentication & Onboarding
- [ ] Users can sign up and log in (Magic Link or similar as per implementation).
- [ ] First-time users are prompted to follow topics.

## 2. Core Feed & Reading Experience
- [ ] The feed displays the latest AI articles sorted by publish time.
- [ ] Articles display relevant metadata (Title, Source, Date/Time, Image).
- [ ] Feed loads fast (reads from DB, not live API).
- [ ] No duplicated articles in the feed (checking for same/similar titles).

## 3. Topic Management
- [ ] Users can filter the feed by specific topics (e.g., Agents, Models, Policy).
- [ ] Users can follow/unfollow topics.
- [ ] The feed reflects the user's followed topics (if implemented as a personalized feed).

## 4. Saving & Interacting
- [ ] Users can save articles for later reading.
- [ ] Users can view their saved articles in a dedicated "Saved" view.
- [ ] (Optional) Users can mark articles as read.

## 5. UI / UX
- [ ] Clean, scannable feed interface.
- [ ] Responsive design (works well on desktop and mobile viewports).
- [ ] Clear topic chips and recency indicators.
- [ ] Proper empty states (e.g., when no articles are saved).
- [ ] Loading states when navigating or fetching data.

## 6. Technical / Architecture (External Observation)
- [ ] Client-side navigation is smooth (Next.js App Router).
- [ ] No exposed API keys in client requests (can be observed via network tab if needed).

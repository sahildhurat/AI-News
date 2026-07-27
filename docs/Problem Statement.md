# AI News

### Product brief & build plan for a full-stack PM portfolio project


**One-line pitch:** A focused, de-duplicated AI news tracker where a user follows the AI sub-topics they care about, and the product surfaces today's signal — not the firehose — with their own saved/read layer on top.

**Why this is a good portfolio piece:** It demonstrates the full-stack loop reviewers actually look for — pulling *live* third-party data, persisting a user's *own* data, and making a real product decision about curation. The whole thing is buildable in Cursor/Antigravity with one well-behaved API and a hosted database, no manual coding required.

---

## 1. The decision: which API, which stack

**Live source — GNews.io.**

The honest framing: there is no "AI news" API. Every option is a general news API, and the AI-ness comes from *your query*, not the source. GNews wins for this project because:

- It's **multi-source** (aggregates Google News), so a narrow AI-only feed actually fills up — a single-publisher API like The Guardian would feel thin for a dedicated AI tracker.
- It's a **plain API-key call** with just two endpoints (`search`, `top-headlines`) — exactly the friction level that survives vibe-coding.
- It **deploys cleanly**. NewsAPI.org has the better catalogue (80,000+ sources) but its free tier is localhost-only, which breaks the moment you deploy to Vercel. GNews has no such restriction.

*Add The Guardian (free, 500 req/day, full article content) as a clean secondary source in v2 if you want depth on top of breadth.*

**Stack (all generate well in Cursor):**

| Layer | Choice | Why |
|---|---|---|
| Frontend + backend | Next.js (App Router) | One framework, server + client, Cursor's strongest output |
| Database + auth | Supabase (Postgres) | Hosted free tier, auth built in, no infra to manage |
| Live data | GNews API, server-side only | Key stays in an env var, never hits the client |
| Ingestion | Vercel Cron | Free scheduled job; the architectural keystone (see §8) |
| Hosting | Vercel | One-click deploy, you've used it before |

---

## 2. Problem statement

> **Knowledge workers who need to stay current on AI are drowning in volume and duplication, not starved for sources.** The cost isn't missing news — it's the time and cognitive load of filtering an overwhelming, highly redundant stream down to what actually matters to *them*.

The problem is **not** "I can't find AI news." It's the opposite: too much, too repetitive, too undifferentiated by relevance. A good product here competes on *filtering and curation*, not on *access*.

---

## 3. Research & market context

The volume problem is quantifiable, not a vibe:

- AI research alone produced **over 242,000 publications in 2023** (Stanford HAI AI Index), arXiv now absorbs roughly **24,000 preprints a month**, and public directories track **47,000+ AI tools**. No human reads the raw firehose.
- In a 2,500-person survey of knowledge workers (Adaptavist, 2026), **nearly half reported struggling with the volume of AI-related information**, and **39% reported difficulty keeping up with developments**.
- Tech professionals named **keeping pace with AI-driven change their #1 concern going into 2026 (41%)** in ISACA's research — ahead of threat complexity and hiring.

The key insight that shapes the whole product:

- **The real problem is overlap, not volume.** Five AI newsletters mostly cover the same lead stories every day; curation *plus de-duplication* is what actually works. The advice that keeps surfacing: pick a few trusted sources, consolidate into one de-duplicated digest, read once.

**Competitive landscape:** The space is served today by curated newsletters (TLDR AI reaches 1.25M+ readers as the technical filter) and a handful of AI news aggregators. That validates demand — and tells you the winning wedge is *personalized de-duplication*, the thing newsletters can't do because they're one-size-fits-all.

**Implication for the build:** de-duplication and per-user topic relevance aren't nice-to-haves — they're the core value prop, and they're the most interview-worthy product decisions in the project.

---

## 4. Target users & jobs-to-be-done

**Primary — "The Staying-Sharp Professional."** A PM, founder, consultant, or engineer-adjacent knowledge worker who needs to sound informed about AI in their work but can't spend an hour a day reading. Wants signal, fast, on their specific sub-topics.

> *JTBD: "When I have 10 minutes in the morning, help me catch up on what actually matters in AI for my role, without making me wade through the same five rewritten stories."*

**Secondary — "The Focused Learner."** Someone going deeper on one slice (e.g. agents, AI policy, open models) who wants a clean topic-scoped feed and a way to save things for later.

> *JTBD: "When something looks important but I can't read it now, let me save it and come back, and don't lose track of what I've already seen."*

*(A note that plays to your background: you can frame yourself as a user here — a marketer-turned-PM who has to track AI relentlessly. First-hand insight is a legitimate research anchor, exactly as you used your own Rapido and Strava usage.)*

---

## 5. User needs → product requirements

| User need | What the product must do |
|---|---|
| "Don't show me the same story five times" | De-duplicate near-identical articles at ingestion |
| "Only the AI sub-topics I care about" | Followable topics, each backed by a tuned query |
| "I have 10 minutes" | Fast-loading, scannable feed; reads from our DB, not a slow live call |
| "Let me save things for later" | Save / mark-read state, persisted per user |
| "Show me what's actually fresh" | Sorted by publish time; clear recency signals |
| "High signal, low junk" | Deliberate query design (see §6), not a lazy `AI` keyword |

---

## 6. The one product decision that defines quality: query design

This is the section to highlight in interviews, because it's where PM judgment lives.

A lazy single keyword (`AI`) pulls in garbage — Allen Iverson, Adobe Illustrator, Air India. The topic has to be *defined deliberately*:

- Each followable topic maps to a curated boolean query, e.g. **Agents** → `"AI agents" OR "agentic" OR "autonomous agents"`.
- A global AI filter OR's together strong terms: `"artificial intelligence" OR "machine learning" OR "large language model" OR OpenAI OR Anthropic OR ...`.
- De-duplication is layered on top: hash a normalized title (or title + source-day) and reject collisions at ingestion.

"How do I define the AI topic so the feed stays high-signal?" is a genuine product problem you own — treat it as a feature, not plumbing.

---

## 7. Scope: MVP (v1) vs. later

**In scope for v1:**

- A set of ~6 predefined AI topics, each with a tuned query (Agents, Models/Research, Policy/Safety, Business/Funding, Tools/Products, Hardware/Chips).
- Background ingestion that pulls, de-duplicates, and stores articles.
- A clean feed view: latest AI articles, with topic chips and recency.
- Topic filtering (show me only "Policy").
- Auth + per-user **follow topics** and **save / mark-read**.
- A "Saved" view.

**Explicitly out of v1 (and that's a good thing to state — shows scoping discipline):**

- User-created custom topics / custom queries → v2.
- AI-generated summaries of each article (tempting, but adds an LLM call + cost + latency) → v2, and a natural "Claude-in-the-app" follow-up.
- Multi-source blending (add The Guardian) → v2.
- Email digest → v3.
- Sentiment / entity enrichment → later.

---

## 8. System architecture

**The keystone decision: don't call GNews on read.** Calling the live API on every page load would burn your rate limit, expose latency to users, and give you nowhere to de-duplicate. Instead:

```
                    ┌─────────────────────────────┐
   Vercel Cron ───► │  /api/ingest  (server only) │
   (every ~30 min)  │  1. query GNews per topic   │
                    │  2. normalize + hash titles │
                    │  3. dedupe vs. DB           │
                    │  4. insert new articles     │
                    └──────────────┬──────────────┘
                                   │ writes
                                   ▼
                          ┌─────────────────┐
                          │  Supabase (PG)  │  ◄── the product lives here
                          │  articles,      │
                          │  topics,        │
                          │  follows, saves │
                          └────────┬────────┘
                                   │ reads (fast)
                                   ▼
   User ──► Next.js app ──► server reads from DB ──► feed UI
            (Supabase Auth)      (no live API on the hot path)
```

Why this is the right call (and worth saying out loud in a portfolio): the live API becomes a **background data source**, while **your database is the actual product**. That gives you fast reads, a place to de-duplicate, resilience to API hiccups, and full control over ranking — and it's exactly the live-data-plus-persistence loop that signals real full-stack thinking.

**Auth:** Supabase email magic-link — avoids OAuth debugging entirely, keeps the build in no-code territory.

---

## 9. Data model

```
topics
  id            uuid pk
  slug          text unique        -- "agents", "policy"
  label         text               -- "AI Agents"
  query_terms   text               -- the tuned boolean query
  is_active     boolean

articles
  id            uuid pk
  source        text               -- publisher name
  title         text
  url           text unique
  description   text
  image_url     text
  published_at  timestamptz
  content_hash  text unique        -- normalized-title hash, for dedupe
  created_at    timestamptz

article_topics                     -- many-to-many: an article can hit >1 topic
  article_id    uuid fk
  topic_id      uuid fk

user_follows
  user_id       uuid fk (auth.users)
  topic_id      uuid fk
  created_at    timestamptz

saved_articles
  user_id       uuid fk (auth.users)
  article_id    uuid fk
  status        text               -- "saved" | "read"
  created_at    timestamptz
```

*Dedup logic: lowercase the title, strip punctuation/whitespace, hash it. If the hash exists, skip the insert. Simple, effective, and a clean thing to describe.*

---

## 10. Success metrics (north-star + tree)

Leaning into your metrics-first identity — the curated layer is the product, so the north star measures engagement with *curation*, not raw pageviews.

**North-star metric: Weekly Active Curators (WAC)** — users who, in a 7-day window, follow ≥1 topic **and** save or read ≥1 article. It captures the actual value loop: relevance in, action out.

**Metric tree:**

```
Weekly Active Curators
├── Activation: % of new signups who follow ≥1 topic in session 1
│     └── driven by: topic-selection onboarding quality
├── Engagement: saves+reads per active user / week
│     ├── feed relevance  (driven by query design + dedup)
│     └── feed freshness   (driven by ingestion frequency)
└── Retention: W1 → W2 returning curators
      └── driven by: "is there something new & relevant each visit?"
```

**Counter-metrics (good to name — shows maturity):** duplicate-article rate in the feed (should fall), and irrelevant-article complaints / hides (signal that query design is off).

---

## 11. Build sequence for Cursor

Prompt in this order — each step is independently testable, which keeps a vibe-coded build from spiraling:

1. **Scaffold:** "Create a Next.js (App Router) app with Tailwind, connected to Supabase. Set up the schema in §9 as a migration."
2. **Seed topics:** insert the 6 topics with their tuned `query_terms`.
3. **Ingestion route:** "Create a server-only route `/api/ingest` that, for each active topic, calls the GNews search endpoint with its query, normalizes and hashes titles, skips duplicates, and inserts new articles + their topic links." (Key in env var.)
4. **Test ingestion manually**, then **wire Vercel Cron** to hit it every 30 min.
5. **Feed UI:** server-rendered list reading from the DB, sorted by `published_at`, with topic chips and a topic filter.
6. **Auth:** Supabase magic-link login.
7. **Follows + saves:** follow/unfollow topics; save / mark-read; a "Saved" view.
8. **Polish:** empty states, loading states, recency badges; deploy to Vercel.

*One env-var safety note: the GNews key lives only in server-side env vars and is used only inside `/api/ingest` — it must never appear in client code.*

---

## 12. Risks & open questions

- **Free-tier rate limits.** GNews free is ~100 req/day. With 6 topics every 30 min you'd exceed that — so tune ingestion frequency (e.g. hourly, or batch topics) and let the cron cadence be a deliberate, documented trade-off.
- **Commercial-use terms.** Free news-API tiers often restrict commercial use; for a non-commercial portfolio demo this is fine, but verify GNews's current TOS and note it.
- **De-dup is fuzzy.** Title-hash catches exact/near-exact dupes, not paraphrased rewrites of the same story. Good enough for v1; a similarity/embedding approach is a strong v2 talking point.
- **Open question:** do you want v1 to ship with summaries (LLM call per article) or stay link-only? Link-only is the cleaner MVP; summaries are the obvious "Claude-in-the-app" sequel.

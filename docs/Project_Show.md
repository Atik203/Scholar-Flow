# ScholarFlow — Project Show Plan (10:00, Live Demo, English + বাংলা)

**Team Phantom Devs** · SE Lab Project Show · tomorrow · live demo from local servers.

- Total content budget: **10:00** (Q&A happens **outside** this window).
- One teammate presents the **introduction (0:00 – 1:30)** while Atikur already has the
  product on screen and slowly scrolls the Home page.
- Atikur drives the **live demo (1:30 – 9:30)**; the last 30 seconds are buffer.
- Every beat has **English** and **বাংলা** narration — speak either one live, or mix.
  Suggested mix: intro in বাংলা, demo in English, key punchlines repeated in বাংলা.

---

## 1. Roles & running order

| Role | Who | Responsibility |
| ---- | --- | -------------- |
| Intro speaker | *Pratay (suggested — swap as needed)* | 0:00 – 1:30: problem, product, team, features. Reads either language version below. |
| Demo operator | **Atikur** | 1:30 – 9:30: drives the whole live demo, all narration. |
| Realtime partner | *Salman (suggested)* | 5:45 – 6:40: types in the Emily window during the co-editing beat. |
| Timekeeper | *Sourov (suggested)* | Signals at 4:00 · 6:40 · 8:20 · 9:00 (tap table / quick chat message) so Atikur can trim. |

**Handoff line (intro speaker ends):**
> Now my teammate Atikur will show you ScholarFlow live.

> আর এখন আমার teammate Atikur আপনাদের ScholarFlow লাইভ দেখাবেন।

**Atikur picks up:**
> Thanks. I am Bob, a team lead. Quick map first: the sidebar holds everything — papers,
> collections, workspaces, Discover, research tools, team, admin. All demos live in these
> menus.

> ধন্যবাদ। আমি Bob, একজন team lead। প্রথমে একটা ম্যাপ — সাইডবারে পুরো প্ল্যাটফর্ম আছে:
> papers, collections, workspaces, Discover, research tools, team আর admin console।
> আজকের পুরো ডেমো এই মেনুগুলোর ভেতরেই।

---

## 2. Pre-show checklist (T-30 → T-0)

### T-30 — Start everything

1. From the repo root: **`yarn dev`** (starts all three in one command).
   - Frontend → `http://localhost:3000`
   - Backend → `http://localhost:5000` (check `http://localhost:5000/api/health`)
   - Socket server → `http://localhost:5001`
   - If it ever splits: `yarn dev:backend`, `yarn dev:frontend`, and
     `yarn workspace @scholar-flow/socket-server dev`.
2. Wait for the frontend ready line, then open the pages once so caches are warm.
3. **Stripe terminal** (only for the payments beat):
   `stripe listen --forward-to http://localhost:5000/webhooks/stripe`
   — it prints a `whsec_...` secret that changes on every restart; it must match
   `STRIPE_WEBHOOK_SECRET` in `apps/backend/.env`. Keep this terminal **off-screen all
   show** (it shows the secret).

### T-20 — Browser setup

| Window | Browser | Who | Tabs |
| ------ | ------- | --- | ---- |
| 1 | Chrome | Bob (main) | Home page (tab 1), Dashboard (tab 2), Pricing, GitHub repo |
| 2 | Edge or Chrome **incognito** | Emily | Dashboard (for the realtime beat) |
| 3 | Any browser | Admin | Admin overview, Payments, Audit (logged in as admin) |

- One account per browser profile — logging Emily into the same Chrome would kill Bob's
  session.
- Zoom **110%**, bookmarks bar hidden, DND/notifications off, all other apps closed.
- Desktop: the **demo PDF** ready to drag into the upload page (use one that is not yet in
  Bob's library, or any seeded PDF copy).
- Recorded fallback: keep the **13:01 demo video file** open in a media player tab,
  ready to play full-screen (see §9).

### T-10 — Verify the seeded data (2 minutes)

- Login as Bob → Papers shows **10 papers**; Collections shows the seeded collections;
  ML workspace has members and shared papers; the notification bell has unread items.
- Emily's account can open the shared draft (for co-editing).
- Admin account sees live metrics on the overview page.
- If anything is missing: `cd apps/backend` then
  `yarn ts-node --transpile-only prisma/seedDemoLibrary.js` (5–10 min — only if you have
  time; otherwise present what exists).

### T-0 — Final silence sweep

- Close email/chat apps, silence the phone, hotspot ready as backup internet.
- Selected tab = Home page, tab 1. Cursor parked mid-screen. Breathe.

---

## 3. Seeded accounts (password: `password123` for everyone)

| Role | Email | Password | Used for |
| ---- | ----- | -------- | -------- |
| Main demo — Bob, Team Lead | `teamlead@scholarflow.com` | `password123` | Entire demo (window 1) |
| Co-editor — Emily | `emily.carter@scholarflow.com` | `password123` | Realtime beat (window 2) |
| Administrator | `admin@scholarflow.com` | `password123` | Admin beat (window 3) |
| View-only — Michael | `michael.chen@scholarflow.com` | `password123` | Optional access-control answer |
| Extra accounts | `pro.researcher@scholarflow.com`, `researcher@scholarflow.com`, `sofia.rodriguez@scholarflow.com`, `david.okafor@scholarflow.com`, `aisha.khan@scholarflow.com`, `lucas.meyer@scholarflow.com` | `password123` | Backup / judge questions |

Login: `http://localhost:3000/login` → email + password → Sign in.
Live deployment (Plan C): `https://scholar-flow-ai.vercel.app` — same accounts.

---

## 4. Core features (intro member should name these; keep to ~6 lines)

1. **Smart paper upload** — AI extracts title, authors, abstract from the PDF; stored on AWS S3.
2. **AI reading** — summaries, key points, and question-answering grounded in the paper's own text (4 AI providers with automatic fallback).
3. **Semantic search** — pgvector meaning-based search plus global search across papers, collections, and notes with access control.
4. **Reading & annotation** — highlights, comments, research notes attached to the paper.
5. **Collections & sharing** — tags, grid/list, email invites with view/edit permissions.
6. **Discover** — trending papers, recommendations, and topic explorer from live scholarly sources.
7. **Team workspaces** — members, roles, shared library, activity log, invitations.
8. **Real-time co-editing** — Y.js + WebSocket; live cursors with names, no conflicts.
9. **Research writing** — rich-text editor, templates, 9 citation formats, PDF/DOCX export, citation graph, research map.
10. **Billing** — Stripe checkout, webhooks, customer portal; Free / Pro / Team plans.
11. **Admin console** — live CPU/memory/storage/DB metrics, users, payments, reports, audit log.
12. **Engineering** — 21 automated test suites / 59 tests, RBAC, rate limiting, deployed live.

**One-line proof for judges:** *everything on this list is implemented and running right now
— not a mockup.*

---

## 5. Timeline (10:00)

| # | Time | Beat | Screen | Who |
| - | ---- | ---- | ------ | --- |
| 1 | 0:00 – 1:30 | Introduction (problem → product → team → features) | Home page, slow scroll | Intro speaker |
| 2 | 1:30 – 1:50 | Handoff + sidebar map | Home → dashboard (Bob) | Atikur |
| 3 | 1:50 – 2:50 | Live upload → AI metadata → Publish | Papers — Upload | Atikur |
| 4 | 2:50 – 3:30 | Key Points + AI Summary + AI Insights question | Paper detail | Atikur |
| 5 | 3:30 – 4:00 | Semantic search + global search | Search pages | Atikur |
| 6 | 4:00 – 4:40 | Reading: highlight → note → comment → research notes | A paper | Atikur |
| 7 | 4:40 – 5:15 | Collections: grid/list → create → invite | Collections | Atikur |
| 8 | 5:15 – 5:45 | Discover: trending → recommendations → explore | Discover | Atikur |
| 9 | 5:45 – 6:40 | Workspace roles + **realtime co-editing** | Two windows side by side | Atikur + Emily |
| 10 | 6:40 – 7:35 | Editor: template → citation → export → citation graph → map | Research | Atikur |
| 11 | 7:35 – 8:20 | Stripe checkout (test card) → billing | Pricing → Stripe | Atikur |
| 12 | 8:20 – 9:00 | Admin quick tour: metrics → users → payments → audit | Admin | Atikur |
| 13 | 9:00 – 9:30 | Close | Dashboard | Atikur |
| – | 9:30 – 10:00 | Buffer (overruns, applause, setup for Q&A) | — | — |

**Trim order if running late:** shorten beat 10 (skip research map), beat 8 (skip Explore),
beat 4 (skip the Insight question), beat 7 (skip invite). **Never trim beat 9 (realtime).**

---

## 6. Introduction script (0:00 – 1:30)

**English (~1:25)** — speak slowly, pausing after each paragraph:

> Good morning everyone. We are Team Phantom Devs, and this is ScholarFlow — an AI-powered
> research collaboration platform.
>
> Every researcher knows the problem: papers in one app, notes in another, citations
> somewhere else — and no AI that actually knows your work. ScholarFlow brings the whole
> research workflow into one place.
>
> Upload a paper, and AI extracts the metadata, reads it, and writes the summary. Search by
> meaning, not just by words. Annotate, comment, and keep research notes. Write your own
> paper with AI assistance, insert citations in nine formats, and co-edit in real time with
> your team.
>
> And because research must be trusted, permissions, access control, and payment safety are
> engineered in from day one.
>
> Here is ScholarFlow in action. My teammate Atikur will drive the demo.

**বাংলা (~১:২৫)** — একই ছন্দে, অনুচ্ছেদ শেষে এক সেকেন্ড থামুন:

> শুভ সকাল সবাইকে। আমরা টিম ফ্যান্টম ডেভস, এবং এটি হলো ScholarFlow — একটি
> AI-পাওয়ারড রিসার্চ কোলাবরেশন প্ল্যাটফর্ম।
>
> প্রতিটি রিসার্চার এই সমস্যাটা চেনেন — পেপার থাকে এক অ্যাপে, নোট আরেকটায়, সাইটেশন অন্য
> কোথাও, আর আপনার কাজ সম্পর্কে AI কিছুই জানে না। ScholarFlow পুরো রিসার্চ ওয়ার্কফ্লোকে
> একটি জায়গায় নিয়ে আসে।
>
> পেপার আপলোড করুন — AI নিজেই মেটাডেটা বের করে, পুরো পেপার পড়ে সামারি বানায়। আপনি শব্দ
> নয়, অর্থ দিয়ে সার্চ করতে পারেন। অ্যানোটেশন, কমেন্ট, রিসার্চ নোট — সব একসাথে। নিজের
> পেপার লিখুন AI-এর সাহায্যে; নয়টি ফরম্যাটে সাইটেশন বসান; আর টিমের সাথে রিয়েল-টাইমে
> একসাথে লিখুন।
>
> আর রিসার্চে বিশ্বাসযোগ্যতা সবচেয়ে জরুরি — তাই permission, access control আর payment
> safety শুরু থেকেই ইঞ্জিনিয়ার করা।
>
> এবার ScholarFlow-এর লাইভ ডেমো। আমার teammate Atikur ডেমোটি দেখাবেন।

---

## 7. Demo script — beat by beat

**Delivery rules for every beat:**

- Move the cursor slowly; let each panel land before you speak again.
- Talk through loading — describe what is opening instead of going silent.
- Never name specific papers out loud ("this paper", "these two papers" always match the screen).
- Never open a terminal, `.env`, or the Stripe secret on the projector.

### Beat 2 — Handoff + sidebar map (1:30 – 1:50)

**Do:** switch to tab 2 (dashboard as Bob). Open each sidebar group so its section list is
visible — do not click into any page.

> Thanks. I am Bob, a team lead. Quick map first: the sidebar holds everything — papers,
> collections, workspaces, Discover, research tools, team, admin. All demos live in these
> menus.

> ধন্যবাদ। আমি Bob, একজন team lead। প্রথমে একটা ম্যাপ — সাইডবারে পুরো প্ল্যাটফর্ম আছে:
> papers, collections, workspaces, Discover, research tools, team আর admin console।
> আজকের পুরো ডেমো এই মেনুগুলোর ভেতরেই।

### Beat 3 — Live upload + AI metadata + publish (1:50 – 2:50)

**Do:** Papers → Upload. Drag the desktop PDF in. Let the metadata panel fill; point at
title/authors/abstract. Click Publish. Wait for the success state before moving.

> Let me start with the most common task: adding a new paper. This is the upload page, and
> the PDF is ready on my desktop. I drop it here — and watch: the metadata panel fills on
> its own. Title, authors, abstract — extracted by AI directly from the PDF. I click
> publish, and the paper joins my library in secure cloud storage. And the AI immediately
> starts reading it for me.

> সবচেয়ে কমন কাজ দিয়ে শুরু করি — নতুন পেপার যোগ করা। এটি আপলোড পেজ, PDF আমার ডেস্কটপে
> রেডি। এখানে ড্রপ করছি — খেয়াল করুন — metadata panel নিজে থেকেই ফিল-আপ হচ্ছে: title,
> authors, abstract — AI সরাসরি PDF থেকে বের করছে। পাবলিশ ক্লিক করলেই পেপার আমার
> লাইব্রেরিতে চলে গেল, secure cloud storage-এ। আর AI সাথে সাথেই পেপারটা পড়া শুরু করে দিল।

### Beat 4 — Key Points + AI Summary + AI Insights (2:50 – 3:30)

**Do:** open the paper. Show the Key Points card, then the AI Summary. Open AI Insights,
select a model, ask: **"What is this paper about?"** Let the answer stream for a few
seconds.

> And the AI has already read it. These are the Key Points — the main claims, one by one.
> Below, a summary of the findings, in the length and tone I choose. I can also ask the
> simplest question — what is this paper about? — and the answer streams back, grounded in
> this paper's own text, not the open internet.

> আর AI তো পেপারটা এর মধ্যেই পড়ে ফেলেছে। এগুলো হলো Key Points — মূল দাবিগুলো একে একে। নিচে
> সামারি — যেকোনো লেংথ আর টোনে। চাইলে সহজ প্রশ্নও করতে পারি — এই পেপারটা আসলে কী নিয়ে?
> উত্তরটা স্ট্রিম হয়ে আসে, শুধু এই পেপারের টেক্সট থেকে — ইন্টারনেট থেকে নয়।

### Beat 5 — Semantic + global search (3:30 – 4:00)

**Do:** run the semantic search ("Meaning Matches"), then the global search box. Keep the
query short.

> Search works two ways. Semantic search finds papers by meaning — even when the exact
> words are not in the title. And the global search box looks across papers, collections,
> and notes at once — always limited to what I am allowed to see.

> সার্চ কাজ করে দুইভাবে। Semantic search অর্থ দিয়ে পেপার খুঁজে বের করে — টাইটেলে শব্দগুলো
> না থাকলেও। আর global search একসাথে papers, collections আর notes-এ খোঁজে — শুধু আমার
> অনুমতি আছে এমন জিনিসে।

### Beat 6 — Reading: highlight, note, comment, research notes (4:00 – 4:40)

**Do:** open a paper. Text + PDF side by side. Highlight one sentence → add a note. Drop a
comment mark. Open the research-notes panel beside the paper.

> Back to a paper — extracted text and PDF preview sit side by side. I highlight a sentence
> and add a note. I can drop a comment mark, for a discussion with my team. And on the
> side, my own research notes stay linked to this paper. Everything I mark stays attached —
> for me and for my team.

> আবার পেপারে ফিরি — extracted text আর PDF preview পাশাপাশি। একটা লাইন হাইলাইট করে নোট যোগ
> করছি। টিমের সাথে আলোচনার জন্য comment mark-ও দিতে পারি। আর পাশে আমার research notes এই
> পেপারের সাথে লিংকড থাকে। যা-ই মার্ক করি, সেটা থেকে যায় — আমার আর আমার টিমের জন্য।

### Beat 7 — Collections: view, create, invite (4:40 – 5:15)

**Do:** Collections → toggle grid/list. Create one (name, description, visibility). Invite
a teammate and point at the invited email row.

> Papers live in collections. I can browse as a grid or a list. Creating one takes a name,
> a description, and a visibility rule — private, team, or public. And I can invite a
> teammate straight into it, with their permission — the invited email appears right here.

> পেপারগুলো collections-এ থাকে। Grid আবার list — যেভাবে সুবিধা। নতুন collection বানাতে লাগে
> একটা নাম, description আর visibility — private, team বা public। আর চাইলে teammate-কে
> সরাসরি ইনভাইট করা যায়, permission সহ — ইনভাইটেড ইমেইলটা এখানেই দেখা যায়।

### Beat 8 — Discover (5:15 – 5:45)

**Do:** open Discover. Trending → Recommendations → Explore. Hover, don't deep-click.

> When I need something new, Discover brings live research in — trending papers,
> recommendations based on my reading, and a topic explorer. All of it from live scholarly
> sources, not a static list.

> নতুন কিছু দরকার হলে Discover লাইভ রিসার্চ নিয়ে আসে — trending papers, আমার পড়ার ওপর
> ভিত্তি করে recommendations, আর topic explorer। সবটাই লাইভ scholarly সোর্স থেকে — কোনো
> স্ট্যাটিক লিস্ট নয়।

### Beat 9 — Workspace + realtime co-editing (5:45 – 6:40)

**Do:** Workspaces → ML workspace: point at members, roles, shared papers. Then bring the
Emily window beside Bob's. Emily types a sentence; it appears live. Move both cursors so
both name labels show. Stay silent for two seconds.

> That is the research side — now the team side. This is our ML workspace: members, their
> roles, and shared papers. Everyone sees exactly what their role allows. But the part I am
> most proud of is this. On the left is my screen; on the right, my teammate Emily, in
> another browser. Watch — when she types, the text appears on my screen instantly, no
> refresh, no conflicts. Her cursor carries her name, mine carries mine. Two people, one
> paper, at the same time — real-time co-editing, built into the workflow.

> এখন টিমের দিকটা। এটি আমাদের ML workspace — members, তাদের roles, আর শেয়ার করা papers।
> সবাই ঠিক যতটুকু অনুমতি আছে ততটুকুই দেখে। তবে আমার সবচেয়ে গর্বের অংশ হলো এটা। বাঁয়ে আমার
> স্ক্রিন, ডানে আমার teammate Emily — অন্য ব্রাউজারে। দেখুন — সে টাইপ করছে, আর টেক্সট সাথে
> সাথে আমার স্ক্রিনেও চলে আসছে — refresh ছাড়াই, কোনো conflict ছাড়াই। ওর কার্সরে ওর নাম,
> আমার কার্সরে আমার নাম। দুই জন, এক পেপার, একই সময়ে — real-time co-editing, সরাসরি
> ওয়ার্কফ্লোর ভেতরেই।

### Beat 10 — Editor + citation + export + graph + map (6:40 – 7:35)

**Do:** Research → New paper from the **IEEE** template. Type two lines. Show the save
indicator. Insert a citation. Export the PDF. Then open the Citation Graph (select two
linked papers so an arrow appears) and the Research Map.

> Now the writing side. I create a new paper from a template — this one is IEEE. The editor
> supports tables, images, and LaTeX math, and it saves automatically — watch the save
> indicator; I never pressed save. I insert a citation from my library, in the format I
> choose. One click exports a clean PDF. The Research module also maps the literature:
> every arrow in this citation graph is a real reference between two papers in my library,
> and the research map turns my tags into a topic cloud.

> এবার রাইটিং সাইড। একটা টেমপ্লেট থেকে নতুন পেপার খুলছি — এটি IEEE। এডিটরে টেবিল, ছবি,
> LaTeX math — সব সাপোর্টেড, আর অটো-সেভ হয় — save indicator দেখুন, আমি কখনো সেভ চাপিনি।
> লাইব্রেরি থেকে সাইটেশন বসাই, পছন্দের ফরম্যাটে। এক ক্লিকে পরিষ্কার PDF এক্সপোর্ট। Research
> মডিউল লিটারেচার ম্যাপও করে: এই citation graph-এর প্রতিটি তীর আমার লাইব্রেরির দুইটা
> পেপারের বাস্তব রেফারেন্স, আর research map আমার ট্যাগগুলোকে টপিক ক্লাউডে বদলে দেয়।

### Beat 11 — Stripe checkout + billing (7:35 – 8:20)

**Do:** Pricing → choose **Pro** → land on Stripe Checkout → test card
`4242 4242 4242 4242`, any future date, any CVC → pay → return to the billing page.

> Every module you saw is the product; payments keep it running. I upgrade to Pro — Stripe
> Checkout, hosted by Stripe, so no card data touches our servers. I use a test card, and
> it succeeds. The billing page shows my plan and invoices. And the admin console picks the
> payment up instantly, through webhooks — webhooks are the only source of truth for
> subscription status.

> যা দেখলেন সবই প্রোডাক্ট; পেমেন্ট সেটাকে চালু রাখে। আমি Pro-তে আপগ্রেড করছি — Stripe
> Checkout, Stripe-এর নিজের হোস্ট করা, তাই কোনো কার্ড ডেটা আমাদের সার্ভারে ছোঁয়ও না। টেস্ট
> কার্ড দিচ্ছি — সফল। Billing পেজে প্ল্যান আর ইনভয়েস। আর admin console webhook দিয়ে সাথে
> সাথে পেমেন্টটা ধরে ফেলে — subscription status-এর একমাত্র সত্য হলো webhook।

### Beat 12 — Admin quick tour (8:20 – 9:00)

**Do:** Admin overview — point at the live metrics (they refresh every 10s). Then Users,
then Payments, then Audit. Do not scroll endlessly.

> And behind the product is the operator view — the Admin console. Live system metrics:
> CPU, memory, storage, database — refreshing every ten seconds. Users and roles, plans and
> payments, reports, and the audit log. Everything an operator needs, on real data.

> আর প্রোডাক্টের পেছনে অপারেটর ভিউ — Admin console। লাইভ সিস্টেম মেট্রিক্স: CPU, memory,
> storage, database — প্রতি দশ সেকেন্ডে রিফ্রেশ হয়। ইউজার আর রোল, প্ল্যান আর পেমেন্ট,
> রিপোর্ট, আর অডিট লগ। অপারেটরের যা যা দরকার — সবই বাস্তব ডেটায়।

### Beat 13 — Close (9:00 – 9:30)

**Do:** return to the dashboard. Pause. Deliver the close.

> ScholarFlow — upload, understand, annotate, write, cite, and collaborate, all in one
> place. Built by Team Phantom Devs, tested with fifty-nine automated tests, and deployed
> live. Thank you for watching.

> ScholarFlow — আপলোড, বোঝা, অ্যানোটেট, লেখা, সাইটেশন আর কোলাবরেশন — সব এক জায়গায়। টিম
> ফ্যান্টম ডেভসের তৈরি, উনষাটটি অটোমেটেড টেস্টে যাচাই করা, আর লাইভ ডিপ্লয় করা। শোনার জন্য
> ধন্যবাদ।

---

## 8. Judges' Q&A prep (outside the 10 minutes)

| # | Question | English answer | বাংলা উত্তর |
| - | -------- | -------------- | ----------- |
| 1 | Tech stack? | Next.js 16 + React 19 + TypeScript; Node 22 + Express + Prisma + PostgreSQL (pgvector); AWS S3; Stripe; WebSocket (Y.js); deployed on Vercel + Render. | ফ্রন্টএন্ড Next.js 16, ব্যাকএন্ড Node 22 + Express + Prisma, ডেটাবেস PostgreSQL (pgvector), ফাইল AWS S3-এ, পেমেন্ট Stripe, রিয়েলটাইম WebSocket। |
| 2 | Which AI models? | Four providers with automatic fallback: OpenAI, Gemini, Claude, DeepSeek. Answers are grounded in the paper's own text with pgvector retrieval — not generic web answers. | চারটি AI প্রোভাইডার, অটো-ফলব্যাক সহ। উত্তর পেপারের নিজের টেক্সট থেকে আসে (RAG), ইন্টারনেট থেকে নয়। |
| 3 | How is data secured? | JWT auth, bcrypt, role-based access middleware, rate limiting, presigned S3 URLs, Stripe webhook signature verification, admin-only routes, access checks on every AI endpoint. | JWT + bcrypt, role-based access, rate limiting, S3-এ presigned URL, Stripe webhook signature যাচাই — প্রতিটি AI endpoint-এ access check। |
| 4 | What is real vs planned? | Everything in this demo is implemented and deployed: 140+ frontend pages, 30 backend modules, 21 test suites (59 tests). | এই ডেমোর সবকিছুই বাস্তবে তৈরি ও ডিপ্লয় করা — ১৪০+ পেজ, ৩০টি ব্যাকএন্ড মডিউল, ৫৯টি অটোমেটেড টেস্ট। |
| 5 | Business model? | Free tier for students; Pro and Team subscriptions through Stripe; institutional plans later. | শিক্ষার্থীদের জন্য ফ্রি; Pro আর Team সাবস্ক্রিপশন Stripe-এ; পরে ইনস্টিটিউশনাল প্ল্যান। |
| 6 | How does it scale? | Decoupled REST API, cloud PostgreSQL with connection pooling, S3 storage, cursor-based pagination, a 50 ms per-query budget, and an HNSW vector index. | ডিকাপলড REST API, ক্লাউড PostgreSQL, S3, cursor pagination, প্রতি কুয়েরিতে ৫০ms বাজেট, HNSW ভেক্টর ইনডেক্স। |
| 7 | What makes it different? | Paperpal does AI writing only; EndNote, Mendeley, Zotero manage references only. ScholarFlow is the one product that combines AI, reference management, and real-time collaboration. | Paperpal শুধু AI রাইটিং, EndNote/Mendeley/Zotero শুধু রেফারেন্স। ScholarFlow-ই একমাত্র প্ল্যাটফর্ম যেখানে AI, রেফারেন্স ম্যানেজমেন্ট আর রিয়েল-টাইম কোলাবরেশন একসাথে। |
| 8 | Is the demo data real? | Real PDFs, real AI extraction and embeddings, running on a live cloud database; accounts are seeded demo users, and payments use Stripe test mode. | সত্যিকারের PDF, সত্যিকারের extraction আর embedding, লাইভ ক্লাউড ডেটাবেসে; অ্যাকাউন্টগুলো ডেমো ইউজার, পেমেন্ট Stripe test mode-এ। |
| 9 | Who built what? | Team Phantom Devs — four members across frontend, backend, AI, and infrastructure; every contribution visible in the GitHub history. | টিম ফ্যান্টম ডেভস — চারজন মেম্বার; ফ্রন্টএন্ড, ব্যাকএন্ড, AI আর ইনফ্রা মিলিয়ে; প্রতিটা কাজ GitHub হিস্ট্রিতে আছে। |
| 10 | What would you add next? | Real-time comments per paragraph, institutional analytics, offline PDF reading, and a mobile app. | প্যারাগ্রাফ-ভিত্তিক রিয়েল-টাইম কমেন্ট, ইনস্টিটিউশনাল অ্যানালিটিক্স, অফলাইন রিডিং আর মোবাইল অ্যাপ। |

**If you do not know an answer:** *"That is a good question — we will follow up after the
session."* Never invent.

---

## 9. Fallback & recovery

| Failure | What to do |
| ------- | ---------- |
| A page loads slowly | Keep talking — describe what is opening. The timekeeper trims the next beat. |
| AI summary/Insight stalls | Skip the question, say "the summary is already cached here", move on. |
| Upload fails (S3/network) | Show a paper already in the library: "this paper was uploaded with the same flow". |
| Realtime does not sync | Do not debug. Say: "let me show the recorded proof" and play that segment from the 13:01 video. |
| Stripe checkout fails | Show the Billing page with the current plan; say testing mode is rate-limited today. Never show the terminal secret. |
| Frontend crashes / blank | Switch to the deployed site tab (`scholar-flow-ai.vercel.app`) — same accounts, same cloud data. |
| Internet dies completely | Local servers still work for most features (DB is cloud, so AI/search may pause) — switch to phone hotspot. |
| Worst case | Play the recorded 13:01 demo video full-screen and narrate its beats. The show is never lost. |

---

## 10. Number cheat sheet

| Item | Value |
| ---- | ----- |
| Citation formats | 9 (APA, MLA, IEEE, BibTeX, …) |
| Editor templates | 7 |
| AI providers with fallback | 4 (OpenAI, Gemini, Claude, DeepSeek) |
| Live discovery sources | OpenAlex + arXiv |
| Backend modules | 30 |
| Frontend pages | 140+ |
| Automated tests | 59 tests in 21 suites |
| Lint errors on release | 0 |
| Database query budget | 50 ms |
| Plans | Free, Pro, Team |
| Test card | 4242 4242 4242 4242 |
| Local URLs | `localhost:3000` · `localhost:5000/api/health` · `localhost:5001` |
| Live URLs | `scholar-flow-ai.vercel.app` · `scholar-flow-api.vercel.app` |
| Repository | github.com/Atik203/Scholar-Flow |

Pause for one second after every number.

---

## 11. Rehearsal plan (tonight)

1. **Run 1 — full timed run (20 min):** intro speaker + Atikur together, from T-30
   checklist to close, with Emily typing live. Note the clock at each beat.
2. **Run 2 — trim pass (10 min):** repeat with the timekeeper calling 4:00 / 6:40 / 8:20 /
   9:00. Practice the trim order from §5.
3. Verify these click paths once each (they are the risky ones):
   upload → publish → Key Points → AI Insights question;
   realtime sync with Emily; Stripe checkout with `stripe listen` running; admin overview.
4. Preload/warm: open every beat's page once so first-load slow states happen tonight, not
   on stage.
5. Print this file's §5 (timeline) + §10 (numbers) for the table; keep the phone timer
   visible only to the timekeeper.
6. Sleep. Rehearse only the handoff line tomorrow morning — everything else is muscle
   memory by then.

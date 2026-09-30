# ScholarFlow — Demo Video Script (12:15, Solo Narration)

Total time: **12:35**. Introduction: **1:35** (to 1:40 with the app switch) · Recorded so
far: **to 5:40** (Papers + Collections + Discover) · Remaining: **5:40 → 12:35**.

Written for a slow, careful speaker at **1.73 words per second** (about **104 words per
minute**) — the measured pace from the HaluRISC recording pass. All timings below come
from that rate, so they hold without rushing.

Every sentence connects to the next, and each section ends on a line that sets up the
following section. Read it as continuous speech, not as separate blocks.

**Camera is off.** This is a voice-over + screen recording. The screen carries every
visual, so slow, deliberate cursor movement matters more than ever — and the narration
should sound warm and energetic to compensate for the missing face.

**Talk through the loads.** When a page or panel is loading, keep speaking — the plan
leaves only about a minute of total silence, and that time belongs mostly to the realtime
beat.

**Structure: the core demo follows the sidebar modules** — Papers → Collections →
Discover → Workspace → Research → Payments → Admin — so each feature group plays as one
continuous segment.

**Recorded (rows 5–14, ends 5:40):** Upload + metadata · Key Points + AI Summary · AI
Insights · AI tools · Papers list + tag filter · Vector + global search · Collections
view/grid-list/create/invite · Discover. The next recording starts at **5:40** with
**Papers — reading + annotations** (row 15).

---

## 1. Before you record

### Accounts (password: `password123` for all)

| Role | Account | Password | Used for |
| ---- | ------- | -------- | -------- |
| Main presenter | `teamlead@scholarflow.com` (Bob) | `password123` | Entire core demo |
| Co-editor | `emily.carter@scholarflow.com` (Emily) | `password123` | Realtime scene (second browser) |
| View-only colleague | `michael.chen@scholarflow.com` (Michael) | `password123` | Access-control test (403) |
| Administrator | `admin@scholarflow.com` | `password123` | Admin console tour (metrics, reports, audit) |

Other demo accounts (same password `password123`): `pro.researcher@scholarflow.com`,
`researcher@scholarflow.com`, `sofia.rodriguez@scholarflow.com`,
`david.okafor@scholarflow.com`, `aisha.khan@scholarflow.com`, `lucas.meyer@scholarflow.com`.

### Data to prepare

> **The demo library is already seeded.** Run from `apps/backend`:
> `yarn ts-node --transpile-only prisma/seedDemoLibrary.js`
> (flags: `--cleanup`, `--cleanup-e2e`, `--skip-extraction`, `--extract-only`, `--limit=N`).
> It uploads the 10 curated PDFs to S3, runs real extraction + embeddings, and builds
> workspaces, collections, citations, annotations, notes, discussions and notifications
> for every demo role (Bob 10 papers · pro 6 · emily 5 · michael 4 · researcher 3 ·
> admin 3 · sofia/david/aisha/lucas 2 each).

- **Published papers with pre-warmed AI summaries** (the demo papers are already
  generated) so the demo doesn't wait on first-time processing.
- **One draft paper** with no public link (for the 404 test) — seeded as
  "Thesis Draft — Multi-Agent Security Survey".
- **One paper shared with Michael as view-only** (for the 403 test).
- **A pending invite ready to send** in the Workspace module (for the notification beat).
- **Cached citations between papers** — the citation graph draws edges only when two
  linked papers are selected.
- **Stripe test mode** ready. Test card: `4242 4242 4242 4242`, any future date, any CVC.
  Start `stripe listen --forward-to http://localhost:5000/webhooks/stripe` **before**
  recording (it prints a secret once — never show that terminal during the video).

### Screens and terminals to open before recording

1. Home page open in the first tab at 110% zoom; bookmarks bar hidden, notifications off
   (Do Not Disturb on). The logged-in dashboard open in the next tab.
2. Terminal A — repo root, for the automated tests and gates (`yarn test`,
   `yarn type-check`, `yarn lint`). Run `yarn test` once before recording so the
   on-camera run stays fast.
3. Terminal B — backend log (`yarn dev:backend` output), for the slow-query check.
4. Terminal C — `stripe listen` output, for the webhook replay.
5. Browser window 1 — Bob (main). Window 2 — Emily (realtime). Tab — Michael
   (view-only), plus the admin console (overview + payments + reports + audit).
6. A second monitor or a side-by-side layout for the realtime beat — both windows visible.
7. Recorder: screen-only capture at 1920×1080, **webcam off**, microphone on — all
   narration is voice-over.

Tip: never open `.env` files on screen. Keep every terminal scrolled to a clean spot.

---

## 2. Timing plan (running clock)

| # | Segment | Window |
| - | ------- | ------ |
| 1 | Intro — hook (Home page) | 0:00 – 0:20 |
| 2 | Intro — what it is | 0:20 – 0:45 |
| 3 | Intro — built to be trusted | 0:45 – 1:25 |
| 4 | Intro — setup line | 1:25 – 1:35 |
| — | *transition to the app* | 1:35 – 1:40 |
| 5 | **Papers** 1 — upload + metadata ✅ | 1:40 – 2:05 |
| 6 | **Papers** 2 — Key Points + AI Summary ✅ | 2:05 – 2:30 |
| — | *pause* | 2:30 – 2:35 |
| 7 | **Papers** 3 — AI Insights (model + question) ✅ | 2:35 – 2:50 |
| 8 | **Papers** 4 — AI tools: rewrite, compare, literature review ✅ | 2:50 – 3:31 |
| 9 | **Papers** 5 — all papers + tag filter ✅ | 3:31 – 3:45 |
| 10 | **Papers** 6 — vector search + global search ✅ | 3:45 – 4:15 |
| — | *transition* | 4:15 – 4:25 |
| 11 | **Collections** 1 — view collections (grid/list) ✅ | 4:25 – 4:40 |
| — | *pause* | 4:40 – 4:45 |
| 12 | **Collections** 2 — create collection ✅ | 4:45 – 5:00 |
| 13 | **Collections** 3 — invite user + invited email ✅ | 5:00 – 5:15 |
| 14 | **Discover** — trending, recommendations, explore ✅ | 5:15 – 5:40 |
| 15 | **Papers** 7 — reading, annotations, comments, notes | 5:40 – 6:20 |
| 16 | **Workspace** 1 — members and roles | 6:20 – 6:45 |
| 17 | **Workspace** 2 — invite + live notification | 6:45 – 7:15 |
| 18 | **Research** 1 — editor: template, citation, export | 7:15 – 8:05 |
| 19 | **Research** 2 — realtime co-editing (two windows) | 8:05 – 9:00 |
| 20 | **Research** 3 — citation graph + research map | 9:00 – 9:35 |
| 21 | **Payments** — Stripe checkout + billing | 9:35 – 10:15 |
| 22 | **Admin** — console tour | 10:15 – 10:35 |
| 23 | Testing 0 — transition | 10:35 – 10:40 |
| 24 | Testing 1 — automated tests (Jest + Supertest) | 10:40 – 11:20 |
| 25 | Testing 2 — access control (403) | 11:20 – 11:35 |
| 26 | Testing 3 — payment safety (replay) | 11:35 – 11:50 |
| 27 | GitHub — repository tour | 11:50 – 12:25 |
| 28 | Close | 12:25 – 12:35 |

Spoken words total ≈ **1,065**. At 1.73 words/second that is about **10:15 of speech**;
the rest is clicks, loads, and the transitions marked in the table (the recorded section
and the 40-second reading beat have their own pacing). Keep talking while panels load,
and the remaining takes will match their windows.

---

## 3. Cue cards — what to do, in this order

*(Quick operational reference for recording. Rows 1–14 are recorded; the next take
starts at row 15, 5:40.)*

| # | At | On screen | Do this | Start saying |
| - | -- | --------- | ------- | ------------ |
| 1 | 0:00 | Home page (tab 1) | Slow scroll through the hero | "Every researcher knows this feeling…" |
| 2 | 0:20 | Home page | Keep scrolling the feature sections | "Our team is Phantom Devs…" |
| 3 | 0:45 | Home page | End the scroll on pricing/features | "And ScholarFlow is more than a paper library…" |
| 4 | 1:25 | Dashboard (tab 2, Bob) | Switch to the app tab | "I am logged in as Bob…" |
| 5 | 1:40 | **Papers** — Upload page | Drag the PDF in → metadata → Publish | ✅ recorded |
| 6 | 2:05 | **Papers** — paper detail | Show Key Points → generate/show AI Summary | ✅ recorded |
| 7 | 2:35 | **Papers** — AI Insights | Select the model → ask "what is this paper about?" | ✅ recorded |
| 8 | 2:50 | **Papers** — AI tools | Show Rewrite → Comparator → Literature Review on two papers | ✅ recorded |
| 9 | 3:31 | **Papers** — list page | Switch the tag tabs to filter | ✅ recorded |
| 10 | 3:45 | Search | Semantic search, then the global search box | ✅ recorded |
| 11 | 4:25 | **Collections** — list | Open Collections → toggle grid / list | ✅ recorded |
| 12 | 4:45 | **Collections** — create | Create a collection (name, description, visibility) | ✅ recorded |
| 13 | 5:00 | **Collections** — invite | Invite a user → show the invited email row | ✅ recorded |
| 14 | 5:15 | **Discover** | Trending → Recommendations → Explore | ✅ recorded |
| 15 | 5:40 | **Papers** — a paper | Highlight a sentence → add a note → drop a comment → open the research notes | "Back to a paper — the extracted text and PDF sit side by side…" |
| 16 | 6:20 | **Workspace** — workspaces | Open the ML workspace → members + roles | "That is the research side — now the Workspace module…" |
| 17 | 6:45 | **Workspace** — Team → bell | Send the prepared invite (**Editor** role) → open the bell | "I invite a new member…" |
| 18 | 7:15 | **Research** — Editor | New paper from the **IEEE** template → type two lines → insert a citation → Export PDF | "Now the Research module — this is where the writing happens." |
| 19 | 8:05 | **Research** — two browser windows | Emily types → move both cursors so names show → stay silent for two seconds | "A paper is rarely written alone…" |
| 20 | 9:00 | **Research** — Citation Graph → Research Map | Select two linked papers (edge appears) → open the map | "The Research module also maps the literature…" |
| 21 | 9:35 | **Payments** — Pricing → Stripe Checkout | Choose **Pro** → card `4242 4242 4242 4242` → return to Billing | "Every module you saw is the product; payments keep it running." |
| 22 | 10:15 | **Admin** — admin tab | Metrics → Reports → Audit Log → Settings (quick) | "And behind the product is the operator view…" |
| 23 | 10:35 | Testing — Terminal A | Run `yarn test` and keep talking over it | "That is the product…" |
| 24 | 11:20 | Testing — Michael's window | Open the view-only paper → try to edit → show the 403 | "Next, one live security check…" |
| 25 | 11:35 | Testing — Terminal C (`stripe listen`) | Replay the same event twice | "And money deserves the same care…" |
| 26 | 11:50 | GitHub (browser) | README → Insights → Contributors → Releases → live link | "Before we finish…" |
| 27 | 12:25 | Dashboard | Return to the dashboard, pause, deliver the close | "That is ScholarFlow…" |

**Rules while recording:** keep the cursor slow; one numbered row at a time; keep
talking while anything loads; if a step fails, move on to the next row — do not restart
the whole take. **Next take starts at row 15 (5:40).**

---

## 4. Introduction (0:00 – 1:35)

**Purpose: this is the first thing faculty see. Hook first, explain second, build trust third.**

### [0:00 – 0:20] Hook — open on the ScholarFlow Home page

*(The real Home page is on screen from frame one — no montage, no cuts. Scroll slowly
through the hero section while speaking, calm and deliberate.)*

> Every researcher knows this feeling.
> Papers live in one app. Notes in another. Citations somewhere else.
> And the AI knows nothing about your actual work.
> This is the problem ScholarFlow solves.

### [0:20 – 0:45] What it is — Home page feature sections

*(Keep a slow scroll through the Home page sections. Add one small caption overlay:
**ScholarFlow — AI-Powered Research Collaboration · Team Phantom Devs**. Pause for one
second before and after the claim line — it is the promise of the video.)*

> Our team is Phantom Devs, and ScholarFlow is one place for the full research workflow.
> Upload a paper, understand it with AI, annotate it, write with it, cite it,
> and collaborate on it in real time.
> No existing tool combines all of these. ScholarFlow is the first.

### [0:45 – 1:25] Built to be trusted — finish the Home page scroll

*(End the scroll on the pricing/features area of the Home page.)*

> And ScholarFlow is more than a paper library.
> It is the reading tool, the writing tool, the citation manager, the AI assistant,
> and the shared workspace — working together in one product.
> And because research must be trusted, correctness, permissions, and payment safety
> are engineered in from the start.

### [1:25 – 1:35] Setup line — switch to the app

*(Switch to the logged-in dashboard as Bob.)*

> I am logged in as Bob, a team lead.
> My library already has papers, and my team is active.
> Let me start with the most common task — adding a new paper.

---

## 5. Core Features Demo (1:40 – 10:35)

*Organized by sidebar module: Papers → Collections → Discover → Workspace → Research →
Payments → Admin. Never name specific papers in the narration — always say "this paper"
or "two papers", so the words match whatever is on screen.*

### Papers — 1. Upload + metadata [1:40 – 2:05] ✅ recorded

> This is the upload page, and the paper is ready on my desktop.
> I drop it here — the metadata panel fills on its own: title, authors, abstract,
> extracted by AI from the PDF.
> I click publish, and the paper joins my library, in secure cloud storage.

### Papers — 2. Key Points + AI Summary [2:05 – 2:30] ✅ recorded

**[Action:** in the paper, open the Key Points card, then the AI summary.**]**

> And the AI has already read it for me.
> These are the key points — the main claims, one by one.
> And below, a summary of the findings, in the length and tone I chose.

### Papers — 3. AI Insights [2:35 – 2:50] ✅ recorded

**[Action:** open AI Insights, select the model, ask **"what is this paper about?"** and
let the answer stream.**]**

> I can also switch the model and ask the simplest question: what is this paper about?
> The answer is grounded in this paper's own text — not in the open internet.

### Papers — 4. AI tools [2:50 – 3:31] ✅ recorded

**[Action:** show Rewrite on a paragraph, then the Comparator with two papers, then the
Literature Review over both.**]**

> The AI also works on my drafts.
> I can rewrite a paragraph to improve clarity.
> I can compare two papers side by side, to see where they agree and where they differ.
> Or I can generate a literature review from both together — a first draft of the
> related-work section, in seconds.

### Papers — 5. All papers + tag filter [3:31 – 3:45] ✅ recorded

**[Action:** open the papers list and switch the tag tabs to filter.**]**

> Back in the library, the tag tabs filter everything instantly — one click, and I see
> only the papers on that topic.

### Papers — 6. Vector search + global search [3:45 – 4:15] ✅ recorded

**[Action:** run the semantic search, then use the global search box.**]**

> And search works two ways.
> Semantic search finds papers by meaning — even when the exact words are not in the
> title.
> And the global search box looks across papers, collections, and notes at once — always
> limited to what I am allowed to see.

### Collections — 1. View (grid and list) [4:25 – 4:40] ✅ recorded

**[Action:** open Collections and toggle grid / list.**]**

> Papers live in collections.
> I can browse them as a grid or as a list — whichever is faster for the moment.

### Collections — 2. Create [4:45 – 5:00] ✅ recorded

**[Action:** create a collection: name, description, visibility.**]**

> Creating one takes a name, a description, and a visibility rule — private, team, or
> public — and it is ready.

### Collections — 3. Invite a user [5:00 – 5:15] ✅ recorded

**[Action:** invite a teammate into the collection with a permission, and show the
invited email row.**]**

> I can invite a teammate straight into the collection and set their permission — and
> the invited email appears right here.

### Discover — live research feeds [5:15 – 5:40] ✅ recorded

**[Action:** open Discover; show Trending, then Recommendations, then Explore.**]**

> And when I need something new, Discover brings live research in: trending papers,
> recommendations based on my reading, and a topic explorer — all from live scholarly
> sources.

### Papers — 7. Reading, annotations, comments and notes [5:40 – 6:20] ⏺ next

**[Action:** open a paper. Wait for the text view; highlight one sentence and add a note,
drop a comment mark, then open the research notes beside the paper.**]**

> Back to a paper — the extracted text and the PDF preview sit side by side.
> I highlight a sentence and add a note. I can also drop a comment mark, for a
> discussion with my team.
> And on the side, I keep my own research notes, linked to this paper.
> Everything I mark stays attached — for me, and for my team.

### Workspace — 1. Members and roles [6:20 – 6:45] ⏺ next

**[Action:** open Workspaces, then the ML workspace — show the members with their roles
and the shared papers.**]**

> That is the research side — now the Workspace module, where the team lives.
> This is our ML workspace: its members, their roles, and the papers we share.
> Everyone sees exactly what their role allows.

### Workspace — 2. Invite + live notification [6:45 – 7:15] ⏺ next

**[Action:** open Team, send the prepared invite with the Editor role. Switch to the
notification bell; the new notification arrives on its own.**]**

> I invite a new member and choose a role — Viewer, Editor, or Manager.
> The moment I send it, the notification arrives in the bell, in real time.
> Invitations, role changes, and removals all flow through the same live channel.

### Research — 1. Editor: template, citation, export [7:15 – 8:05] ⏺ next

**[Action:** create a new paper from the IEEE template. Type two lines. Show the save
indicator. Insert a citation from the library. Open the export dialog and show the PDF
download completing.**]**

> Now the Research module — this is where the writing happens.
> I create a new paper from a template; this one is IEEE.
> The editor supports tables, images, and LaTeX math, and it saves automatically — watch
> the save indicator; I never pressed save.
> I insert a citation from my library, in the format I choose — one of nine formats,
> including APA, IEEE, and BibTeX.
> And one click exports a clean PDF.

### Research — 2. Real-time co-editing [8:05 – 9:00] ⏺ next

**[Action:** show both windows side by side. Emily types; the text appears on Bob's screen.
Move both cursors so both name labels are visible. Keep silent for two seconds after her
text lands.**]**

> A paper is rarely written alone — so let me show you the part I am most proud of.
> On the left is my screen. On the right, my teammate Emily, in another browser.
> Watch: when she types, the text appears on my screen instantly — no refresh, no
> conflicts.
> Her cursor carries her name; mine carries mine, so we always know who is where.
> Two people, one paper, at the same time — real-time co-editing, built into the
> research workflow.

### Research — 3. Citation graph + research map [9:00 – 9:35] ⏺ next

**[Action:** open the Citation Graph and select two linked papers so the arrow between
them appears. Then open the Research Map and hover two topic bubbles.**]**

> The Research module also maps the literature.
> This is the citation graph: every arrow is a real reference between two papers in my
> library.
> And the research map turns my tags into a topic cloud, so I can see where the
> literature is dense.

### Payments — Stripe checkout + billing [9:35 – 10:15] ⏺ next

**[Action:** open Pricing, choose Pro, land on Stripe Checkout, pay with the test card.
Return to the Billing page.**]**

> Every module you saw is the product; payments keep it running.
> I upgrade to Pro — Stripe Checkout, hosted by Stripe, so no card data touches our
> servers.
> I use a test card, and it succeeds; the billing page shows my plan and invoices.
> And the admin console picks the payment up instantly, through webhooks.

### Admin — Console tour [10:15 – 10:35] ⏺ next

**[Action:** switch to the admin tab. Show the overview metrics (CPU, memory, storage,
database), then open Reports, the Audit Log, and Settings quickly.**]**

> And behind the product is the operator view: live system metrics, reports, the audit
> log, and platform settings.
> Everything an admin needs, on real data.

---

## 6. Testing Demo (10:35 – 11:50)

**Purpose: the automated test suite is the main part — billing, payments, papers,
validation, and access control are all covered by Jest (unit + integration) and
Supertest (API end-to-end). Access control and payment safety are quick live checks.**

### [10:35 – 10:40] Transition — Why testing matters

**[Action:** open the tests terminal.**]**

> That is the product. But how do we know it works? We test it.

### [10:40 – 11:20] Testing 1 — Automated tests (Jest + Supertest)

**[Action:** show the test files (backend `src/__tests__`, frontend `src/__tests__`), then
run `yarn test` and let the green summary land before speaking again.**]**

> We test it in two ways. These are the automated tests — Jest for unit and
> integration, Supertest for API end-to-end.
> They already cover billing, payments, papers, validation, and access control.
> Watch the suite run — twenty-one suites, fifty-nine tests, all passing.

### [11:20 – 11:35] Testing 2 — Access control

**[Action:** as Michael, open the view-only paper and attempt an edit — show the
refusal.**]**

> Next, one live security check: a view-only colleague tries to edit — the server
> refuses. Four oh three.

### [11:35 – 11:50] Testing 3 — Payment safety

**[Action:** in the `stripe listen` terminal, replay the same event twice; show the
subscription changing only once.**]**

> And money deserves the same care: for payments, webhooks are the source of truth.
> I replay the same event twice — the subscription changes only once.

---

## 7. GitHub & Engineering Practice (11:50 – 12:35)

**Purpose: show the process behind the product — sprint workflow, every team member's
contribution, proper versioned releases, and the live deployment.**

### [11:50 – 12:25] The repository tour

**[Action:** switch to the browser and open the GitHub repository. Scroll the README
slowly, then open **Insights → Contributors**, then **Releases**, then the live
deployment link. Move the cursor slowly; let each page land before speaking.**]**

> Before we finish, one last look — our GitHub — because the process matters too.
> Sprint-based development, contributions from every member, and every version
> released properly.
> Every feature was reviewed before it merged — the pull requests and the history are
> all here.
> And the product is deployed live.

### [12:25 – 12:35] Close

**[Action:** return to the dashboard and let it sit on screen.**]**

> That is ScholarFlow — built by a team and released step by step. Thank you for
> watching.

---

## 8. Number cheat sheet

| Item | Value |
| ---- | ----- |
| Citation formats | 9 |
| Editor templates | 7 |
| AI providers with fallback | 4 (OpenAI, Gemini, Claude, DeepSeek) |
| Live discovery sources | OpenAlex + arXiv |
| Backend modules | 30 |
| Frontend pages | 140+ |
| Automated tests | 59 tests in 21 suites (Jest + Supertest) |
| Lint errors on release | 0 |
| Database query budget | 50 ms |
| API availability target | 99.9% |
| Plans | Free, Pro, Team (+ Enterprise) |
| Test card | 4242 4242 4242 4242 |

Pause for one full second after every number.

---

## 9. If you fall behind

- Drop the last sentence of: Papers 2, Papers 4, Workspace 2, Testing 3 (payment
  safety). **Never shorten Research 2 (realtime).**
- Never speed up; keep the 1.73 words/second pace. A calm pause reads as confidence.
- If a panel loads slowly, keep speaking — describe what is loading. The only planned
  silence is the realtime beat, where the sync speaks for itself.

## 10. Delivery tips

- Camera is off, so the screen is the only visual: move the cursor slowly and
  deliberately, and let every panel land before you speak.
- Never name a paper in the narration — "this paper" and "two papers" always match the
  screen, whichever papers you click.
- In editing, add short on-screen captions for the three key numbers
  (9 citation formats · 59 automated tests · 0 lint errors) so they are unmissable.
- In the automated-tests beat, keep talking while the suite runs, then let the green
  summary land as your closing line.
- In the realtime beat, say nothing while Emily's text appears — let the audience see it.
- The unrecorded beats (rows 15–22: reading, Workspace, Research, Payments, Admin) start
  with a one-line module intro — say it as you open the first screen of the module.
- In the GitHub beat, scroll slowly: README, then contributors, then releases, then the
  live deployment — one page per sentence.
- Keep Zoom at 110% so every label is readable.
- The intro is the real Home page — rehearse one slow scroll pass so the sections line up
  with your three sentences. There is no montage to cut.
- Rehearse only the transitions; they are what make the video feel connected:
  - Into core: *"Let me start with the most common task: adding a new paper."*
  - Into realtime: *"A paper is rarely written alone…"*
  - Into testing: *"That is the product. But how do we know it works?"*
  - Into close: *"That is ScholarFlow…"*

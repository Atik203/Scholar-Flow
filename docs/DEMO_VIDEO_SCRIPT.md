# ScholarFlow — Demo Video Script (12:15, Solo Narration)

Total time: **12:15**. Introduction: **1:40** · Core features demo: **8:45** · Testing demo: **1:15** · GitHub & close: **0:35**.

Written for a slow, careful speaker at **1.73 words per second** (about **104 words per
minute**) — the measured pace from the HaluRISC recording pass. All timings below come from
that rate, so they hold without rushing.

Every sentence connects to the next, and each section ends on a line that sets up the
following section. Read it as continuous speech, not as separate blocks.

**Camera is off.** This is a voice-over + screen recording. The screen carries every
visual, so slow, deliberate cursor movement matters more than ever — and the narration
should sound warm and energetic to compensate for the missing face.

**Talk through the loads.** When a page or panel is loading, keep speaking — the plan
leaves only about a minute and a half of total silence, and that time belongs mostly to
the realtime beat.

**Structure: the core demo follows the sidebar modules** — Papers → Collections →
Discover → Workspace → Research → Payments → Admin — so each feature group plays as one
continuous segment.

**Recorded so far:** Papers 1–2 (upload, library), Collections 1 (organize), Discover
(import + feeds) — rows 5, 6, 10, 12 of the cue cards. If your upload recording already
shows Key Insights + AI Summary, keep it: rows 7–9 do not repeat those, they move straight
to reading, questions, and comparison.

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

- **Published papers with pre-warmed AI summaries** (ASB + InjecAgent are already
  generated) so the demo doesn't wait on first-time processing.
- **One draft paper** with no public link (for the 404 test) — seeded as
  "Thesis Draft — Multi-Agent Security Survey".
- **One paper shared with Michael as view-only** (for the 403 test).
- **A pending invite ready to send** in the Workspace module (for the notification beat).
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

| # | Segment | Time | Running |
| - | ------- | ---- | ------- |
| 1 | Intro — hook (Home page) | 0:20 | 0:20 |
| 2 | Intro — what it is | 0:25 | 0:45 |
| 3 | Intro — built to be trusted | 0:40 | 1:25 |
| 4 | Intro — setup line | 0:15 | 1:40 |
| 5 | **Papers** 1 — upload + AI metadata | 0:50 | 2:30 |
| 6 | **Papers** 2 — library + semantic search | 0:40 | 3:10 |
| 7 | **Papers** 3 — reading + annotations | 0:30 | 3:40 |
| 8 | **Papers** 4 — ask the paper (Q&A) | 0:25 | 4:05 |
| 9 | **Papers** 5 — compare two papers | 0:25 | 4:30 |
| 10 | **Collections** 1 — organize + visibility | 0:30 | 5:00 |
| 11 | **Collections** 2 — literature review over a collection | 0:30 | 5:30 |
| 12 | **Discover** — import + feeds + save | 0:40 | 6:10 |
| 13 | **Workspace** 1 — members and roles | 0:25 | 6:35 |
| 14 | **Workspace** 2 — invite + live notification | 0:30 | 7:05 |
| 15 | **Research** 1 — editor: template, citation, export | 0:50 | 7:55 |
| 16 | **Research** 2 — realtime co-editing (two windows) | 0:55 | 8:50 |
| 17 | **Research** 3 — citation graph + research map | 0:35 | 9:25 |
| 18 | **Payments** — Stripe checkout + billing | 0:40 | 10:05 |
| 19 | **Admin** — console tour | 0:20 | 10:25 |
| 20 | Testing 0 — transition | 0:05 | 10:30 |
| 21 | Testing 1 — automated tests (Jest + Supertest) | 0:40 | 11:10 |
| 22 | Testing 2 — access control (403) | 0:15 | 11:25 |
| 23 | Testing 3 — payment safety (replay) | 0:15 | 11:40 |
| 24 | GitHub — repository tour | 0:25 | 12:05 |
| 25 | Close | 0:10 | 12:15 |

Spoken words total ≈ **1,155**. At 1.73 words/second that is about **11:05 of speech**;
the remaining **~1:10** is clicks, loads, and brief pauses — keep talking while panels
load, and that time is covered.

---

## 3. Cue cards — what to do, in this order

*(Quick operational reference for recording. The full speech is in the numbered
sections below — these cards tell you which screen, which action, and how each beat
starts. Rows 5, 6, 10, 12 are already recorded.)*

| # | At | On screen | Do this | Start saying |
| - | -- | --------- | ------- | ------------ |
| 1 | 0:00 | Home page (tab 1) | Slow scroll through the hero | "Every researcher knows this feeling…" |
| 2 | 0:20 | Home page | Keep scrolling the feature sections | "Our team is Phantom Devs…" |
| 3 | 0:45 | Home page | End the scroll on pricing/features | "And ScholarFlow is more than a paper library…" |
| 4 | 1:25 | Dashboard (tab 2, logged in as Bob) | Switch to the app tab | "I am logged in as Bob…" |
| 5 | 1:40 | **Papers** — Upload page | Drag **ASB.pdf** in → wait for metadata → Publish | "This is the upload page…" **(recorded)** |
| 6 | 2:30 | **Papers** — Library | Type **"language models hallucinate"** | "This is my library…" **(recorded)** |
| 7 | 3:10 | **Papers** — paper detail | Wait for the text view → highlight a sentence → add a note | "Here is one of those papers…" |
| 8 | 3:40 | **Papers** — AI panel on the paper | Ask **"Which method did they use?"** (summary/key points already shown in row 5) | "You saw the summary and key points…" |
| 9 | 4:05 | **Papers** — Comparator | Compare **ASB + ToolGate** | "And for two papers, I ask for a comparison…" |
| 10 | 4:30 | **Collections** — Add to collection | Add the paper to **"Agent Security"** + show visibility | "That is the Papers module…" **(recorded)** |
| 11 | 5:00 | **Collections** — collection detail | Generate a **literature review** over "Agent Security" | "And a whole collection can work as one input…" |
| 12 | 5:30 | **Discover** (+ Import) | Trending feed → Save to Library | "Collections stay organized; Discover brings new papers in." **(recorded)** |
| 13 | 6:10 | **Workspace** — workspaces | Open the ML workspace → members + roles | "Now the Workspace module — where the team lives." |
| 14 | 6:35 | **Workspace** — Team → bell | Send the prepared invite (**Editor** role) → open the bell | "I invite a new member…" |
| 15 | 7:05 | **Research** — Editor | New paper from the **IEEE** template → type two lines → insert a citation → Export PDF | "Now the Research module — this is where the writing happens." |
| 16 | 7:55 | **Research** — two browser windows | Emily types → move both cursors so names show → stay silent for two seconds | "A paper is rarely written alone…" |
| 17 | 8:50 | **Research** — Citation Graph → Research Map | Select **ASB + ToolGate** (show the edge) → open the map | "The Research module also maps the literature…" |
| 18 | 9:25 | **Payments** — Pricing → Stripe Checkout | Choose **Pro** → card `4242 4242 4242 4242` → return to Billing | "Every module you saw is product; payments keep it running." |
| 19 | 10:05 | **Admin** — admin tab | Metrics → Reports → Audit Log → Settings (quick) | "And behind the product is the operator view…" |
| 20 | 10:25 | Testing — Terminal A | Run `yarn test` and keep talking over it | "That is the product…" |
| 21 | 11:10 | Testing — Michael's window | Open the view-only paper → try to edit → show the 403 | "Next, one live security check…" |
| 22 | 11:25 | Testing — Terminal C (`stripe listen`) | Replay the same event twice | "And money deserves the same care…" |
| 23 | 11:40 | GitHub (browser) | README → Insights → Contributors → Releases → live link | "Before we finish…" |
| 24 | 12:05 | Dashboard | Return to the dashboard, pause, deliver the close | "That is ScholarFlow…" |

**Rules while recording:** keep the cursor slow; one numbered row at a time; keep
talking while anything loads; if a step fails, move on to the next row — do not restart
the whole take. Rows 7–9 are new (the earlier recording already covered 5, 6, 10, 12).

---

## 4. Introduction (0:00 – 1:40)

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

### [1:25 – 1:40] Setup line — switch to the app

*(Switch to the logged-in dashboard as Bob.)*

> I am logged in as Bob, a team lead.
> My library already has papers, and my team is active.
> Let me start with the most common task — adding a new paper.

---

## 5. Core Features Demo (1:40 – 10:25)

*Organized by sidebar module: Papers → Collections → Discover → Workspace → Research →
Payments → Admin.*

### Papers — 1. Upload and automatic metadata [1:40 – 2:30] *(recorded)*

**[Action:** open the Upload page, drag one PDF in, let the metadata panel fill.**]**

> This is the upload page, and the paper is ready on my desktop.
> I drop it here — and while it uploads, ScholarFlow reads the document in the
> background.
> Watch the metadata panel: the title, the authors, and the abstract appear on their
> own, extracted by AI from the PDF.
> I change nothing. I click publish, and the paper joins my library in secure cloud
> storage.

**Transition:** *Let me find it the way a researcher would — by meaning.*

### Papers — 2. Library and semantic search [2:30 – 3:10] *(recorded)*

**[Action:** open the library, type "language models hallucinate" in search.**]**

> This is my library — papers, tags, status, and collections.
> But now I do not search by exact words; I search by meaning.
> I type "language models hallucinate", and the system finds the relevant paper, even
> though those words are not in its title.
> That is semantic search, powered by vector embeddings — and it only searches papers I
> am allowed to see.

### Papers — 3. Reading and annotating [3:10 – 3:40] *(new)*

**[Action:** open one of the results (ASB). Wait for the text view, highlight a sentence,
add a short note. Pause while the popup appears.**]**

> Here is one of those papers. The extracted text is ready, and the PDF preview is right
> here.
> I highlight a sentence, and add a short note.
> Everything I mark stays attached to the paper — for me, and for my team.

### Papers — 4. Ask the paper [3:40 – 4:05] *(new)*

**[Action:** in the paper's AI panel, ask **"Which method did they use?"** and let the
answer stream. The summary and key points were already shown during upload — do not
scroll back to them.**]**

> You saw the summary and the key points when this paper was uploaded — so let me ask it
> a real question instead.
> Which method did they use?
> The answer comes from this paper's own text, not from the open internet — that is the
> difference between a chatbot and a research assistant.

### Papers — 5. Compare two papers [4:05 – 4:30] *(new)*

**[Action:** open the Comparator with **ASB + ToolGate** and let the comparison appear.**]**

> And for two papers, I can ask for a comparison: ASB against ToolGate — where do they
> agree, and where do they differ?
> This is exactly what a related-work section needs.

**Transition into Collections:** *That is the Papers module — now let me organize what I
found.*

### Collections — 1. Organize and share [4:30 – 5:00] *(recorded)*

**[Action:** add the paper to a collection; show the collection picker and the
visibility options briefly.**]**

> This is the Collections module, where papers become organized projects.
> I add this paper to "Agent Security" — or create a new collection, like "Thesis
> Reading".
> Collections carry permissions, so I can share a whole collection with my team.
> Every paper keeps its own tags and status, so a collection stays a clean, curated
> list.

### Collections — 2. Literature review over a collection [5:00 – 5:30] *(new)*

**[Action:** open the "Agent Security" collection and generate a literature review; let
the draft appear.**]**

> And a whole collection can work as one input.
> I select "Agent Security" and ask for a literature review draft.
> The AI synthesises all of these papers into one structured overview — a first draft
> of the related-work section, in seconds.

**Transition into Discover:** *Collections stay organized; Discover brings new papers
in.*

### Discover — Import and research feeds [5:30 – 6:10] *(recorded)*

**[Action:** open Import and paste the prepared DOI or arXiv link; let the fetch start.
Then open Discover (trending) and click Save to Library on one card.**]**

> And where do new papers come from? Two ways.
> First, import: I paste a DOI or an arXiv link, and the paper and its metadata are
> fetched automatically.
> Second, discovery: this is the Discover feed — live trending papers and
> recommendations based on my reading.
> One click saves it to my library.
> And the import runs the same AI metadata extraction, so a new paper arrives ready to
> read.

**Transition into Workspace:** *That is research work — now the team.*

### Workspace — 1. Members and roles [6:10 – 6:35] *(new)*

**[Action:** open Workspaces, then the ML workspace — show the members list with roles
and the shared papers.**]**

> Now the Workspace module — where the team lives.
> This is our ML workspace: the members, their roles, and the papers we share.
> Everyone sees exactly what their role allows.

### Workspace — 2. Invite and live notification [6:35 – 7:05] *(new)*

**[Action:** open Team, send the prepared invite with the Editor role. Switch to the
notification bell; the new notification arrives on its own.**]**

> I invite a new member and choose a role — Viewer, Editor, or Manager.
> The moment I send it, the notification arrives in the bell, in real time.
> Invitations, role changes, and removals all flow through the same live channel.

**Transition into Research:** *And the same live system runs the writing itself.*

### Research — 1. Editor: template, citation, export [7:05 – 7:55] *(new)*

**[Action:** create a new paper from the IEEE template. Type two lines. Show the save
indicator. Insert a citation from the library. Open the export dialog and show the PDF
download completing.**]**

> Now the Research module — this is where the writing happens.
> I create a new paper from a template; this one is IEEE.
> The editor supports tables, images, and LaTeX math, and it saves automatically — watch
> the save indicator. I never pressed save.
> I insert a citation from my library, in the format I choose — one of nine formats,
> including APA, IEEE, and BibTeX.
> And when the draft is ready, one click exports a clean PDF.

### Research — 2. Real-time co-editing [7:55 – 8:50] *(new)*

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

### Research — 3. Citation graph and research map [8:50 – 9:25] *(new)*

**[Action:** open the Citation Graph and select **ASB + ToolGate** so the arrow between
them appears. Then open the Research Map and hover two topic bubbles.**]**

> The Research module also maps the literature.
> This is the citation graph: every arrow is a real reference between papers in my
> library — ASB cites ToolGate.
> And the research map turns my tags into a topic cloud, so I can see where the
> literature is dense.

**Transition into Payments:** *Every module you saw is the product; payments keep it
running.*

### Payments — Stripe checkout and billing [9:25 – 10:05] *(new)*

**[Action:** open Pricing, choose Pro, land on Stripe Checkout, pay with the test card.
Return to the Billing page.**]**

> I upgrade to the Pro plan. This is Stripe Checkout, hosted by Stripe, so no card data
> touches our servers.
> I use a test card, and the payment succeeds.
> The billing page shows my plan and my invoices.
> And the admin console picks the payment up instantly, through webhooks.

### Admin — Console tour [10:05 – 10:25] *(new)*

**[Action:** switch to the admin tab. Show the overview metrics (CPU, memory, storage,
database), then open Reports, the Audit Log, and Settings quickly.**]**

> And behind the product is the operator view: live system metrics, reports, the audit
> log, and platform settings.
> Everything an admin needs, on real data.

---

## 6. Testing Demo (10:25 – 11:40)

**Purpose: the automated test suite is the main part — billing, payments, papers,
validation, and access control are all covered by Jest (unit + integration) and
Supertest (API end-to-end). Access control and payment safety are quick live checks.**

### [10:25 – 10:30] Transition — Why testing matters

**[Action:** open the tests terminal.**]**

> That is the product. But how do we know it works? We test it.

### [10:30 – 11:10] Testing 1 — Automated tests (Jest + Supertest)

**[Action:** show the test files (backend `src/__tests__`, frontend `src/__tests__`), then
run `yarn test` and let the green summary land before speaking again.**]**

> We test it in two ways. These are the automated tests — Jest for unit and
> integration, Supertest for API end-to-end.
> They already cover billing, payments, papers, validation, and access control.
> Watch the suite run — twenty-one suites, fifty-nine tests, all passing.

### [11:10 – 11:25] Testing 2 — Access control

**[Action:** as Michael, open the view-only paper and attempt an edit — show the
refusal.**]**

> Next, one live security check: a view-only colleague tries to edit — the server
> refuses. Four oh three.

### [11:25 – 11:40] Testing 3 — Payment safety

**[Action:** in the `stripe listen` terminal, replay the same event twice; show the
subscription changing only once.**]**

> And money deserves the same care: for payments, webhooks are the source of truth.
> I replay the same event twice — the subscription changes only once.

---

## 7. GitHub & Engineering Practice (11:40 – 12:15)

**Purpose: show the process behind the product — sprint workflow, every team member's
contribution, proper versioned releases, and the live deployment.**

### [11:40 – 12:05] The repository tour

**[Action:** switch to the browser and open the GitHub repository. Scroll the README
slowly, then open **Insights → Contributors**, then **Releases**, then the live
deployment link. Move the cursor slowly; let each page land before speaking.**]**

> Before we finish, one last look — our GitHub — because the process matters too.
> Sprint-based development, contributions from every member, and every version
> released properly.
> Every feature was reviewed before it merged — the pull requests and the history are
> all here.
> And the product is deployed live.

### [12:05 – 12:15] Close

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

- Drop the last sentence of: Papers 1, Papers 3, Workspace 2, Testing 3 (payment
  safety). **Never shorten Research 2 (realtime).**
- Never speed up; keep the 1.73 words/second pace. A calm pause reads as confidence.
- If a panel loads slowly, keep speaking — describe what is loading. The only planned
  silence is the realtime beat, where the sync speaks for itself.

## 10. Delivery tips

- Camera is off, so the screen is the only visual: move the cursor slowly and
  deliberately, and let every panel land before you speak.
- In editing, add short on-screen captions for the three key numbers
  (9 citation formats · 59 automated tests · 0 lint errors) so they are unmissable.
- In the automated-tests beat, keep talking while the suite runs, then let the green
  summary land as your closing line.
- In the realtime beat, say nothing while Emily's text appears — let the audience see it.
- The unrecorded beats (Papers 3–5, Collections 2, Workspace, Research, Payments,
  Admin) start with a one-line module intro — say it as you open the first screen of
  the module.
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

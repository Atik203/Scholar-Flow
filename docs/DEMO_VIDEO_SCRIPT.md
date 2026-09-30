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

---

## 1. Before you record

### Accounts (all passwords: `password123`)

| Role | Account | Used for |
| ---- | ------- | -------- |
| Main presenter | `teamlead@scholarflow.com` (Bob) | Entire core demo |
| Co-editor | `emily.carter@scholarflow.com` (Emily) | Realtime scene (second browser) |
| View-only colleague | `michael.chen@scholarflow.com` (Michael) | Access-control test (403) |
| Administrator | `admin@scholarflow.com` | Admin console tour (metrics, reports, audit) |

### Data to prepare

- **One published paper** with the AI summary and key points already generated once
  (so the demo doesn't wait on first-time processing).
- **One draft paper** with no public link (for the 404 test).
- **One paper shared with Michael as view-only** (for the 403 test).
- **One collection** ready to add a paper into (e.g., "Thesis Reading") — for the
  Collections beat.
- **One DOI or arXiv link** ready to paste — for the Import beat. And the Discover feed
  open with at least one saveable card.
- **Two papers** in the library for the comparator, and **one collection with several
  papers** for the literature review — for the AI-synthesis beat.
- **A pending invite ready to send** in the Team section (for the notification beat).
- **A recent test payment** visible in the admin payments list — for the Admin beat.
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
| 5 | Core 1 — upload + AI metadata | 0:50 | 2:30 |
| 6 | Core 2 — library + semantic search | 0:40 | 3:10 |
| 7 | Core 3 — collections | 0:25 | 3:35 |
| 8 | Core 4 — discover + import | 0:40 | 4:15 |
| 9 | Core 5 — PDF + annotations | 0:40 | 4:55 |
| 10 | Core 6 — AI summary, key points, Q&A | 1:00 | 5:55 |
| 11 | Core 7 — AI compare + literature review | 0:35 | 6:30 |
| 12 | Core 8 — editor + citation + export | 1:00 | 7:30 |
| 13 | Core 9 — realtime co-editing (two windows) | 1:05 | 8:35 |
| 14 | Core 10 — team invite + live notification | 0:35 | 9:10 |
| 15 | Core 11 — Stripe checkout + billing | 0:45 | 9:55 |
| 16 | Core 12 — admin console | 0:30 | 10:25 |
| 17 | Testing 0 — transition | 0:05 | 10:30 |
| 18 | Testing 1 — automated tests (Jest + Supertest) | 0:40 | 11:10 |
| 19 | Testing 2 — access control (403) | 0:15 | 11:25 |
| 20 | Testing 3 — payment safety (replay) | 0:15 | 11:40 |
| 21 | GitHub — repository tour | 0:25 | 12:05 |
| 22 | Close | 0:10 | 12:15 |

Spoken words total ≈ **1,160**. At 1.73 words/second that is about **11:10 of speech**;
the remaining **~1:05** is clicks, loads, and brief pauses — keep talking while panels
load, and that time is covered.

---

## 3. Introduction (0:00 – 1:40)

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
> Let me start with the most common task: adding a new paper.

---

## 4. Core Features Demo (1:40 – 10:25)

### [1:40 – 2:30] Core 1 — Upload and automatic metadata

**[Action:** open the Upload page, drag one PDF in, let the metadata panel fill.**]**

> This is the upload page, and the paper is ready on my desktop.
> I drop it here — and while it uploads, ScholarFlow reads the document in the
> background.
> Watch the metadata panel: the title, the authors, and the abstract appear on their
> own, extracted by AI from the PDF.
> I change nothing. I click publish, and the paper joins my library in secure cloud
> storage.

**Transition:** *Let me find it the way a researcher would — by meaning.*

### [2:30 – 3:10] Core 2 — Library and semantic search

**[Action:** open the library, type "language models hallucinate" in search.**]**

> This is my library — papers, tags, status, and collections.
> But now I do not search by exact words; I search by meaning.
> I type "language models hallucinate", and the system finds the relevant paper, even
> though those words are not in its title.
> That is semantic search, powered by vector embeddings — and it only searches papers I
> am allowed to see.

### [3:10 – 3:35] Core 3 — Collections

**[Action:** add the found paper to a collection; show the collection picker and the
visibility options briefly.**]**

> Search finds the paper; collections keep it organized.
> I add it to a collection — or create a new one, like "Thesis Reading".
> And collections carry permissions, so I can share a whole collection with my team.
> Every paper keeps its own tags and status, so a collection stays a clean, curated
> list.

### [3:35 – 4:15] Core 4 — Discover and import

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

### [4:15 – 4:55] Core 5 — Reading, highlighting, and notes

**[Action:** open the paper, wait for the text view, highlight one sentence, add a short
note. Pause while the popup appears.**]**

> Found it. Now let me read it.
> The extracted text is ready, and the PDF preview is right here.
> I select a sentence, highlight it, and add a short note.
> I can also keep my own research notes beside the paper.
> Everything I mark is saved instantly and stays attached — for me, and for my team.

### [4:55 – 5:55] Core 6 — AI summary, key points, and questions

**[Action:** click Generate summary; let the card appear. Scroll to key points. Then ask
"Which method did they use?" and let the answer stream.**]**

> Reading is only half the work; the hard part is understanding.
> So let me open the AI layer. I click generate summary.
> In a few seconds I get the key findings, in the tone and length I chose.
> I can also regenerate it with a different tone — for a general audience, or a
> technical one.
> Below it are the key points — the main claims of the paper, extracted one by one.
> And I can ask questions, like: which method did they use?
> The answer comes from this paper's own text, not from the open internet.
> That is the difference between a chatbot and a research assistant.

### [5:55 – 6:30] Core 7 — AI compare and literature review

**[Action:** open the Comparator with two papers and show the result, then generate a
Literature Review over a collection and let the draft appear.**]**

> And the AI works across papers, not just inside one.
> I select two papers and compare them — the model shows where they agree and where
> they disagree.
> Over a whole collection, I can generate a literature review draft — a synthesis of
> many papers in seconds.
> This is the part that saves days of reading: instead of opening fifty tabs, I get one
> structured overview — and I can still open every source behind it.

### [6:30 – 7:30] Core 8 — Writing: template, citation, export

**[Action:** create a new paper from the IEEE template. Type two lines. Show the save
indicator. Insert a citation from the library. Open the export dialog and show the PDF
download completing.**]**

> Understanding leads to writing — so let me write with it.
> I create a new paper from a template; this one is IEEE.
> The editor supports tables, images, and LaTeX math, and it saves automatically — watch
> the save indicator. I never pressed save.
> I insert a citation from my library, in the format I choose — one of nine formats,
> including APA, IEEE, and BibTeX.
> And when the draft is ready, one click exports a clean PDF.
> Writing, references, and export — in one place.

### [7:30 – 8:35] Core 9 — Real-time co-editing (centerpiece)

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

### [8:35 – 9:10] Core 10 — Team invite and live notification

**[Action:** open Team, send the prepared invite with the Editor role. Switch to the
notification bell; the new notification arrives on its own.**]**

> And the same live system runs everything around the paper.
> For example, I invite a new member and choose a role — Viewer, Editor, or Manager.
> The moment I send it, the notification arrives in the bell, in real time.
> Invitations, role changes, and removals all flow through this same channel.

### [9:10 – 9:55] Core 11 — Payments and billing

**[Action:** open Pricing, choose Pro, land on Stripe Checkout, pay with the test card.
Return to the Billing page.**]**

> Features like these need a business model, so here is the last piece — payments.
> I upgrade to the Pro plan. This is Stripe Checkout, hosted by Stripe, so no card data
> touches our servers.
> I use a test card, and the payment succeeds.
> The billing page shows my plan and my invoices.
> And in the admin console, the same payment appears instantly, because our backend
> processes Stripe webhooks.

### [9:55 – 10:25] Core 12 — Admin console

**[Action:** switch to the admin tab. Show the overview metrics (CPU, memory, storage,
database), then open Reports, the Audit Log, and Settings quickly.**]**

> And behind the product is the operator view.
> This is the admin console: real-time system metrics — CPU, memory, storage, and
> database.
> Reports with exports, the audit log, and platform settings.
> And every action is recorded, so nothing happens silently.
> Everything an operator needs, on real data.

---

## 5. Testing Demo (10:25 – 11:40)

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

## 6. GitHub & Engineering Practice (11:40 – 12:15)

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

## 7. Number cheat sheet

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

## 8. If you fall behind

- Drop the last sentence of: Core 1, Core 5, Core 10, Testing 3 (payment safety).
  **Never shorten Core 9 (realtime).**
- Never speed up; keep the 1.73 words/second pace. A calm pause reads as confidence.
- If a panel loads slowly, keep speaking — describe what is loading. The only planned
  silence is the realtime beat, where the sync speaks for itself.

## 9. Delivery tips

- Camera is off, so the screen is the only visual: move the cursor slowly and
  deliberately, and let every panel land before you speak.
- In editing, add short on-screen captions for the three key numbers
  (9 citation formats · 59 automated tests · 0 lint errors) so they are unmissable.
- In the automated-tests beat, keep talking while the suite runs, then let the green
  summary land as your closing line.
- In the realtime beat, say nothing while Emily's text appears — let the audience see it.
- The four extra beats (Collections, Discover, AI compare, Admin) are fast — start
  clicking immediately and let the narration lead.
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

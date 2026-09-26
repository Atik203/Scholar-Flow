# ScholarFlow — Demo Video Script (10:00, Solo Narration)

Total time: **10:00**. Introduction: **1:35** · Core features demo: **6:00** · Testing demo: **1:50** · GitHub & close: **0:35**.

Written for a slow, careful speaker at **1.73 words per second** (about **104 words per
minute**) — the measured pace from the HaluRISC recording pass. All timings below come from
that rate, so they hold without rushing.

Every sentence connects to the next, and each section ends on a line that sets up the
following section. Read it as continuous speech, not as separate blocks.

**Camera is off.** This is a voice-over + screen recording. The screen carries every
visual, so slow, deliberate cursor movement matters more than ever — and the narration
should sound warm and energetic to compensate for the missing face.

---

## 1. Before you record

### Accounts (all passwords: `password123`)

| Role | Account | Used for |
| ---- | ------- | -------- |
| Main presenter | `teamlead@scholarflow.com` (Bob) | Entire core demo |
| Co-editor | `emily.carter@scholarflow.com` (Emily) | Realtime scene (second browser) |
| View-only colleague | `michael.chen@scholarflow.com` (Michael) | Access-control test (403) |
| Administrator | `admin@scholarflow.com` | Payment appears in admin console |

### Data to prepare

- **One published paper** with the AI summary and key points already generated once
  (so the demo doesn't wait on first-time processing).
- **One draft paper** with no public link (for the 404 test).
- **One paper shared with Michael as view-only** (for the 403 test).
- **A pending invite ready to send** in the Team section (for the notification beat).
- **Stripe test mode** ready. Test card: `4242 4242 4242 4242`, any future date, any CVC.
  Start `stripe listen --forward-to http://localhost:5000/webhooks/stripe` **before**
  recording (it prints a secret once — never show that terminal during the video).

### Screens and terminals to open before recording

1. Home page open in the first tab at 110% zoom; bookmarks bar hidden, notifications off
   (Do Not Disturb on). The logged-in dashboard open in the next tab.
2. Terminal A — repo root, for the quality gates (`yarn type-check`, `yarn lint`).
3. Terminal B — backend log (`yarn dev:backend` output), for the slow-query check.
4. Terminal C — `stripe listen` output, for the webhook replay.
5. Browser window 1 — Bob (main). Window 2 — Emily (realtime). Tab — Michael, plus an
   admin tab.
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
| 3 | Intro — built to be trusted | 0:35 | 1:20 |
| 4 | Intro — setup line | 0:15 | 1:35 |
| 5 | Core 1 — upload + AI metadata | 0:40 | 2:15 |
| 6 | Core 2 — library + semantic search | 0:35 | 2:50 |
| 7 | Core 3 — PDF + annotations | 0:35 | 3:25 |
| 8 | Core 4 — AI summary, key points, Q&A | 0:55 | 4:20 |
| 9 | Core 5 — editor + citation + export | 0:55 | 5:15 |
| 10 | Core 6 — realtime co-editing (two windows) | 1:00 | 6:15 |
| 11 | Core 7 — team invite + live notification | 0:35 | 6:50 |
| 12 | Core 8 — Stripe checkout + admin proof | 0:45 | 7:35 |
| 13 | Testing 0 — transition | 0:10 | 7:45 |
| 14 | Testing 1 — quality gates | 0:20 | 8:05 |
| 15 | Testing 2 — health + query budget | 0:20 | 8:25 |
| 16 | Testing 3 — access control (403 / 404 / revoke) | 0:40 | 9:05 |
| 17 | Testing 4 — webhook idempotency + sweeper | 0:20 | 9:25 |
| 18 | GitHub & engineering practice — repo tour + close | 0:35 | 10:00 |

Spoken words total ≈ **840**. At 1.73 words/second that is about **8:05 of speech**; the
remaining **1:55** is clicks, loads, and deliberate silence while panels appear.

---

## 3. Introduction (0:00 – 1:35)

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

### [0:45 – 1:20] Built to be trusted — finish the Home page scroll

*(End the scroll on the pricing/features area of the Home page.)*

> ScholarFlow is more than a paper library.
> It is the reading tool, the writing tool, the citation manager, the AI assistant,
> and the shared workspace — working together in one product.
> And because research must be trusted, correctness, permissions, and payment safety
> are engineered in from the start.

### [1:20 – 1:35] Setup line — switch to the app

*(Switch to the logged-in dashboard as Bob.)*

> I am logged in as Bob, a team lead.
> My library already has papers, and my team is active.
> Let me start with the most common task: adding a new paper.

---

## 4. Core Features Demo (1:35 – 7:35)

### [1:35 – 2:15] Core 1 — Upload and automatic metadata

**[Action:** open the Upload page, drag one PDF in, let the metadata panel fill.**]**

> This is the upload page. I drop a research paper here.
> Watch the metadata panel.
> The title, the authors, and the abstract appear on their own — extracted by AI from the
> document.
> I change nothing. I click publish.
> The paper is now in my library, stored in secure cloud storage.

**Transition:** *Let me find it the way a researcher would — by meaning.*

### [2:15 – 2:50] Core 2 — Library and semantic search

**[Action:** open the library, type "language models hallucinate" in search.**]**

> This is my library — every paper, with tags, status, and collections.
> Now I search by meaning, not by exact words.
> I type "language models hallucinate", and the system finds the relevant paper — even
> though those words are not in its title.
> That is semantic search, powered by vector embeddings.

### [2:50 – 3:25] Core 3 — Reading, highlighting, and notes

**[Action:** open the paper, wait for the text view, highlight one sentence, add a short
note. Pause while the popup appears.**]**

> Here is the paper. The extracted text is ready, and the PDF preview is right here.
> I select a sentence and highlight it. I add a short note.
> I can also keep my own research notes beside the paper.
> Everything I mark stays attached to this paper — for me, and for my team.

### [3:25 – 4:20] Core 4 — AI summary, key points, and questions

**[Action:** click Generate summary; let the card appear. Scroll to key points. Then ask
"Which method did they use?" and let the answer stream.**]**

> Now the AI layer. I click generate summary.
> In a few seconds I get the key findings — in the tone and length I chose.
> Below it, the key points: the main claims of the paper, extracted one by one.
> And I can ask questions. For example: which method did they use?
> The answer is grounded in this paper — not in the open internet.

### [4:20 – 5:15] Core 5 — Writing: template, citation, export

**[Action:** create a new paper from the IEEE template. Type two lines. Show the save
indicator. Insert a citation from the library. Open the export dialog and show the PDF
download completing.**]**

> Next, writing. I create a new paper from a template — this one is IEEE.
> The editor supports tables, images, and LaTeX math, and it saves automatically — watch
> the save indicator.
> I insert a citation from my library. It is added in the format I choose — one of nine
> formats, including APA, IEEE, and BibTeX.
> Finally, export. One click, and the paper becomes a real PDF, ready to share.

### [5:15 – 6:15] Core 6 — Real-time co-editing (centerpiece)

**[Action:** show both windows side by side. Emily types; the text appears on Bob's screen.
Move both cursors so both name labels are visible. Keep silent for two seconds after her
text lands.**]**

> This is the part I am most proud of — two people, one paper, at the same time.
> On the left is my screen. On the right, my teammate Emily, in another browser.
> When she types, I see it instantly. Her cursor carries her name; mine carries mine.
> This is real-time co-editing, built directly into the research workflow.

**Transition:** *And the same live system runs everything around the paper.*

### [6:15 – 6:50] Core 7 — Team invite and live notification

**[Action:** open Team, send the prepared invite with the Editor role. Switch to the
notification bell; the new notification arrives on its own.**]**

> Collaboration also means management. I invite a new member and choose a role — Viewer,
> Editor, or Manager.
> The moment I send it, the notification arrives in the bell, in real time.
> Invitations, role changes, and removals all flow through the same live channel.

### [6:50 – 7:35] Core 8 — Payments and admin proof

**[Action:** open Pricing, choose Pro, land on Stripe Checkout, pay with the test card.
Return to Billing. Then switch to the admin tab and show the same payment in the admin
payments list.**]**

> Finally, the business side. I upgrade to the Pro plan.
> This is Stripe Checkout — hosted by Stripe, so no card data touches our servers.
> I use a test card. The payment succeeds.
> The billing page shows my plan and my invoices.
> And in the admin console, the same payment appears — because our backend processes
> Stripe webhooks.

---

## 5. Testing Demo (7:35 – 9:25)

### [7:35 – 7:45] Transition — Why testing matters

**[Action:** open the gates terminal.**]**

> That is the product. Now — how do we know it is correct?
> We test in three layers: automated gates, live system health, and security.

### [7:45 – 8:05] Testing 1 — Quality gates

**[Action:** run `yarn type-check && yarn lint`. Let the green summary lines sit on screen
before speaking.**]**

> Every change must pass three gates: the production build, the type check, and the
> linter.
> Here, the type check passes for all three applications, and the linter reports zero
> errors.
> This runs before anything ships.

### [8:05 – 8:25] Testing 2 — Health and query budget

**[Action:** open `/api/health/detailed` (or the admin health page). Then switch to the
backend log and scroll to show there are no slow-query warnings.**]**

> This is the health endpoint — database, memory, and services, all green.
> The backend log tracks every slow database query.
> Our budget is fifty milliseconds, and nothing exceeds it.

### [8:25 – 9:05] Testing 3 — Access control

**[Action:** as Michael, open the view-only paper and attempt an edit — show the refusal.
Open the draft's public link — show the friendly not-found page. Back as Bob, revoke a
share and show access dropping immediately.**]**

> Now security. Three quick checks.
> One: a view-only colleague tries to edit. The server refuses — four oh three. The
> server decides, never the interface.
> Two: a draft paper has no public link, and opening it gives a clean not-found page —
> no data leaks.
> Three: when I revoke a share, access disappears immediately.

### [9:05 – 9:25] Testing 4 — Payment safety

**[Action:** in the `stripe listen` terminal, replay the same event twice; show the
subscription changing only once.**]**

> For payments, webhooks are the source of truth.
> I replay the same event twice — the subscription changes once. Handlers are idempotent,
> and a sweeper handles failed payments after a grace period.

---

## 6. GitHub & Engineering Practice (9:25 – 10:00)

**Purpose: show the process behind the product — sprint workflow, every team member's
contribution, proper versioned releases, and the live deployment.**

### [9:25 – 9:55] The repository tour

**[Action:** switch to the browser and open the GitHub repository. Scroll the README
slowly, then open **Insights → Contributors**, then **Releases**, then the live
deployment link from the repo description. Move the cursor slowly; let each page land
before speaking.**]**

> Before we finish, one last look — our GitHub.
> Sprint-based development: every feature in its own branch and pull request, with
> contributions from every member.
> Every version was released properly, and the product is deployed live.

### [9:55 – 10:00] Close

**[Action:** return to the dashboard and let it sit on screen.**]**

> That is ScholarFlow — built by a team, released step by step, and running today.
> Thank you for watching.

---

## 7. Number cheat sheet

| Item | Value |
| ---- | ----- |
| Citation formats | 9 |
| Editor templates | 7 |
| AI providers with fallback | 4 (OpenAI, Gemini, Claude, DeepSeek) |
| Backend modules | 30 |
| Frontend pages | 140+ |
| Lint errors on release | 0 |
| Database query budget | 50 ms |
| API availability target | 99.9% |
| Plans | Free, Pro, Team (+ Enterprise) |
| Test card | 4242 4242 4242 4242 |

Pause for one full second after every number.

---

## 8. If you fall behind

- Drop the last sentence of: Core 1, Core 3, Core 7, Testing 2. **Never shorten Core 6
  (realtime).**
- Never speed up; keep the 1.73 words/second pace. A calm pause reads as confidence.
- If a panel loads slowly, stay silent and let it land. Do not fill the silence.

## 9. Delivery tips

- Camera is off, so the screen is the only visual: move the cursor slowly and
  deliberately, and let every panel land before you speak.
- In editing, add short on-screen captions for the three key numbers
  (9 citation formats · 50 ms query budget · 0 lint errors) so they are unmissable.
- In the realtime beat, say nothing while Emily's text appears — let the audience see it.
- In the GitHub beat, scroll slowly: README, then contributors, then releases, then the
  live deployment — one page per sentence.
- Keep Zoom at 110% so every label is readable.
- The intro is the real Home page — rehearse one slow scroll pass so the sections line up
  with your three sentences. There is no montage to cut.
- Rehearse only the transitions; they are what make the video feel connected:
  - Into core: *"Let me start with the most common task: adding a new paper."*
  - Into realtime: *"This is the part I am most proud of…"*
  - Into testing: *"That is the product. Now — how do we know it is correct?"*
  - Into close: *"That is ScholarFlow…"*

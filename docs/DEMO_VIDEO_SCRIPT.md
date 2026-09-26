# ScholarFlow — Demo Video Script (10:00, Solo Narration)

Total time: **10:00**. Introduction: **1:40** · Core features demo: **6:10** · Testing demo: **2:10**.

Written for a slow, careful speaker at **1.73 words per second** (about **104 words per
minute**) — the measured pace from the HaluRISC recording pass. All timings below come from
that rate, so they hold without rushing.

Every sentence connects to the next, and each section ends on a line that sets up the
following section. Read it as continuous speech, not as separate blocks.

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

1. Frontend at 110% zoom, bookmarks bar hidden, notifications off (Do Not Disturb on).
2. Terminal A — repo root, for the quality gates (`yarn type-check`, `yarn lint`).
3. Terminal B — backend log (`yarn dev:backend` output), for the slow-query check.
4. Terminal C — `stripe listen` output, for the webhook replay.
5. Browser window 1 — Bob (main). Window 2 — Emily (realtime). Tab — Michael, plus an
   admin tab.
6. A second monitor or a side-by-side layout for the realtime beat — both windows visible.

Tip: never open `.env` files on camera. Keep every terminal scrolled to a clean spot.

---

## 2. Timing plan (running clock)

| # | Segment | Time | Running |
| - | ------- | ---- | ------- |
| 1 | Intro — hook (montage) | 0:20 | 0:20 |
| 2 | Intro — what it is | 0:25 | 0:45 |
| 3 | Intro — what you will see | 0:40 | 1:25 |
| 4 | Intro — setup line | 0:15 | 1:40 |
| 5 | Core 1 — upload + AI metadata | 0:45 | 2:25 |
| 6 | Core 2 — library + semantic search | 0:35 | 3:00 |
| 7 | Core 3 — PDF + annotations | 0:40 | 3:40 |
| 8 | Core 4 — AI summary, key points, Q&A | 0:55 | 4:35 |
| 9 | Core 5 — editor + citation + export | 0:55 | 5:30 |
| 10 | Core 6 — realtime co-editing (two windows) | 1:00 | 6:30 |
| 11 | Core 7 — team invite + live notification | 0:35 | 7:05 |
| 12 | Core 8 — Stripe checkout + admin proof | 0:45 | 7:50 |
| 13 | Testing 1 — quality gates | 0:30 | 8:20 |
| 14 | Testing 2 — health + query budget | 0:25 | 8:45 |
| 15 | Testing 3 — access control (403 / 404 / revoke) | 0:40 | 9:25 |
| 16 | Testing 4 — webhook idempotency + sweeper | 0:25 | 9:50 |
| 17 | Close | 0:10 | 10:00 |

Spoken words total ≈ **790**. At 1.73 words/second that is about **7:35 of speech**; the
remaining **2:25** is clicks, loads, and deliberate silence while panels appear.

---

## 3. Introduction (0:00 – 1:40)

**Purpose: this is the first thing judges see. Hook first, explain second, promise third.**

### [0:00 – 0:20] Hook — play the montage

*(Pre-edit 4 fast cuts: dashboard → editor auto-saving → two cursors moving → AI summary
appearing. Speak over it, calm and slow.)*

> Every researcher knows this feeling.
> Papers live in one app. Notes in another. Citations somewhere else.
> And the AI knows nothing about your actual work.
> This is the problem ScholarFlow solves.

### [0:20 – 0:45] What it is — title card on screen

*(Title card: **ScholarFlow — AI-Powered Research Collaboration**.)*

> ScholarFlow is one place for the full research workflow.
> Upload a paper, understand it with AI, annotate it, write with it, cite it,
> and collaborate on it in real time.
> One platform, instead of four or more tools.

### [0:45 – 1:25] What you will see — slow dashboard pan

> In the next ten minutes, I will show you three things.
> First, the product — the research workflow, from upload to export.
> Second, the teamwork — live co-editing, notifications, and payments.
> Third, the testing — how we verify that all of this is correct, safe, and fast.
> There are no slides. Everything you will see is the real system.

### [1:25 – 1:40] Setup line — transition into the demo

> I am logged in as Bob, a team lead.
> My library already has papers, and my team is active.
> Let me start with the most common task: adding a new paper.

---

## 4. Core Features Demo (1:40 – 7:50)

### [1:40 – 2:25] Core 1 — Upload and automatic metadata

**[Action:** open the Upload page, drag one PDF in, let the metadata panel fill.**]**

> This is the upload page. I drop a research paper here.
> Watch the metadata panel.
> The title, the authors, and the abstract appear on their own — extracted by AI from the
> document.
> I change nothing. I click publish.
> The paper is now in my library, stored in secure cloud storage.

**Transition:** *Let me find it the way a researcher would — by meaning.*

### [2:25 – 3:00] Core 2 — Library and semantic search

**[Action:** open the library, type "language models hallucinate" in search.**]**

> This is my library — every paper, with tags, status, and collections.
> Now I search by meaning, not by exact words.
> I type "language models hallucinate", and the system finds the relevant paper — even
> though those words are not in its title.
> That is semantic search, powered by vector embeddings.

### [3:00 – 3:40] Core 3 — Reading, highlighting, and notes

**[Action:** open the paper, wait for the text view, highlight one sentence, add a short
note. Pause while the popup appears.**]**

> Here is the paper. The extracted text is ready, and the PDF preview is right here.
> I select a sentence and highlight it. I add a short note.
> I can also keep my own research notes beside the paper.
> Everything I mark stays attached to this paper — for me, and for my team.

### [3:40 – 4:35] Core 4 — AI summary, key points, and questions

**[Action:** click Generate summary; let the card appear. Scroll to key points. Then ask
"Which method did they use?" and let the answer stream.**]**

> Now the AI layer. I click generate summary.
> In a few seconds I get the key findings — in the tone and length I chose.
> Below it, the key points: the main claims of the paper, extracted one by one.
> And I can ask questions. For example: which method did they use?
> The answer is grounded in this paper — not in the open internet.

### [4:35 – 5:30] Core 5 — Writing: template, citation, export

**[Action:** create a new paper from the IEEE template. Type two lines. Show the save
indicator. Insert a citation from the library. Open the export dialog and show the PDF
download completing.**]**

> Next, writing. I create a new paper from a template — this one is IEEE.
> The editor supports tables, images, and LaTeX math, and it saves automatically — watch
> the save indicator.
> I insert a citation from my library. It is added in the format I choose — one of nine
> formats, including APA, IEEE, and BibTeX.
> Finally, export. One click, and the paper becomes a real PDF, ready to share.

### [5:30 – 6:30] Core 6 — Real-time co-editing (centerpiece)

**[Action:** show both windows side by side. Emily types; the text appears on Bob's screen.
Move both cursors so both name labels are visible. Keep silent for two seconds after her
text lands.**]**

> This is the part I am most proud of — two people, one paper, at the same time.
> On the left is my screen. On the right, my teammate Emily, in another browser.
> When she types, I see it instantly. Her cursor carries her name; mine carries mine.
> This is real-time co-editing, built directly into the research workflow.

**Transition:** *And the same live system runs everything around the paper.*

### [6:30 – 7:05] Core 7 — Team invite and live notification

**[Action:** open Team, send the prepared invite with the Editor role. Switch to the
notification bell; the new notification arrives on its own.**]**

> Collaboration also means management. I invite a new member and choose a role — Viewer,
> Editor, or Manager.
> The moment I send it, the notification arrives in the bell, in real time.
> Invitations, role changes, and removals all flow through the same live channel.

### [7:05 – 7:50] Core 8 — Payments and admin proof

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

## 5. Testing Demo (7:50 – 10:00)

**Transition — open the gates terminal:**

> That is the product. Now — how do we know it is correct?
> We test in three layers: automated gates, live system health, and security.

### [7:50 – 8:20] Testing 1 — Quality gates

**[Action:** run `yarn type-check && yarn lint`. Let the green summary lines sit on screen
before speaking.**]**

> Every change must pass three gates: the production build, the type check, and the
> linter.
> Here, the type check passes for all three applications, and the linter reports zero
> errors.
> This runs before anything ships.

### [8:20 – 8:45] Testing 2 — Health and query budget

**[Action:** open `/api/health/detailed` (or the admin health page). Then switch to the
backend log and scroll to show there are no slow-query warnings.**]**

> This is the health endpoint — database, memory, and services, all green.
> The backend log tracks every slow database query.
> Our budget is fifty milliseconds, and right now, nothing exceeds it.

### [8:45 – 9:25] Testing 3 — Access control

**[Action:** as Michael, open the view-only paper and attempt an edit — show the refusal.
Open the draft's public link — show the friendly not-found page. Back as Bob, revoke a
share and show access dropping immediately.**]**

> Now security. Three quick checks.
> One: a view-only colleague tries to edit. The server refuses — four oh three. The
> server decides, never the interface.
> Two: a draft paper has no public link, and opening it gives a clean not-found page —
> no data leaks.
> Three: when I revoke a share, access disappears immediately.

### [9:25 – 9:50] Testing 4 — Payment safety

**[Action:** in the `stripe listen` terminal, replay the same event twice; show the
subscription changing only once.**]**

> For payments, webhooks are the source of truth.
> I replay the same event twice — the subscription changes once, because every handler is
> idempotent.
> And a scheduled sweeper handles failed payments after a grace period.

### [9:50 – 10:00] Close

**[Action:** return to the dashboard. Look at the camera for the last two lines.**]**

> That is ScholarFlow: one platform for the whole research workflow — built, tested, and
> ready.
> Thank you for watching.

---

## 6. Number cheat sheet

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

## 7. If you fall behind

- Drop the last sentence of: Core 1, Core 3, Core 7, Testing 2. **Never shorten Core 6
  (realtime).**
- Never speed up; keep the 1.73 words/second pace. A calm pause reads as confidence.
- If a panel loads slowly, stay silent and let it land. Do not fill the silence.

## 8. Delivery tips

- Speak to the camera on the first line and the last line; point at the screen in between.
- In the realtime beat, say nothing while Emily's text appears — let the audience see it.
- Keep Zoom at 110% so every label is readable.
- Record the intro montage separately and cut it in during editing.
- Rehearse only the transitions; they are what make the video feel connected:
  - Into core: *"Let me start with the most common task: adding a new paper."*
  - Into realtime: *"This is the part I am most proud of…"*
  - Into testing: *"That is the product. Now — how do we know it is correct?"*
  - Into close: *"That is ScholarFlow…"*

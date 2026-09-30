# ScholarFlow — Demo Video Speech

**Team Phantom Devs** · Total duration: **13:16** (Introduction to 1:35 · Core Features Demo to 11:16 · Testing Demo to 12:31 · GitHub & Close to 13:16)

---

## Introduction (0:00 – 1:35)

### Opening (0:00 – 0:20)

Every researcher knows this feeling. Papers live in one app. Notes in another. Citations somewhere else. And the AI knows nothing about your actual work. This is the problem ScholarFlow solves.

### What ScholarFlow Is (0:20 – 0:45)

Our team is Phantom Devs, and ScholarFlow is one place for the full research workflow. Upload a paper, understand it with AI, annotate it, write with it, cite it, and collaborate on it in real time. No existing tool combines all of these. ScholarFlow is the first.

### Built to Be Trusted (0:45 – 1:25)

And ScholarFlow is more than a paper library. It is the reading tool, the writing tool, the citation manager, the AI assistant, and the shared workspace — working together in one product. And because research must be trusted, correctness, permissions, and payment safety are engineered in from the start.

### Setup (1:25 – 1:35)

I am logged in as Bob, a team lead. My library already has papers, and my team is active. Let me start with the most common task — adding a new paper.

---

## Papers (1:40 – 4:15)

### 1. Upload + Metadata (1:40 – 2:05)

This is the upload page, and the paper is ready on my desktop. I drop it here — the metadata panel fills on its own: title, authors, abstract, extracted by AI from the PDF. I click publish, and the paper joins my library, in secure cloud storage.

### 2. Key Points + AI Summary (2:05 – 2:30)

And the AI has already read it for me. These are the key points — the main claims, one by one. And below, a summary of the findings, in the length and tone I chose.

### 3. AI Insights (2:35 – 2:50)

I can also switch the model and ask the simplest question: what is this paper about? The answer is grounded in this paper's own text — not in the open internet.

### 4. AI Tools (2:50 – 3:31)

The AI also works on my drafts. I can rewrite a paragraph to improve clarity. I can compare two papers side by side, to see where they agree and where they differ. Or I can generate a literature review from both together — a first draft of the related-work section, in seconds.

### 5. All Papers + Tag Filter (3:31 – 3:45)

Back in the library, the tag tabs filter everything instantly — one click, and I see only the papers on that topic.

### 6. Vector Search + Global Search (3:45 – 4:15)

And search works two ways. Semantic search finds papers by meaning — even when the exact words are not in the title. And the global search box looks across papers, collections, and notes at once — always limited to what I am allowed to see.

---

## Collections (4:25 – 5:15)

### 1. View — Grid and List (4:25 – 4:40)

Papers live in collections. I can browse them as a grid or as a list — whichever is faster for the moment.

### 2. Create (4:45 – 5:00)

Creating one takes a name, a description, and a visibility rule — private, team, or public — and it is ready.

### 3. Invite a User (5:00 – 5:15)

I can invite a teammate straight into the collection and set their permission — and the invited email appears right here.

---

## Discover (5:15 – 5:40)

And when I need something new, Discover brings live research in: trending papers, recommendations based on my reading, and a topic explorer — all from live scholarly sources.

---

## Papers — Reading, Annotations, Comments and Notes (5:40 – 6:20)

Back to a paper — the extracted text and the PDF preview sit side by side. I highlight a sentence and add a note. I can also drop a comment mark, for a discussion with my team. And on the side, I keep my own research notes, linked to this paper. Everything I mark stays attached — for me, and for my team.

---

## Workspace (6:20 – 7:35)

### 1. Members and Roles (6:20 – 7:00)

That is the research side — now the Workspace module, where the team lives. This is our ML workspace: its members, their roles, and the papers we share. Everyone sees exactly what their role allows.

### 2. Team Sidebar Tour (7:00 – 7:35)

The Team area holds everything around the members: invitations, the activity log, and the team settings. Invitations live here, every role change is recorded in the activity trail, and the settings control how the team works. All of it updates in real time — the same live system as the bell.

---

## Research (7:35 – 9:42)

### 1. Editor: Template, Citation, Export (7:35 – 8:25)

Now the Research module — this is where the writing happens. I create a new paper from a template; this one is IEEE. The editor supports tables, images, and LaTeX math, and it saves automatically — watch the save indicator; I never pressed save. I insert a citation from my library, in the format I choose — one of nine formats, including APA, IEEE, and BibTeX. And one click exports a clean PDF.

### 2. Real-Time Co-Editing (8:25 – 9:10)

A paper is rarely written alone — so let me show you the part I am most proud of. On the left is my screen. On the right, my teammate Emily, in another browser. Watch: when she types, the text appears on my screen instantly — no refresh, no conflicts. Her cursor carries her name; mine carries mine, so we always know who is where. Two people, one paper, at the same time — real-time co-editing, built into the research workflow.

### 3. Citation Graph + Research Map (9:10 – 9:42)

The Research module also maps the literature. This is the citation graph: every arrow is a real reference between two papers in my library. And the research map turns my tags into a topic cloud, so I can see where the literature is dense.

---

## Payments (9:42 – 10:22)

Every module you saw is the product; payments keep it running. I upgrade to Pro — Stripe Checkout, hosted by Stripe, so no card data touches our servers. I use a test card, and it succeeds; the billing page shows my plan and invoices. And the admin console picks the payment up instantly, through webhooks.

---

## Admin (10:22 – 11:16)

And behind the product is the operator view — the Admin console. Every page is real: live system metrics, users and roles, plans and payments, subscribers, reports, and the audit log. Then the AI models and keys, webhooks, moderation, alerts, and system health — and the platform settings that control it all. Everything an operator needs, on real data.

---

## Testing Demo (11:16 – 12:31)

### Why Testing Matters (11:16 – 11:21)

That is the product. But how do we know it works? We test it.

### 1. Automated Tests — Jest and Supertest (11:21 – 12:01)

We test it in two ways. These are the automated tests — Jest for unit and integration, Supertest for API end-to-end. They already cover billing, payments, papers, validation, and access control. Watch the suite run — twenty-one suites, fifty-nine tests, all passing.

### 2. Access Control (12:01 – 12:16)

Next, one live security check: a view-only colleague tries to edit — the server refuses. Four oh three.

### 3. Payment Safety (12:16 – 12:31)

And money deserves the same care: for payments, webhooks are the source of truth. I replay the same event twice — the subscription changes only once.

---

## GitHub & Engineering Practice (12:31 – 13:16)

### Built with Industry Practice (12:31 – 13:06)

Before we finish, one last look — our GitHub — because the process matters too. Sprint-based development, contributions from every member, and every version released properly. Every feature was reviewed before it merged — the pull requests and the history are all here. And the product is deployed live.

### Closing (13:06 – 13:16)

That is ScholarFlow — built by a team and released step by step. Thank you for watching.

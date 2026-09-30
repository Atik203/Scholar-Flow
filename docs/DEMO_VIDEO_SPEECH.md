# ScholarFlow — Demo Video Speech

**Team Phantom Devs** · Total duration: **12:15** (Introduction 1:40 · Core Features Demo 8:45 · Testing Demo 1:15 · GitHub & Close 0:35)

---

## Introduction (0:00 – 1:40)

### Opening (0:00 – 0:20)

Every researcher knows this feeling. Papers live in one app. Notes in another. Citations somewhere else. And the AI knows nothing about your actual work. This is the problem ScholarFlow solves.

### What ScholarFlow Is (0:20 – 0:45)

Our team is Phantom Devs, and ScholarFlow is one place for the full research workflow. Upload a paper, understand it with AI, annotate it, write with it, cite it, and collaborate on it in real time. No existing tool combines all of these. ScholarFlow is the first.

### Built to Be Trusted (0:45 – 1:25)

And ScholarFlow is more than a paper library. It is the reading tool, the writing tool, the citation manager, the AI assistant, and the shared workspace — working together in one product. And because research must be trusted, correctness, permissions, and payment safety are engineered in from the start.

### Setup (1:25 – 1:40)

I am logged in as Bob, a team lead. My library already has papers, and my team is active. Let me start with the most common task — adding a new paper.

---

## Papers (1:40 – 4:30)

### 1. Upload and Automatic Metadata (1:40 – 2:30)

This is the upload page, and the paper is ready on my desktop. I drop it here — and while it uploads, ScholarFlow reads the document in the background. Watch the metadata panel: the title, the authors, and the abstract appear on their own, extracted by AI from the PDF. I change nothing. I click publish, and the paper joins my library in secure cloud storage.

Let me find it the way a researcher would — by meaning.

### 2. Library and Semantic Search (2:30 – 3:10)

This is my library — papers, tags, status, and collections. But now I do not search by exact words; I search by meaning. I type "language models hallucinate", and the system finds the relevant paper, even though those words are not in its title. That is semantic search, powered by vector embeddings — and it only searches papers I am allowed to see.

### 3. Reading and Annotating (3:10 – 3:40)

Here is one of those papers. The extracted text is ready, and the PDF preview is right here. I highlight a sentence, and add a short note. Everything I mark stays attached to the paper — for me, and for my team.

### 4. Ask the Paper (3:40 – 4:05)

You saw the summary and the key points when this paper was uploaded — so let me ask it a real question instead. Which method did they use? The answer comes from this paper's own text, not from the open internet — that is the difference between a chatbot and a research assistant.

### 5. Compare Two Papers (4:05 – 4:30)

And for two papers, I can ask for a comparison: ASB against ToolGate — where do they agree, and where do they differ? This is exactly what a related-work section needs.

That is the Papers module — now let me organize what I found.

---

## Collections (4:30 – 5:30)

### 1. Organize and Share (4:30 – 5:00)

This is the Collections module, where papers become organized projects. I add this paper to "Agent Security" — or create a new collection, like "Thesis Reading". Collections carry permissions, so I can share a whole collection with my team. Every paper keeps its own tags and status, so a collection stays a clean, curated list.

### 2. Literature Review over a Collection (5:00 – 5:30)

And a whole collection can work as one input. I select "Agent Security" and ask for a literature review draft. The AI synthesises all of these papers into one structured overview — a first draft of the related-work section, in seconds.

Collections stay organized; Discover brings new papers in.

---

## Discover (5:30 – 6:10)

And where do new papers come from? Two ways. First, import: I paste a DOI or an arXiv link, and the paper and its metadata are fetched automatically. Second, discovery: this is the Discover feed — live trending papers and recommendations based on my reading. One click saves it to my library. And the import runs the same AI metadata extraction, so a new paper arrives ready to read.

That is research work — now the team.

---

## Workspace (6:10 – 7:05)

### 1. Members and Roles (6:10 – 6:35)

Now the Workspace module — where the team lives. This is our ML workspace: the members, their roles, and the papers we share. Everyone sees exactly what their role allows.

### 2. Invite and Live Notification (6:35 – 7:05)

I invite a new member and choose a role — Viewer, Editor, or Manager. The moment I send it, the notification arrives in the bell, in real time. Invitations, role changes, and removals all flow through the same live channel.

And the same live system runs the writing itself.

---

## Research (7:05 – 9:25)

### 1. Editor: Template, Citation, Export (7:05 – 7:55)

Now the Research module — this is where the writing happens. I create a new paper from a template; this one is IEEE. The editor supports tables, images, and LaTeX math, and it saves automatically — watch the save indicator. I never pressed save. I insert a citation from my library, in the format I choose — one of nine formats, including APA, IEEE, and BibTeX. And when the draft is ready, one click exports a clean PDF.

### 2. Real-Time Co-Editing (7:55 – 8:50)

A paper is rarely written alone — so let me show you the part I am most proud of. On the left is my screen. On the right, my teammate Emily, in another browser. Watch: when she types, the text appears on my screen instantly — no refresh, no conflicts. Her cursor carries her name; mine carries mine, so we always know who is where. Two people, one paper, at the same time — real-time co-editing, built into the research workflow.

### 3. Citation Graph and Research Map (8:50 – 9:25)

The Research module also maps the literature. This is the citation graph: every arrow is a real reference between papers in my library — ASB cites ToolGate. And the research map turns my tags into a topic cloud, so I can see where the literature is dense.

Every module you saw is the product; payments keep it running.

---

## Payments (9:25 – 10:05)

I upgrade to the Pro plan. This is Stripe Checkout, hosted by Stripe, so no card data touches our servers. I use a test card, and the payment succeeds. The billing page shows my plan and my invoices. And the admin console picks the payment up instantly, through webhooks.

---

## Admin (10:05 – 10:25)

And behind the product is the operator view: live system metrics, reports, the audit log, and platform settings. Everything an admin needs, on real data.

---

## Testing Demo (10:25 – 11:40)

### Why Testing Matters (10:25 – 10:30)

That is the product. But how do we know it works? We test it.

### 1. Automated Tests — Jest and Supertest (10:30 – 11:10)

We test it in two ways. These are the automated tests — Jest for unit and integration, Supertest for API end-to-end. They already cover billing, payments, papers, validation, and access control. Watch the suite run — twenty-one suites, fifty-nine tests, all passing.

### 2. Access Control (11:10 – 11:25)

Next, one live security check: a view-only colleague tries to edit — the server refuses. Four oh three.

### 3. Payment Safety (11:25 – 11:40)

And money deserves the same care: for payments, webhooks are the source of truth. I replay the same event twice — the subscription changes only once.

---

## GitHub & Engineering Practice (11:40 – 12:15)

### Built with Industry Practice (11:40 – 12:05)

Before we finish, one last look — our GitHub — because the process matters too. Sprint-based development, contributions from every member, and every version released properly. Every feature was reviewed before it merged — the pull requests and the history are all here. And the product is deployed live.

### Closing (12:05 – 12:15)

That is ScholarFlow — built by a team and released step by step. Thank you for watching.

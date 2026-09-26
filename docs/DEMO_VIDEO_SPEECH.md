# ScholarFlow — Demo Video Speech

**Team Phantom Devs** · Total duration: **10:00** (Introduction 1:40 · Core Features Demo 6:35 · Testing + GitHub 1:45)

*Keep talking while pages load — only about a minute and a half of this video is silence.*

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

## Core Features Demo (1:40 – 8:15)

### 1. Upload and Automatic Metadata (1:40 – 2:30)

This is the upload page, and the paper is ready on my desktop. I drop it here — and while it uploads, ScholarFlow reads the document in the background. Watch the metadata panel: the title, the authors, and the abstract appear on their own, extracted by AI from the PDF. I change nothing. I click publish, and the paper joins my library in secure cloud storage.

Let me find it the way a researcher would — by meaning.

### 2. Library and Semantic Search (2:30 – 3:10)

This is my library — papers, tags, status, and collections. But now I do not search by exact words; I search by meaning. I type "language models hallucinate", and the system finds the relevant paper, even though those words are not in its title. That is semantic search, powered by vector embeddings — and it only searches papers I am allowed to see.

### 3. Reading, Highlighting, and Notes (3:10 – 3:50)

Found it. Now let me read it. The extracted text is ready, and the PDF preview is right here. I select a sentence, highlight it, and add a short note. I can also keep my own research notes beside the paper. Everything I mark is saved instantly and stays attached — for me, and for my team.

### 4. AI Summary, Key Points, and Questions (3:50 – 4:50)

Reading is only half the work; the hard part is understanding. So let me open the AI layer. I click generate summary. In a few seconds I get the key findings, in the tone and length I chose. Below it are the key points — the main claims of the paper, extracted one by one. And I can ask questions, like: which method did they use? The answer comes from this paper's own text, not from the open internet. That is the difference between a chatbot and a research assistant.

### 5. Writing: Template, Citation, Export (4:50 – 5:50)

Understanding leads to writing — so let me write with it. I create a new paper from a template; this one is IEEE. The editor supports tables, images, and LaTeX math, and it saves automatically — watch the save indicator. I never pressed save. I insert a citation from my library, in the format I choose — one of nine formats, including APA, IEEE, and BibTeX. And when the draft is ready, one click exports a clean PDF. Writing, references, and export — in one place.

### 6. Real-Time Co-Editing (5:50 – 6:55)

A paper is rarely written alone — so let me show you the part I am most proud of. On the left is my screen. On the right, my teammate Emily, in another browser. Watch: when she types, the text appears on my screen instantly — no refresh, no conflicts. Her cursor carries her name; mine carries mine, so we always know who is where. Two people, one paper, at the same time — real-time co-editing, built into the research workflow.

### 7. Team Invite and Live Notification (6:55 – 7:30)

And the same live system runs everything around the paper. For example, I invite a new member and choose a role — Viewer, Editor, or Manager. The moment I send it, the notification arrives in the bell, in real time. Invitations, role changes, and removals all flow through this same channel.

### 8. Payments and Admin Proof (7:30 – 8:15)

Features like these need a business model, so here is the last piece — payments. I upgrade to the Pro plan. This is Stripe Checkout, hosted by Stripe, so no card data touches our servers. I use a test card, and the payment succeeds. The billing page shows my plan and my invoices. And in the admin console, the same payment appears instantly, because our backend processes Stripe webhooks.

---

## Testing Demo (8:15 – 9:25)

### Why Testing Matters (8:15 – 8:20)

That is the product. But how do we know it works? We test it.

### 1. Automated Tests — Jest and Supertest (8:20 – 8:55)

We test it in two ways. These are the automated tests — Jest for unit and integration, Supertest for API end-to-end. They already cover billing, payments, papers, validation, and access control. Watch the suite run — twenty-one suites, fifty-nine tests, all passing.

### 2. Access Control (8:55 – 9:10)

Next, one live security check: a view-only colleague tries to edit — the server refuses. Four oh three.

### 3. Payment Safety (9:10 – 9:25)

And money deserves the same care: for payments, webhooks are the source of truth. I replay the same event twice — the subscription changes only once.

---

## GitHub & Engineering Practice (9:25 – 10:00)

### Built with Industry Practice (9:25 – 9:50)

Before we finish, one last look — our GitHub — because the process matters too. Sprint-based development, contributions from every member, and every version released properly. And the product is deployed live.

### Closing (9:50 – 10:00)

That is ScholarFlow — built by a team and released step by step. Thank you for watching.

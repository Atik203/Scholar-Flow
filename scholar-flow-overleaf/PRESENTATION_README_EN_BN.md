# ScholarFlow SRS Presentation Guide (No Slides)

Total time: **10 minutes**  
Presenters: **3**  
Material: **Use `srs-main.pdf` only (no extra slides)**

> Note: In our current project, **all users are demo/test users** for the building and testing phase. There are **no real production users yet**. Please mention this clearly when talking about users, workspaces, or beta testing.

---

## Presenter & Time Plan

- **Presenter 1** – Chapter 1 & 2 (Introduction, System Study) → ~3.5 minutes
- **Presenter 2** – Chapter 3 (System Analysis) → ~3 minutes
- **Presenter 3** – Chapter 4 (System Design) → ~3.5 minutes

When speaking, you can mention chapter/section names like this:  
“Now I am talking from **Chapter 1: Introduction**, section **Purpose** in the SRS.”

---

## Presenter 1 – Chapters 1 & 2 (≈ 3.5 minutes)

### 1.1 Start & Project Intro (≈ 40 seconds)

**Where in SRS:**

- `srs-main.pdf` → **Chapter 1: Introduction** (section **Purpose**)

**English (simple):**

- My name is ****\_****. I will start our presentation.
- Our project name is **ScholarFlow**. It is an **AI-powered research paper collaboration hub**.
- The goal is to make it easier for students and researchers to **store papers, organize them, get AI summaries, and work together** in one place.

**Bangla (simple):**

- আমার নাম **\_\_\_\_**। আমি আমাদের প্রেজেন্টেশন শুরু করব।
- আমাদের প্রজেক্টের নাম **ScholarFlow**। এটি একটি **AI-চালিত research paper collaboration প্ল্যাটফর্ম**।
- এর main লক্ষ্য হল ছাত্র-ছাত্রী আর researcher দের জন্য **পেপার রাখা, সাজানো, AI summary নেওয়া আর একসাথে কাজ করা সহজ করা**।

> Reminder: If you mention “users”, say that **right now they are demo/test users only**, used for development and testing.

---

### 1.2 Problem & Pain Points (≈ 60 seconds)

**Where in SRS:**

- Chapter 1 → **Problem Statement**, **Problem Description**
- Figures: **Top Research Workflow Pain Points**, **Current Tools Used by Researchers**

**English (simple):**

- In the SRS, we show that **many papers are published every year**, and researchers lose time managing them.
- Our survey (32 people) found these main problems:
  - Hard to take and keep notes (46.9%)
  - Hard to find a paper later (40.6%)
  - Hard to keep papers organized (34.4%)
  - Sync between devices is not smooth (28.1%)
- Many people just read in the browser or use local folders and simple cloud storage. These do not give good search, metadata, or collaboration.

**Bangla (simple):**

- SRS-এ আমরা দেখিয়েছি যে **প্রতি বছর অনেক research paper বের হয়**, আর এগুলো manage করতে গবেষকদের অনেক সময় নষ্ট হয়।
- আমাদের survey (৩২ জন) এ যে main problem গুলো এসেছে:
  - নোট নেওয়া আর ধরে রাখা কষ্টকর (৪৬.৯%)
  - পরে নির্দিষ্ট পেপার খুঁজে পাওয়া কঠিন (৪০.৬%)
  - পেপারগুলো সাজিয়ে রাখা কঠিন (৩৪.৪%)
  - ডিভাইসের মধ্যে sync ঠিকমতো হয় না (২৮.১%)
- অনেকেই শুধু browser এ read করেন, local folder বা সাধারন cloud storage ব্যবহার করেন। এগুলোতে **ভালো search, metadata বা একসাথে কাজ করার সুবিধা নেই**।

---

### 1.3 Target Users & Current Stage (≈ 40 seconds)

**Where in SRS:**

- Chapter 1 → **Target Audience Demographics** table

**English (simple):**

- Our target users in the SRS are mainly **undergraduate students** (78.1%), age **22–25**, and many from **Computer Science**.
- We also focus on **UIU students** because they are a good beta testing group.
- For this project stage, **we are not serving real users yet**. We only use **demo/test users** and sample data to design and test the system.

**Bangla (simple):**

- SRS-এ আমাদের main target user group হল **undergraduate ছাত্র-ছাত্রী** (৭৮.১%), বয়স **২২–২৫**, এবং অনেকেই **কম্পিউটার সায়েন্স** থেকে।
- আমরা বিশেষভাবে **UIU ছাত্র-ছাত্রীদের** beta testing group হিসেবে ধরেছি।
- এই প্রজেক্টের এই ধাপে আমরা **বাস্তব user দের সার্ভ করছি না**। আমরা শুধু **demo/test user** আর sample data ব্যবহার করে design আর testing করছি।

---

### 1.4 Goals & KPIs (≈ 40 seconds)

**Where in SRS:**

- Chapter 1 → **Goal**, **Specific Goals**, **Success Metrics (KPIs)**

**English (simple):**

- ScholarFlow wants to be a **single hub** where you can store, search, read, annotate, and collaborate on papers.
- Important goals:
  - **Unified research hub** (one place instead of 3–5 tools)
  - **AI-powered discovery** (semantic search, AI summaries, multi-paper chat)
  - **Real-time collaboration** (workspaces, roles, shared collections)
- KPIs include:
  - 1,000 beta users in 6 months (later, when we really launch)
  - 60% weekly active on AI features
  - 40% less time on admin work

**Bangla (simple):**

- ScholarFlow-এর উদ্দেশ্য হল এমন একটি **একক হাব বানানো**, যেখানে এক জায়গা থেকেই **পেপার রাখা, খোঁজা, পড়া, নোট নেওয়া আর একসাথে কাজ করা যাবে**।
- কিছু গুরুত্বপূর্ণ goal:
  - **Unified research hub** – ৩–৫টা আলাদা টুলের বদলে একটাই প্ল্যাটফর্ম
  - **AI-powered search আর summary** – semantic search, AI summary, multi-paper chat
  - **Real-time collaboration** – workspace, role, shared collection
- আমাদের KPI গুলোর মধ্যে আছে:
  - ৬ মাসে ১০০০ beta user (future target)
  - AI feature-এ ৬০% weekly active
  - research admin কাজ ৪০% কমানো

---

### 1.5 System Study & Information Gathering (Chapter 2) (≈ 1.5 minutes)

**Where in SRS:**

- `srs-main.pdf` → **Chapter 2: System Study and Information Gathering**
  - Sections: Introduction, Information Sources, Internal Sources, External Sources, Google Forms Survey

**English (simple):**

- In Chapter 2, we explain **how we collected information** for designing ScholarFlow.
- We used:
  - **Primary research**: a survey with 32 respondents
  - **Stakeholder interviews**: students, faculty, research assistants
  - **Secondary research**: academic papers, industry reports, online communities
  - **Competitive analysis**: 5 tools like Zotero, Mendeley, Paperpile, Paperpal, ReadCube
- From UIU campus we got a strong base of respondents, which helps for **future beta testing**, even though right now our SRS is for **planning and design** with demo/test users.

**Bangla (simple):**

- Chapter 2-এ আমরা দেখিয়েছি যে **ScholarFlow ডিজাইন করার জন্য কীভাবে তথ্য সংগ্রহ করেছি**।
- আমরা ব্যবহার করেছি:
  - **Primary research** – ৩২ জনকে নিয়ে survey
  - **Stakeholder interview** – ছাত্র, শিক্ষক, research assistant
  - **Secondary research** – research paper, industry report, online forum
  - **Competitive analysis** – Zotero, Mendeley, Paperpile, Paperpal, ReadCube এর মত ৫টি টুলের সাথে তুলনা
- UIU campus থেকে আমরা অনেক response পেয়েছি, যা ভবিষ্যতে **beta testing**-এ কাজে লাগবে। তবে এখনকার ধাপে SRS শুধু **planning আর design** এর জন্য, আর system-এ **demo/test user** ব্যবহার হচ্ছে।

**Smooth handover line to Presenter 2:**

- English: “This was the overview of our introduction and system study. Now [Presenter 2] will explain the system analysis from Chapter 3.”
- Bangla: “এই ছিল আমাদের introduction আর system study-এর overview। এখন [Presenter 2] Chapter 3 থেকে system analysis অংশ বুঝিয়ে বলবে।”

---

## Presenter 2 – Chapter 3: System Analysis (≈ 3 minutes)

### 2.1 System Analysis Intro (≈ 30 seconds)

**Where in SRS:**

- `srs-main.pdf` → **Chapter 3: System Analysis**, Introduction

**English (simple):**

- I will talk about **Chapter 3: System Analysis**.
- Here we compare ScholarFlow with other tools, check the gaps, do SWOT analysis, and see if the project is **feasible** (technically, economically, and operationally).

**Bangla (simple):**

- আমি এখন **Chapter 3: System Analysis** নিয়ে বলব।
- এখানে আমরা ScholarFlow কে অন্য টুলগুলোর সাথে তুলনা করেছি, কোথায় gap আছে দেখিয়েছি, SWOT analysis করেছি, আর প্রজেক্টটি **টেকনিক্যালি, অর্থনৈতিকভাবে, আর অপারেশনালি feasible কিনা** তা দেখেছি।

---

### 2.2 Gap Analysis (≈ 60 seconds)

**Where in SRS:**

- Chapter 3 → **Gap Analysis**, tables for competitor limitations vs ScholarFlow

**English (simple):**

- We found some key gaps in existing tools like Zotero, Mendeley, Paperpile, Paperpal, and ReadCube:
  - **AI Integration gap**: almost no semantic search or AI summaries
  - **Modern UX gap**: many tools have old or complex interfaces
  - **Collaboration gap**: weak real-time collaboration and shared workspaces
- ScholarFlow plans to fill these gaps with:
  - AI-first design (semantic search, summaries, multi-paper chat)
  - Modern UI (dark mode, responsive web app)
  - Collaboration-native features (workspaces, roles, collections)

**Bangla (simple):**

- আমরা Zotero, Mendeley, Paperpile, Paperpal, ReadCube এর মত টুলগুলোর মধ্যে কিছু বড় gap পেয়েছি:
  - **AI integration gap** – semantic search বা AI summary প্রায় নেই
  - **Modern UX gap** – অনেকের interface পুরনো বা জটিল
  - **Collaboration gap** – real-time একসাথে কাজ করার সুবিধা কম
- ScholarFlow এই gap গুলো পূরণ করতে চায়:
  - **AI-first design** – semantic search, summary, multi-paper chat
  - **Modern UI** – dark mode, responsive ওয়েব অ্যাপ
  - **Collaboration-native features** – workspace, role, collection

---

### 2.3 SWOT Summary (≈ 50 seconds)

**Where in SRS:**

- Chapter 3 → **SWOT Analysis** tables

**English (simple):**

- **Strengths:** AI-first architecture, modern stack, clear focus on students, and flexible pricing.
- **Weaknesses:** New project, no real users yet, depends on third-party AI services.
- **Opportunities:** Many people are unhappy with old tools, and students now expect AI and modern UX.
- **Threats:** Strong existing tools, AI cost and limits, and security/compliance requirements.

**Bangla (simple):**

- **Strengths:** AI-first architecture, modern টেকনোলজি stack, student focus, flexible pricing।
- **Weaknesses:** নতুন প্রজেক্ট, এখনও real user নেই, third-party AI সার্ভিসের উপর নির্ভরশীল।
- **Opportunities:** অনেকেই পুরনো টুল নিয়ে অসন্তুষ্ট, আর ছাত্র-ছাত্রীরা এখন AI আর modern UX আশা করে।
- **Threats:** পুরনো শক্তিশালী টুলগুলো, AI-এর খরচ আর limit, security/compliance-এর requirement।

> When you say “no real users yet”, connect it clearly to our current stage: **we are using only demo/test users during development**.

---

### 2.4 Feasibility (≈ 40 seconds)

**Where in SRS:**

- Chapter 3 → **Feasibility Assessment** (Technical, Economic, Operational)

**English (simple):**

- Technical feasibility is **high** because we use known technologies like Next.js, Express.js, PostgreSQL, AWS S3, and we already have a working prototype.
- Economic feasibility is **reasonable** because we can start small on cloud and then grow with paid plans.
- Operational feasibility is **high** because the team is clear, phases are planned, and UIU can help as the first testing ground with demo users.

**Bangla (simple):**

- টেকনিক্যাল দিক থেকে প্রজেক্টটি **highly feasible**, কারণ আমরা Next.js, Express.js, PostgreSQL, AWS S3 এর মত পরিচিত টেকনোলজি ব্যবহার করছি, আর prototype already করা হয়েছে।
- অর্থনৈতিক দিক থেকে feasibility **ভালো**, কারণ প্রথমে ছোট আকারে cloud এ শুরু করা যাবে, পরে paid প্ল্যান দিয়ে বড় করা যাবে।
- অপারেশনাল দিক থেকে feasibility **উচ্চ**, কারণ টিম clear, phase-wise প্ল্যান আছে, আর UIU demo user দিয়ে প্রথমে testing help করতে পারবে।

**Smooth handover line to Presenter 3:**

- English: “This was our system analysis. Now [Presenter 3] will explain the system design diagrams from Chapter 4.”
- Bangla: “এই ছিল আমাদের system analysis অংশ। এখন [Presenter 3] Chapter 4 থেকে system design diagram গুলো ব্যাখ্যা করবে।”

---

## Presenter 3 – Chapter 4: System Design (≈ 3.5 minutes)

### 3.1 Design Overview (≈ 30 seconds)

**Where in SRS:**

- `srs-main.pdf` → **Chapter 4: System Design**, Overview

**English (simple):**

- I will talk about **Chapter 4: System Design**.
- This chapter shows 6 main diagrams: **Context diagram, Use case diagram, Data flow diagram, Activity diagram, ERD, and Relational schema diagram**.

**Bangla (simple):**

- আমি এখন **Chapter 4: System Design** নিয়ে বলব।
- এই chapter-এ ৬টি main diagram আছে: **Context diagram, Use case diagram, Data flow diagram, Activity diagram, ERD, আর Relational schema diagram**।

---

### 3.2 Context Diagram (≈ 40 seconds)

**Where in SRS:**

- Chapter 4 → **Context Diagram**, figure “ScholarFlow Context Diagram”

**English (simple):**

- The context diagram shows ScholarFlow as one big system and **who interacts with it**.
- Main actors: **Guest user** and **Authenticated user**.
- External services: OAuth providers, Email service, Stripe, AI providers, AWS S3.
- This diagram proves that our system design covers **authentication, storage, AI, and payment** clearly.

**Bangla (simple):**

- Context diagram-এ ScholarFlow কে একটি বড় system হিসেবে দেখানো হয়েছে, আর **কারা এর সাথে interact করে** তা দেখানো আছে।
- Main actor: **Guest user** আর **Authenticated user**।
- বাইরের সার্ভিস: OAuth provider, Email service, Stripe, AI provider, AWS S3।
- এই diagram দেখায় যে আমাদের design এ **authentication, storage, AI আর payment** স্পষ্টভাবে কভার করা হয়েছে।

---

### 3.3 Use Case Diagram & Main Use Cases (≈ 60 seconds)

**Where in SRS:**

- Chapter 4 → **Use Case Diagram with Descriptive Forms**, tables UC-01 to UC-05

**English (simple):**

- The use case diagram shows what a user can do in the system.
- Main use cases:
  - **UC-01: Register / Login** – create account, login with email or OAuth
  - **UC-02: Upload Paper** – upload PDF, validate file, store metadata
  - **UC-03: Create Workspace & Invite Members** – share with others, set roles
  - **UC-04: Create Collection & Add Papers** – group papers into collections
  - **UC-05: Generate AI Summary** – call AI provider and save summary
- In our current stage, we may use **demo accounts and demo papers** to test these flows.

**Bangla (simple):**

- Use case diagram-এ user system-এ কী কী কাজ করতে পারে, তা দেখানো হয়েছে।
- Main use case গুলো:
  - **UC-01: Register / Login** – account তৈরি, email বা OAuth দিয়ে লগইন
  - **UC-02: Upload Paper** – PDF upload, ফাইল যাচাই, metadata save
  - **UC-03: Create Workspace & Invite Members** – অন্যদের সাথে share, role সেট করা
  - **UC-04: Create Collection & Add Papers** – একাধিক পেপারকে collection এ রাখা
  - **UC-05: Generate AI Summary** – AI দিয়ে summary বানানো ও save করা
- এই ধাপে আমরা এগুলো **demo account আর demo paper** ব্যবহার করে test করছি।

---

### 3.4 Data Flow & Activity (≈ 50 seconds)

**Where in SRS:**

- Chapter 4 → **Data Flow Diagram (DFD)**, **Activity Diagram**

**English (simple):**

- The DFD shows how **data moves** between user, API, database, and storage.
- Important flows:
  - Authentication and session handling
  - Paper upload → AWS S3 + database record
  - AI summarization → send text to AI, get summary back
- The activity diagram focuses on **paper upload**:
  - Choose file → validate file and fields → store in S3 and DB → show success.

**Bangla (simple):**

- DFD diagram দেখায় **data কীভাবে user, API, database আর storage-এর মধ্যে চলাচল করে**।
- গুরুত্বপূর্ণ flow:
  - Authentication আর session handling
  - Paper upload → AWS S3 + database record
  - AI summarization → text AI-এর কাছে পাঠানো, summary ফিরে পাওয়া
- Activity diagram মূলত **paper upload** process দেখায়:
  - ফাইল বাছাই করা → ফাইল আর ফিল্ড যাচাই → S3 আর DB তে save → success দেখানো।

---

### 3.5 ERD & Schema (≈ 45 seconds)

**Where in SRS:**

- Chapter 4 → **ERD and Schema Diagrams**, figures “ScholarFlow ERD”, “ScholarFlow Schema Diagram”

**English (simple):**

- The ERD and schema show how our database is designed.
- Main tables/entities: **User, Workspace, WorkspaceMember, Paper, Collection, PaperCollection, Account, Session**.
- They support **collaboration**, **paper management**, and **AI artifacts**.
- In the testing phase, we fill these tables with **demo/test data** only.

**Bangla (simple):**

- ERD আর schema diagram-এ আমাদের database design দেখানো হয়েছে।
- Main টেবিল/এনটিটি: **User, Workspace, WorkspaceMember, Paper, Collection, PaperCollection, Account, Session**।
- এগুলো দিয়ে **collaboration**, **paper management** আর **AI সম্পর্কিত ডাটা** সাপোর্ট করা হয়।
- Testing phase-এ আমরা এই টেবিলগুলো **demo/test data** দিয়ে পূরণ করি।

---

### 3.6 Closing (≈ 30 seconds)

**English (simple):**

- To summarize, our SRS defines the problem, validates the need with data, compares existing tools, and proposes a detailed design for ScholarFlow.
- Right now, we are in the **building and testing phase** with **demo/test users only**.
- In the future, we can move to real users and production deployment.

**Bangla (simple):**

- সারসংক্ষেপে, আমাদের SRS problem define করেছে, ডাটা দিয়ে need প্রমাণ করেছে, বিদ্যমান টুলগুলোর সাথে তুলনা করেছে, আর ScholarFlow-এর জন্য একটা বিস্তারিত design দিয়েছে।
- এখন আমরা **building আর testing phase** এ আছি, যেখানে শুধুই **demo/test user** ব্যবহার করছি।
- ভবিষ্যতে আমরা real user নিয়ে production এ যেতে পারব।

**Optional last line:**

- English: “Thank you. If you have any questions, we are ready to answer.”
- Bangla: “ধন্যবাদ। আপনাদের যদি কোনো প্রশ্ন থাকে, আমরা উত্তর দিতে প্রস্তুত।”

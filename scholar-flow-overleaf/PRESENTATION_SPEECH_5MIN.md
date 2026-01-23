# ScholarFlow SRS Presentation Speech (5 Minutes)

**Total Time:** 5 minutes  
**Presenters:** 3  
**Material:** `srs-main.pdf` only

> **Important:** All presenters should mention that we are using **demo/test users only** in this building stage.

---

## Presenter 1 — Sourov (≈ 1.5 min)

**Topic:** Chapter 1 — Introduction

### Speech

Good morning. My name is **Sourov**. I will start our presentation.

Our project name is **ScholarFlow**. It is an **AI-powered research paper collaboration hub**.

#### The Problem

Researchers and students use many tools and folders, so they **lose time** managing papers, notes, and files.

In our survey, people said the biggest issues are:

- **Taking notes** is hard
- **Finding a paper later** is difficult
- **Keeping papers organized** is challenging

#### Our Solution

ScholarFlow solves this by giving **one place** to:

- Upload papers
- Store metadata
- Search fast
- Collaborate in a workspace

#### Important Note

In this stage, we are using **demo/test users only**, not real production users.

#### Our Goals

Our goals are simple:

1. **Store and organize papers**
2. **Smart search and AI help**
3. **Teamwork with workspaces and collections**

### Handover

Now **Presenter 2** will explain the study and analysis part.

---

## Presenter 2 — Atik (≈ 1.5 min)

**Topic:** Chapter 2 + Chapter 3 — System Study & Analysis

### Speech

#### Chapter 2: How We Collected Information

We explain how we collected information:

- **Survey** with 32 respondents
- **Stakeholder interviews**
- **Secondary research**
- **Comparing existing tools**

We studied tools like:

- Zotero
- Mendeley
- EndNote
- Paperpile
- ReadCube

#### Chapter 3: Gap Analysis

From System Analysis, we found clear gaps:

**What's Missing in Existing Tools:**

- Many tools have **weak collaboration**
- Most tools have **no AI summary** or **no AI chat**
- Some tools have **old UI** or **paid-only features**

**ScholarFlow's Advantages:**

ScholarFlow combines:

- **Modern web experience**
- **Teamwork features** (workspaces and collections)
- **AI features** for faster understanding of papers

#### Testing Stage

Again, we are testing these flows with **demo/test users only**.

### Handover

Now **Presenter 3** will cover the most important part: **diagrams and system design**.

---

## Presenter 3 — Salman (≈ 2 min)

**Topic:** Chapter 4 + Chapter 5 — System Design Diagrams & UI

### Speech

I will focus on the **diagrams**, because they show how the whole system works.

---

#### 1) Context Diagram

**[Point to the Context Diagram]**

Here, **ScholarFlow is in the center**.

- Users access the **Web App** (Next.js)
- The Web App talks to the **API** (Express)
- The API connects to:
  - **PostgreSQL** for data
  - **AWS S3** for paper files
  - **OAuth** for login (Google, GitHub)
  - **Email** for verification and password reset
  - **Stripe** for billing
  - **AI provider** for summary and insights

This diagram shows all external services clearly.

---

#### 2) Use Case Diagram

**[Point to the Use Case Diagram]**

This shows what users can do:

- **Register/Login**
- **Upload paper**
- **Create workspace**
- **Create collection**
- **Generate AI summary**

It is a quick view of system features from the user side.

---

#### 3) DFD + Activity Diagram

**[Point to DFD]**

- **DFD** shows how data moves:  
  Request → API → Database/S3/AI → Response

**[Point to Activity Diagram]**

- **Activity diagram** shows the upload steps:  
  Validate file → Store → Save metadata → Success

---

#### 4) ERD / Schema Diagram

**[Point to ERD/Schema]**

This shows the **database design**:

- Users
- Workspaces
- Papers
- Collections
- AI summaries

All are connected properly.

---

#### 5) Chapter 5: UI Screens

**[Point to 2–3 screenshots]**

These screens show the real user flow:

1. **Sign In**
2. **Dashboard**
3. **Paper Upload**
4. **Paper Details**
5. **Editor**
6. **AI Insights**
7. **Shared Workspace**

The UI matches the diagrams and the features in the SRS.

---

### Closing

To summarize:

- We defined the problem
- We validated the need with survey data
- We compared existing tools and found gaps
- We designed a complete system with diagrams and UI

**Right now, we are in the building phase with demo/test users only.**

Thank you. If you have any questions, we are ready to answer.

---

## Tips for All Presenters

### Body Language

- Stand straight
- Make eye contact with the audience
- Point to diagrams when mentioning them
- Use natural hand gestures (not too much)
- Smile at the beginning

### Speaking Tips

- Speak slowly and clearly
- Pause after each main point
- Don't rush through diagrams
- If you forget a word, take a breath and continue

### Diagram Presentation (Presenter 3)

When showing a diagram:

1. **Say the diagram name first** ("This is the Context Diagram")
2. **Point to it briefly**
3. **Explain the main parts** (don't explain every detail)
4. **Turn back to the audience** while speaking

### Time Management

- **Presenter 1:** 1.5 minutes (90 seconds)
- **Presenter 2:** 1.5 minutes (90 seconds)
- **Presenter 3:** 2 minutes (120 seconds)
- **Total:** 5 minutes (300 seconds)

If you go over time, skip the "SWOT" or "Goals" bullet points, but **always mention demo/test users**.

---

## Quick Reference: Key Diagrams to Show

### Must Show (Presenter 3):

1. ✅ **Context Diagram** — external services (30 sec)
2. ✅ **Use Case Diagram** — user actions (20 sec)
3. ✅ **DFD + Activity** — data flow (20 sec)
4. ✅ **ERD/Schema** — database design (20 sec)
5. ✅ **UI Screenshots** — real interface (30 sec)

### Optional (if time permits):

- Sequence Diagram
- State Diagram
- Class Diagram

---

## Bengali Translation Key Phrases

If you need to switch to Bengali for certain phrases:

- **আমাদের প্রজেক্টের নাম ScholarFlow** — Our project name is ScholarFlow
- **AI-চালিত research paper collaboration hub** — AI-powered research paper collaboration hub
- **Demo/test user ব্যবহার করছি** — Using demo/test users
- **Context diagram** — কন্টেক্সট ডায়াগ্রাম
- **Use case diagram** — ইউজ কেস ডায়াগ্রাম
- **Database design** — ডাটাবেস ডিজাইন

---

**Last Updated:** January 23, 2026  
**Version:** 1.0 (5-minute speech)

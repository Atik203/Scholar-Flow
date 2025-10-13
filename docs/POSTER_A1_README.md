# ScholarFlow — A1 Poster Content Guide (Canva)

Elevator pitch: AI-powered research paper collaboration hub. Upload, process, search, organize, annotate, and collaborate on papers with smart AI summaries, role-based workspaces, collections, and citation insights.

---

## 1) Title Block

- Project: ScholarFlow
- Tagline: AI-Powered Research Paper Collaboration Hub
- Demo Links:
  - Frontend: [scholar-flow-ai.vercel.app](https://scholar-flow-ai.vercel.app)
  - API Health: [scholar-flow-api.vercel.app/api/health](https://scholar-flow-api.vercel.app/api/health)
    GitHub Repo ([github.com/Atik203/Scholar-Flow](https://github.com/Atik203/Scholar-Flow))

---

## 2) Introduction

ScholarFlow streamlines academic workflows end-to-end: from ingesting PDFs/DOCX to extracting metadata and text, organizing into collections, searching instantly, and collaborating with AI-powered insights. It’s built as a production-grade monorepo with a modern UI and secure backend.

---

## 3) Motivation & Problem Statement

- Fragmented tooling for reading, searching, and collaborating on papers
- Manual metadata extraction and weak search over PDFs
- Difficult sharing and permission management across teams
- No integrated AI assistant to summarize and discuss papers with context

Objectives:

- Centralize paper management with fast search and robust permissions
- Automate metadata extraction and previews; enable structured knowledge
- Add AI summarization and contextual chat on paper content
- Provide production-grade reliability, performance, and security

---

## 4) Tech Stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, Redux Toolkit Query, NextAuth
- Backend: Express.js (TypeScript), PostgreSQL + Prisma ORM, JWT + bcrypt, Zod
- Storage: AWS S3; PGVector-ready for embeddings
- Infra: Turborepo, Yarn Berry (v4), Vercel (FE), Railway/Render (BE)
- Monitoring: Health checks, performance headers, admin metrics dashboard

---

## 5) System Overview (Architecture)

- App Router frontend (Next.js) communicates with an Express API
- PostgreSQL stores users, sessions, workspaces, papers, files, chunks, collections
- S3 stores raw files and previews
- AI services provide summarization/insights
- Stripe powers subscriptions and plan gating

Diagram tip (for Canva):

- Left column: Users → Next.js UI → Express API
- Middle: PostgreSQL (schema blocks) + S3 bucket
- Right: AI Services + Stripe; arrows for data flow and webhooks

---

## 6) ERD Snapshot (Phase 1)

Key entities and relationships:

- User 1:M Account, Session, UserToken
- User 1:M Paper, Collection, Workspace
- Paper 1:1 PaperFile; Paper 1:M PaperChunk; Paper M:M Collection (via CollectionPaper)
- Workspace 1:M WorkspaceMember, Paper, Collection
- Collection 1:M CollectionPaper, CollectionMember

Full details: see `docs/ERD.md` (with Lucidchart links) and `docs/Phase-1-schema.md`.

---

## 7) Schema Highlights (Core Tables)

- User(id, email, name, role, …)
- Paper(id, workspaceId, uploaderId, title, abstract, metadata, doi, processingStatus, …)
- PaperFile(id, paperId, storageProvider, objectKey, contentType, sizeBytes, …)
- PaperChunk(id, paperId, idx, page, content, tokenCount, …)
- Collection(id, workspaceId, ownerId, name, isPublic, …)
- CollectionPaper(id, collectionId, paperId, addedById, addedAt, …)
- Workspace(id, ownerId, name, …), WorkspaceMember(id, workspaceId, userId, role, …)
- Session/Account (NextAuth compatible)
- AISummary (paperId, model, summary, promptHash)
- Payment/Subscription/Plan (Stripe-backed in Phase 1+)

---

## 8) Core Features (Weeks 1–7 Complete)

- Authentication & Profiles: Google/GitHub OAuth + email/password; JWT sessions; password reset; email verification
- Paper Upload & Processing: S3 storage, PDF/DOCX ingest, metadata & text extraction, secure preview
- Advanced Search: Full-text search with rich filters (author/date/type/keywords)
- Collections & Sharing: CRUD, assign papers, privacy controls, member permissions
- Workspace Management: Role-based access (OWNER/ADMIN/TEAM_LEAD/PRO_RESEARCHER/RESEARCHER), invitations
- AI Summarization & Chat: Multi-provider (Gemini/OpenAI), context-aware insight chat
- Admin Monitoring: Real-time CPU/memory/storage/DB metrics, health endpoints, response-time headers
- Billing & Subscriptions: Stripe Checkout, webhooks, plan-aware role gates, customer portal
- Citation System: Reference parsing and citation graph visualization (Week 7)

---

## 9) Complex Raw SQL Queries (Selected)

Note: Parameterized via Prisma `$queryRaw` with tagged templates (no string concatenation).

1. Create paper + file in one transaction (CTE)

```sql
WITH inserted_paper AS (
  INSERT INTO "Paper" (
    id, "workspaceId", "uploaderId", title, metadata, source,
    "processingStatus", "createdAt", "updatedAt", "isDeleted"
  ) VALUES (
    gen_random_uuid(),
    ${workspaceId},
    ${uploaderId},
    ${title},
    ${metadata}::jsonb,
    ${source},
    'UPLOADED'::"PaperProcessingStatus",
    NOW(), NOW(), false
  )
  RETURNING id, "workspaceId", "uploaderId", title, abstract, metadata,
            source, doi, "processingStatus", "createdAt", "updatedAt"
),
inserted_file AS (
  INSERT INTO "PaperFile" (
    id, "paperId", "storageProvider", "objectKey", "contentType",
    "sizeBytes", "originalFilename", "createdAt", "updatedAt", "isDeleted"
  ) SELECT gen_random_uuid(), p.id, 's3', ${objectKey}, ${mime}, ${size},
           ${originalName}, NOW(), NOW(), false
    FROM inserted_paper p
  RETURNING id, "paperId", "storageProvider", "objectKey"
)
SELECT p.*, f.id AS file_id, f."storageProvider", f."objectKey"
FROM inserted_paper p
LEFT JOIN inserted_file f ON f."paperId" = p.id;
```

1. List user workspaces with stats (CTE + aggregates)

```sql
WITH filtered_workspaces AS (
  SELECT w.*
  FROM "Workspace" w
  JOIN "WorkspaceMember" m ON m."workspaceId" = w.id AND m."isDeleted" = false
  WHERE m."userId" = ${userId}
    AND w."isDeleted" = false
    AND (${owned} = false OR w."ownerId" = ${userId})
    AND (${shared} = false OR w."ownerId" != ${userId})
)
SELECT
  fw.*,
  (fw."ownerId" = ${userId})::boolean AS "isOwner",
  COALESCE(member_counts.member_count, 0)::int AS "memberCount",
  COALESCE(collection_counts.collection_count, 0)::int AS "collectionCount",
  COALESCE(paper_counts.paper_count, 0)::int AS "paperCount"
FROM filtered_workspaces fw
LEFT JOIN (
  SELECT "workspaceId", COUNT(*)::int AS member_count
  FROM "WorkspaceMember" WHERE "isDeleted" = false GROUP BY "workspaceId"
) member_counts ON member_counts."workspaceId" = fw.id
LEFT JOIN (
  SELECT "workspaceId", COUNT(*)::int AS collection_count
  FROM "Collection" WHERE "isDeleted" = false GROUP BY "workspaceId"
) collection_counts ON collection_counts."workspaceId" = fw.id
LEFT JOIN (
  SELECT "workspaceId", COUNT(*)::int AS paper_count
  FROM "Paper" WHERE "isDeleted" = false GROUP BY "workspaceId"
) paper_counts ON paper_counts."workspaceId" = fw.id
ORDER BY fw."createdAt" DESC
LIMIT ${limit} OFFSET ${skip};
```

1. Paginated paper list for a user (JOIN + pagination)

```sql
SELECT p.id, p."workspaceId", p."uploaderId", p.title, p.abstract, p.metadata,
       p.source, p.doi, p."processingStatus", p."createdAt", p."updatedAt",
       pf.id AS file_id, pf."storageProvider", pf."objectKey", pf."contentType",
       pf."sizeBytes", pf."originalFilename", pf."extractedAt"
FROM "Paper" p
LEFT JOIN "PaperFile" pf ON p.id = pf."paperId"
WHERE p."uploaderId" = ${userId} AND p."isDeleted" = false
ORDER BY p."createdAt" DESC
LIMIT ${limit} OFFSET ${skip};
```

1. Auth: get session by token with user join

```sql
SELECT s."sessionToken", s."userId", s.expires, s."createdAt" AS "sessionCreatedAt",
       u.id AS "userId", u.email, u.name, u.image, u.role, u."emailVerified"
FROM "Session" s
LEFT JOIN "User" u ON s."userId" = u.id
WHERE s."sessionToken" = ${sessionToken}
LIMIT 1;
```

1. Permission check for workspace updates (role or owner)

```sql
SELECT m.role, w."ownerId"
FROM "WorkspaceMember" m
JOIN "Workspace" w ON w.id = m."workspaceId"
WHERE m."userId" = ${userId}
  AND m."workspaceId" = ${workspaceId}
  AND m."isDeleted" = false
  AND w."isDeleted" = false;
```

---

## 10) Security, Performance, and Reliability

- Validation: Zod on all inputs; guarded controllers with `catchAsync` + `ApiError`
- AuthZ: Role-based permissions across workspaces, collections, admin
- Rate limiting: Applied to upload/list/mutation-heavy endpoints
- DB Optimization: Composite indexes for hot paths; parameterized raw SQL only
- Monitoring: Health endpoints (/api/health, /api/health/detailed, /live, /ready); response-time headers
- PWA & Caching: Service worker, ETags; lazy-loading and code splitting

---

## 11) Results (MVP)

- End-to-end paper pipeline with secure storage and preview
- Rich editor with export (PDF/DOCX), image upload to S3
- AI summarization + context-aware chat for papers
- Admin monitoring dashboard and Stripe subscriptions live

---

## 12) Timeline (Weeks 1–7)

- Week 1: Monorepo, stack setup, auth foundations — Done
- Week 2–3: Auth UX, profile, paper upload + processing — Done
- Week 4–5: Collections, workspaces, advanced search, UI polish — Done
- Week 6: Admin monitoring, performance hardening, billing/Stripe — Done
- Week 7: Citation system (parse references, citation graph) — Done

Upcoming:

- Weeks 8–10: Team collaboration & activity feed
- Weeks 11–12: Versioning & mobile polish
- Weeks 13–14: Advanced AI assistant and optimization

---

## 13) How to Use This in Canva

- Canvas Size: A1 (594 × 841 mm). In pixels for print (300 DPI): 7016 × 9933 px.
- Margins: Safe area 15–20 mm; Bleed 3 mm if printing.
- Grid: 3 or 4 columns with 12–20 mm gutters; align blocks consistently.
- Typography: Headings 80–120 pt; section heads 48–64 pt; body 28–34 pt; captions 24–26 pt.
- Fonts: Pair a bold geometric sans for headings (e.g., Outfit, Poppins) with a highly legible sans for body (Inter).
- Colors: Neutral base (white/near-white) + brand primary blue + 1 accent; maintain AA contrast.
- Visuals:
  - Architecture diagram (simple boxes and arrows)
  - ERD snapshot (export from Lucid/Prisma ERD tool)
  - Screenshots: Dashboard, paper detail, AI chat, billing
  - 2 QR codes (Live App, GitHub)
- Export: PDF for print (300 DPI) and PNG for digital. Verify text legibility at 1 m viewing distance.

---

## 14) Credits & Contact

- Author/Maintainer: Md. Atikur Rahaman (GitHub: @Atik203)
- Contributors: Salman + team (where applicable)
- Contact: [atikurrahaman0305@gmail.com](mailto:atikurrahaman0305@gmail.com)

Notes: Use `docs/ERD.md` and `docs/Phase-1-schema.md` for high-res ERD/schema exports. Ensure QR codes point to live demo and repo.

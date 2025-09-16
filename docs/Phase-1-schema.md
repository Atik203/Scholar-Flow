## Phase 1 Prisma Schema (Presentation)

This document captures the trimmed Phase 1 schema used for presentation and ERD generation. It keeps the core MVP features: auth, users, papers/files/chunks, collections, basic annotations, search history, AI summaries, and basic payments. Teams/workspaces, citations, activity logs, and advanced annotation versioning/threads are out of scope for Phase 1.

- Included: `User`, `Account`, `Session`, `VerificationToken`, `Paper`, `PaperFile`, `PaperChunk`, `Annotation`, `Collection`, `CollectionPaper`, `SearchHistory`, `AISummary`, `Payment`.
- Excluded for Phase 1: `Workspace`, `WorkspaceMember`, `CollectionMember`, `Citation`, `ActivityLog`, `Plan`/`Subscription`/`WebhookEvent` (we keep a simple `Payment` table only).

Note: For ERD tooling compatibility, `PaperChunk.embedding` is represented as `String?`. In development, switch it to a pgvector column with `Unsupported("vector")?` and enforce a single, consistent dimension at insertion time.

### Prisma schema (ERD-friendly)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  RESEARCHER
  PRO_RESEARCHER
  TEAM_LEAD
  ADMIN
}

enum AnnotationType {
  HIGHLIGHT
  COMMENT
  NOTE
}

enum PaymentProvider {
  STRIPE
  SSLCOMMERZ
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  REFUNDED
}

model User {
  id    String  @id @default(uuid())
  email String  @unique
  name  String?
  image String?
  role  Role    @default(RESEARCHER)

  // Auth
  accounts Account[]
  sessions Session[]

  // App
  uploadedPapers  Paper[]           @relation("PaperUploader")
  annotations     Annotation[]
  collections     Collection[]      @relation("CollectionOwner")
  searchHistory   SearchHistory[]

  // Payments
  payments Payment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)
}

model Paper {
  id         String  @id @default(uuid())
  uploaderId String
  title      String
  abstract   String?
  metadata   Json
  source     String?
  doi        String? @unique

  uploader        User              @relation("PaperUploader", fields: [uploaderId], references: [id])
  file            PaperFile?
  chunks          PaperChunk[]
  annotations     Annotation[]
  collectionJoins CollectionPaper[]
  aiSummaries     AISummary[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([uploaderId])
}

model PaperFile {
  id              String  @id @default(uuid())
  paperId         String  @unique
  storageProvider String
  objectKey       String
  contentType     String?
  sizeBytes       Int?
  pageCount       Int?
  checksum        String?

  paper Paper @relation(fields: [paperId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)
}

model PaperChunk {
  id         String  @id @default(uuid())
  paperId    String
  idx        Int
  page       Int?
  content    String
  embedding  String?
  tokenCount Int?

  paper Paper @relation(fields: [paperId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@unique([paperId, idx])
  @@index([paperId])
}

model Annotation {
  id      String         @id @default(uuid())
  paperId String
  userId  String
  type    AnnotationType @default(HIGHLIGHT)
  anchor  Json
  text    String

  paper Paper @relation(fields: [paperId], references: [id])
  user  User  @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([paperId])
  @@index([userId])
}

model Collection {
  id          String  @id @default(uuid())
  ownerId     String
  name        String
  description String?
  isPublic    Boolean @default(false)

  owner  User @relation("CollectionOwner", fields: [ownerId], references: [id])
  papers CollectionPaper[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([ownerId])
}

model CollectionPaper {
  id           String   @id @default(uuid())
  collectionId String
  paperId      String
  addedAt      DateTime @default(now())

  collection Collection @relation(fields: [collectionId], references: [id])
  paper      Paper      @relation(fields: [paperId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@unique([collectionId, paperId])
  @@index([paperId])
}

model SearchHistory {
  id      String @id @default(uuid())
  userId  String
  query   String
  filters Json?
  results Json?

  user User @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([userId, createdAt])
}

model AISummary {
  id         String @id @default(uuid())
  paperId    String
  model      String
  summary    String
  promptHash String

  paper Paper @relation(fields: [paperId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@unique([paperId, model, promptHash])
}

// ---- Payments (basic) ----

model Payment {
  id             String          @id @default(uuid())
  userId         String
  provider       PaymentProvider
  amountCents    Int
  currency       String
  transactionId  String          @unique
  status         PaymentStatus
  raw            Json?

  user User @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([userId, createdAt])
}

// ---- Auth (NextAuth-compatible) ----

model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)
}

model VerificationToken {
  id         String   @id @default(uuid())
  identifier String
  token      String   @unique
  expires    DateTime

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@unique([identifier, token])
}
```

### Relationships explained

- User
  - accounts, sessions: One user has many `Account` and `Session` records (Auth). Deleting a user cascades to these via relation config on the child side.
  - uploadedPapers: One-to-many to `Paper` via `Paper.uploaderId`.
  - annotations: One-to-many to `Annotation` via `Annotation.userId`.
  - collections: One-to-many to `Collection` via `Collection.ownerId`.
  - searchHistory: One-to-many to `SearchHistory` via `SearchHistory.userId`.
  - payments: One-to-many to `Payment` via `Payment.userId`.

- Paper
  - uploader: Many-to-one to `User` (the back-relation of `uploadedPapers`). Indexed by `uploaderId`.
  - file: One-to-one to `PaperFile` (enforced by unique `paperId` on `PaperFile`).
  - chunks: One-to-many to `PaperChunk`.
  - annotations: One-to-many to `Annotation`.
  - collectionJoins: Many-to-many with `Collection` realized through `CollectionPaper`.
  - aiSummaries: One-to-many to `AISummary`. Uniqueness of a summary per `(paperId, model, promptHash)`.

- PaperFile
  - paper: Many-to-one to `Paper`, but `paperId @unique` enforces a strict one-to-one pairing (each paper has at most one file row).

- PaperChunk
  - paper: Many-to-one to `Paper`. Composite unique `@@unique([paperId, idx])` ensures an ordered, deduplicated chunk list per paper.

- Annotation
  - paper: Many-to-one to `Paper`.
  - user: Many-to-one to `User`.
  - No threading/versioning in Phase 1 to keep UI/logic simple.

- Collection
  - owner: Many-to-one to `User` via `ownerId`.
  - papers: Many-to-many with `Paper` via join table `CollectionPaper`.

- CollectionPaper (join table)
  - collection: Many-to-one to `Collection`.
  - paper: Many-to-one to `Paper`.
  - Composite unique `@@unique([collectionId, paperId])` prevents duplicate association.

- SearchHistory
  - user: Many-to-one to `User`. Indexed by `(userId, createdAt)` for quick recent history lookups.

- AISummary
  - paper: Many-to-one to `Paper`. Composite unique prevents storing duplicate summaries for the same paper/model/prompt variant.

- Payment (basic)
  - user: Many-to-one to `User`. `transactionId @unique` ensures idempotency per provider transaction; indexed by `(userId, createdAt)` for reporting/history.

### ERD generation

- Paste the schema into the Prisma ERD tool: [Prisma 👉 ER Diagram](https://prisma-erd.simonknott.de/)
- For development, change `PaperChunk.embedding` to `Unsupported("vector")?` and ensure the database has the `vector` extension installed. Keep the ERD version as `String?` if the tool has trouble parsing pgvector types.

# Prisma Data Model

Canonical Prisma schema extracted from the main README for easier maintenance and IDE highlighting.

> Note: Runtime schema (including pgvector and TypedSQL preview features) may evolve. Always check `apps/backend/prisma/schema.prisma` for the authoritative version used by the application.

```prisma
// Prisma schema for Scholar-Flow (Postgres + pgvector)
// - All ids are String UUIDs
// - Every model includes createdAt, updatedAt, isDeleted

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
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

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELED
  PAST_DUE
}

enum PlanTier {
  FREE
  PRO
  INSTITUTIONAL
}

model User {
  id    String  @id @default(uuid())
  email String  @unique
  name  String?
  image String?
  role  Role    @default(RESEARCHER)

  // Auth.js relations
  accounts Account[]
  sessions Session[]

  // App relations
  memberships     WorkspaceMember[]
  workspacesOwned Workspace[]       @relation("WorkspaceOwner")
  uploadedPapers  Paper[]           @relation("PaperUploader")
  annotations     Annotation[]
  collections     Collection[]      @relation("CollectionOwner")
  subscriptions   Subscription[]
  payments        Payment[]
  searchHistory   SearchHistory[]
  notifications   Notification[]
  usageEvents     UsageEvent[]
  activities      ActivityLog[]

  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  isDeleted         Boolean             @default(false)
  AnnotationVersion AnnotationVersion[]
  CollectionPaper   CollectionPaper[]
  CollectionMember  CollectionMember[]
}

model Workspace {
  id          String            @id @default(uuid())
  name        String
  ownerId     String
  owner       User              @relation("WorkspaceOwner", fields: [ownerId], references: [id])
  members     WorkspaceMember[]
  collections Collection[]
  papers      Paper[]
  activities  ActivityLog[]

  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  isDeleted    Boolean        @default(false)
  Subscription Subscription[]
  UsageEvent   UsageEvent[]

  @@index([ownerId])
}

model WorkspaceMember {
  id          String   @id @default(uuid())
  workspaceId String
  userId      String
  role        Role     @default(RESEARCHER)
  joinedAt    DateTime @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id])
  user      User      @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@unique([workspaceId, userId])
  @@index([userId])
}

model Paper {
  id          String  @id @default(uuid())
  workspaceId String
  uploaderId  String
  title       String
  abstract    String?
  metadata    Json    @db.JsonB
  source      String? // 'upload' | 'arxiv' | 'openalex' | 'doi' | 'semantic-scholar'
  doi         String? @unique

  uploader        User              @relation("PaperUploader", fields: [uploaderId], references: [id])
  workspace       Workspace         @relation(fields: [workspaceId], references: [id])
  file            PaperFile?
  chunks          PaperChunk[]
  citationsFrom   Citation[]        @relation("CitationsFrom")
  citationsTo     Citation[]        @relation("CitationsTo")
  annotations     Annotation[]
  collectionJoins CollectionPaper[]
  aiSummaries     AISummary[]

  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
  isDeleted  Boolean      @default(false)
  UsageEvent UsageEvent[]

  @@index([workspaceId, createdAt])
  @@index([uploaderId])
}

model PaperFile {
  id              String  @id @default(uuid())
  paperId         String  @unique
  storageProvider String // s3 | gcs | local
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
  id         String                 @id @default(uuid())
  paperId    String
  idx        Int
  page       Int?
  content    String
  embedding  Unsupported("vector")? // pgvector column (e.g., vector(1536))
  tokenCount Int?

  paper Paper @relation(fields: [paperId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@unique([paperId, idx])
  @@index([paperId])
}

model Citation {
  id            String  @id @default(uuid())
  sourcePaperId String
  targetPaperId String
  context       String?
  location      String?

  sourcePaper Paper @relation("CitationsFrom", fields: [sourcePaperId], references: [id])
  targetPaper Paper @relation("CitationsTo", fields: [targetPaperId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@unique([sourcePaperId, targetPaperId, context])
  @@index([targetPaperId])
}

model Annotation {
  id       String         @id @default(uuid())
  paperId  String
  userId   String
  type     AnnotationType @default(HIGHLIGHT)
  anchor   Json           @db.JsonB // position anchors
  text     String
  version  Int            @default(1)
  parentId String?

  parent   Annotation?  @relation("AnnotationThread", fields: [parentId], references: [id])
  children Annotation[] @relation("AnnotationThread")

  paper    Paper               @relation(fields: [paperId], references: [id])
  user     User                @relation(fields: [userId], references: [id])
  versions AnnotationVersion[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([paperId])
  @@index([userId])
}

model AnnotationVersion {
  id           String   @id @default(uuid())
  annotationId String
  version      Int
  text         String
  changedById  String
  timestamp    DateTime @default(now())

  annotation Annotation @relation(fields: [annotationId], references: [id])
  changedBy  User       @relation(fields: [changedById], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@unique([annotationId, version])
}

model Collection {
  id          String  @id @default(uuid())
  workspaceId String
  ownerId     String
  name        String
  description String?
  isPublic    Boolean @default(false)

  owner     User      @relation("CollectionOwner", fields: [ownerId], references: [id])
  workspace Workspace @relation(fields: [workspaceId], references: [id])

  papers  CollectionPaper[]
  members CollectionMember[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([workspaceId])
  @@index([ownerId])
}

model CollectionPaper {
  id           String   @id @default(uuid())
  collectionId String
  paperId      String
  addedById    String
  addedAt      DateTime @default(now())

  collection Collection @relation(fields: [collectionId], references: [id])
  paper      Paper      @relation(fields: [paperId], references: [id])
  addedBy    User       @relation(fields: [addedById], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@unique([collectionId, paperId])
  @@index([paperId])
}

model CollectionMember {
  id           String   @id @default(uuid())
  collectionId String
  userId       String
  role         Role     @default(RESEARCHER)
  invitedAt    DateTime @default(now())

  collection Collection @relation(fields: [collectionId], references: [id])
  user       User       @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@unique([collectionId, userId])
}

model SearchHistory {
  id      String @id @default(uuid())
  userId  String
  query   String
  filters Json?  @db.JsonB
  results Json?  @db.JsonB

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

model Plan {
  id            String  @id @default(uuid())
  code          String  @unique
  name          String
  priceCents    Int
  currency      String
  interval      String // month, year, etc.
  stripePriceId String?
  features      Json?   @db.JsonB
  active        Boolean @default(true)

  subscriptions Subscription[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)
}

model Subscription {
  id                     String             @id @default(uuid())
  userId                 String
  workspaceId            String?
  planId                 String
  status                 SubscriptionStatus
  provider               PaymentProvider
  providerCustomerId     String?
  providerSubscriptionId String?
  cancelAtPeriodEnd      Boolean            @default(false)
  startedAt              DateTime           @default(now())
  expiresAt              DateTime

  user      User       @relation(fields: [userId], references: [id])
  workspace Workspace? @relation(fields: [workspaceId], references: [id])
  plan      Plan       @relation(fields: [planId], references: [id])
  payments  Payment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([userId])
  @@index([workspaceId])
  @@index([planId])
}

model Payment {
  id             String          @id @default(uuid())
  userId         String
  subscriptionId String?
  provider       PaymentProvider
  amountCents    Int
  currency       String
  transactionId  String          @unique
  status         PaymentStatus
  raw            Json?           @db.JsonB

  user         User          @relation(fields: [userId], references: [id])
  subscription Subscription? @relation(fields: [subscriptionId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([userId, createdAt])
}

model WebhookEvent {
  id          String          @id @default(uuid())
  provider    PaymentProvider
  eventId     String
  type        String
  payload     Json            @db.JsonB
  receivedAt  DateTime        @default(now())
  processedAt DateTime?
  status      String
  error       String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@unique([provider, eventId])
}

model Notification {
  id      String    @id @default(uuid())
  userId  String
  type    String
  payload Json      @db.JsonB
  readAt  DateTime?

  user User @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([userId, createdAt])
}

model UsageEvent {
  id          String  @id @default(uuid())
  userId      String
  workspaceId String?
  kind        String // "upload", "ai_summarize", "semantic_search", etc.
  units       Int     @default(1)
  paperId     String?

  user      User       @relation(fields: [userId], references: [id])
  workspace Workspace? @relation(fields: [workspaceId], references: [id])
  paper     Paper?     @relation(fields: [paperId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([userId, createdAt])
}

model ActivityLog {
  id          String  @id @default(uuid())
  userId      String?
  workspaceId String?
  entity      String
  entityId    String
  action      String
  details     Json?   @db.JsonB

  user      User?      @relation(fields: [userId], references: [id])
  workspace Workspace? @relation(fields: [workspaceId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([workspaceId, createdAt])
}

// -------- Auth.js (NextAuth) models --------

model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
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

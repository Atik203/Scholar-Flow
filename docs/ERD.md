# ScholarFlow ERD and Relational Schema Reference

- For Better View: [ERD](https://lucid.app/lucidchart/76e3f9ec-0891-48af-aeed-1a6f9dbd641c/view)
- For Better View: [Schema](https://lucid.app/lucidchart/8fa45201-ebc1-46e2-8204-93c162cbaf0b/view)

## Phase 1 Tables (MVP - Core Features)

### Authentication Tables

#### User

- **id** (PK, UUID)
- email (unique)
- name, firstName, lastName
- institution, fieldOfStudy
- image, password
- role (enum: RESEARCHER, PRO_RESEARCHER, TEAM_LEAD, ADMIN)
- emailVerified, emailVerificationToken
- timestamps, isDeleted

#### Account (Auth.js OAuth)

- **id** (PK, UUID)
- **userId** (FK → User.id)
- provider, providerAccountId
- type, refresh_token, access_token
- expires_at, token_type, scope
- timestamps, isDeleted

#### Session (Auth.js)

- **id** (PK, UUID)
- **userId** (FK → User.id)
- sessionToken (unique)
- expires
- timestamps, isDeleted

#### UserToken

- **id** (PK, UUID)
- **userId** (FK → User.id)
- token (unique, hashed)
- type (enum: PASSWORD_RESET, EMAIL_VERIFICATION)
- expiresAt, used
- createdAt

### Core Workspace Tables

#### Workspace

- **id** (PK, UUID)
- **ownerId** (FK → User.id)
- name
- timestamps, isDeleted

#### WorkspaceMember (Junction Table)

- **id** (PK, UUID)
- **workspaceId** (FK → Workspace.id)
- **userId** (FK → User.id)
- role, joinedAt
- timestamps, isDeleted

### Paper Management Tables

#### Paper

- **id** (PK, UUID)
- **workspaceId** (FK → Workspace.id)
- **uploaderId** (FK → User.id)
- title, abstract
- metadata (JSON), source, doi
- processingStatus (enum: UPLOADED, PROCESSING, PROCESSED, FAILED)
- processingError, processedAt
- timestamps, isDeleted

#### PaperFile

- **id** (PK, UUID)
- **paperId** (FK → Paper.id, unique)
- storageProvider, objectKey
- contentType, sizeBytes, pageCount
- checksum, originalFilename
- extractedAt
- timestamps, isDeleted

#### PaperChunk

- **id** (PK, UUID)
- **paperId** (FK → Paper.id)
- idx, page
- content, tokenCount
- timestamps, isDeleted

### Collection Management Tables

#### Collection

- **id** (PK, UUID)
- **workspaceId** (FK → Workspace.id)
- **ownerId** (FK → User.id)
- name, description
- isPublic
- timestamps, isDeleted

#### CollectionPaper (Junction Table)

- **id** (PK, UUID)
- **collectionId** (FK → Collection.id)
- **paperId** (FK → Paper.id)
- **addedById** (FK → User.id)
- addedAt
- timestamps, isDeleted

#### CollectionMember (Junction Table)

- **id** (PK, UUID)
- **collectionId** (FK → Collection.id)
- **userId** (FK → User.id)
- role, invitedAt
- timestamps, isDeleted

## Phase 1 Relationships (1:M Format)

### User Relationships

- User **1 : M** Account _(has OAuth accounts)_
- User **1 : M** Session _(creates login sessions)_
- User **1 : M** UserToken _(generates reset/verification tokens)_
- User **1 : M** Workspace _(owns workspaces)_
- User **1 : M** Paper _(uploads papers)_
- User **1 : M** Collection _(owns collections)_

### Workspace Relationships

- Workspace **1 : M** WorkspaceMember _(has members)_
- Workspace **1 : M** Paper _(contains papers)_
- Workspace **1 : M** Collection _(hosts collections)_

### Paper Relationships

- Paper **1 : 1** PaperFile _(has one file)_
- Paper **1 : M** PaperChunk _(divided into chunks)_

### Collection Relationships

- Collection **1 : M** CollectionPaper _(contains papers)_
- Collection **1 : M** CollectionMember _(has members)_

### Many-to-Many via Junction Tables

- User **M : M** Workspace _(via WorkspaceMember)_
- User **M : M** Collection _(via CollectionMember)_
- Paper **M : M** Collection _(via CollectionPaper)_

---

## Phase 2 Tables (Collaboration & Advanced Features)

### Annotation System

#### Annotation

- **id** (PK, UUID)
- **paperId** (FK → Paper.id)
- **userId** (FK → User.id)
- **parentId** (FK → Annotation.id, optional)
- type (enum: HIGHLIGHT, COMMENT, NOTE)
- anchor (JSON), text, version
- timestamps, isDeleted

#### AnnotationVersion

- **id** (PK, UUID)
- **annotationId** (FK → Annotation.id)
- version, text
- **changedById** (FK → User.id)
- timestamp
- timestamps, isDeleted

### Citation System

#### Citation

- **id** (PK, UUID)
- **sourcePaperId** (FK → Paper.id)
- **targetPaperId** (FK → Paper.id)
- context, location
- timestamps, isDeleted

### Search & AI Features

#### SearchHistory

- **id** (PK, UUID)
- **userId** (FK → User.id)
- query, filters (JSON), results (JSON)
- timestamps, isDeleted

#### AISummary

- **id** (PK, UUID)
- **paperId** (FK → Paper.id)
- model, summary, promptHash
- timestamps, isDeleted

## Phase 2 Relationships (1:M Format)

### Annotation Relationships

- User **1 : M** Annotation _(creates annotations)_
- Paper **1 : M** Annotation _(has annotations)_
- Annotation **1 : M** Annotation _(replies to - self reference)_
- Annotation **1 : M** AnnotationVersion _(has versions)_

### Citation Relationships

- Paper **1 : M** Citation _(as source paper)_
- Paper **1 : M** Citation _(as target paper)_

### Search & AI Relationships

- User **1 : M** SearchHistory _(performs searches)_
- Paper **1 : M** AISummary _(has AI summaries)_

---

## Phase 3 Tables (Payment & Enterprise Features)

### Payment System

#### Plan

- **id** (PK, UUID)
- code (unique), name
- priceCents, currency, interval
- stripePriceId, features (JSON)
- active
- timestamps, isDeleted

#### Subscription

- **id** (PK, UUID)
- **userId** (FK → User.id)
- **workspaceId** (FK → Workspace.id, optional)
- **planId** (FK → Plan.id)
- status (enum: ACTIVE, EXPIRED, CANCELED, PAST_DUE)
- provider (enum: STRIPE, SSLCOMMERZ)
- providerCustomerId, providerSubscriptionId
- cancelAtPeriodEnd
- startedAt, expiresAt
- timestamps, isDeleted

#### Payment

- **id** (PK, UUID)
- **userId** (FK → User.id)
- **subscriptionId** (FK → Subscription.id, optional)
- provider (enum: STRIPE, SSLCOMMERZ)
- amountCents, currency
- transactionId (unique)
- status (enum: PENDING, SUCCEEDED, FAILED, REFUNDED)
- raw (JSON)
- timestamps, isDeleted

### Enterprise Features

#### WebhookEvent

- **id** (PK, UUID)
- provider (enum: STRIPE, SSLCOMMERZ)
- eventId, type, payload (JSON)
- receivedAt, processedAt
- status, error
- timestamps, isDeleted

#### Notification

- **id** (PK, UUID)
- **userId** (FK → User.id)
- type, payload (JSON)
- readAt
- timestamps, isDeleted

#### UsageEvent

- **id** (PK, UUID)
- **userId** (FK → User.id)
- **workspaceId** (FK → Workspace.id, optional)
- **paperId** (FK → Paper.id, optional)
- kind, units
- timestamps, isDeleted

#### ActivityLog

- **id** (PK, UUID)
- **userId** (FK → User.id, optional)
- **workspaceId** (FK → Workspace.id, optional)
- entity, entityId, action
- details (JSON)
- timestamps, isDeleted

## Phase 3 Relationships (1:M Format)

### Payment Relationships

- Plan **1 : M** Subscription _(provides subscriptions)_
- User **1 : M** Subscription _(has subscriptions)_
- User **1 : M** Payment _(makes payments)_
- Workspace **1 : M** Subscription _(has subscriptions)_
- Subscription **1 : M** Payment _(generates payments)_

### Enterprise Relationships

- User **1 : M** Notification _(receives notifications)_
- User **1 : M** UsageEvent _(generates usage events)_
- User **1 : M** ActivityLog _(performs activities)_
- Workspace **1 : M** UsageEvent _(tracks usage)_
- Workspace **1 : M** ActivityLog _(logs activities)_
- Paper **1 : M** UsageEvent _(generates usage)_

---

## ERD Drawing Guidelines

### Phase Organization

- **Phase 1 (Blue)**: Authentication, Workspace, Paper, Collection
- **Phase 2 (Green)**: Annotation, Citation, Search, AI features
- **Phase 3 (Orange)**: Payment, Enterprise monitoring

### Entity Layout Suggestions

```
Phase 1 Layout:
┌─────────────────┐
│ Authentication  │ User, Account, Session, UserToken
│ Tables (Green)  │
└─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Workspace       │────▶│ Paper           │
│ (Blue)          │     │ Management      │
│                 │     │ (Blue)          │
└─────────────────┘     └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│ Collection      │◄────┤ Junction        │
│ (Blue)          │     │ Tables          │
└─────────────────┘     └─────────────────┘
```

### Cardinality Notation

- **1** : One
- **M** : Many
- **1:1** : One-to-One
- **1:M** : One-to-Many
- **M:M** : Many-to-Many (via junction table)

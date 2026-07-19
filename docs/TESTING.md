# Testing Guide

This guide explains how to run tests, write new tests, and understand the testing conventions in Scholar-Flow.

## Prerequisites

- You have completed the [Setup Guide](./SETUP.md) and the dev servers can start
- Database is set up and migrations have run

## Running Tests

### Run All Tests

```bash
yarn test
```

Run from: repo root

This runs both frontend and backend test suites via Turborepo.

### Run Frontend Tests Only

```bash
yarn workspace @scholar-flow/frontend test
```

Run from: repo root

### Run Backend Tests Only

```bash
yarn workspace @scholar-flow/backend test
```

Run from: repo root

### Watch Mode (Frontend — re-runs on file changes)

```bash
yarn workspace @scholar-flow/frontend test:watch
```

## Test Structure

### Backend Tests

Location: `apps/backend/src/__tests__/` (or alongside the files they test)

Backend tests use:
- **Jest** — test runner
- **Supertest** — HTTP assertions (for endpoint testing)
- **Mocked Prisma** — database mocking to avoid hitting a real database

Example backend test structure:

```typescript
// apps/backend/src/__tests__/paper-crud.test.ts
import { prismaMock } from "../mocks/prisma"
import { PaperService } from "../app/modules/papers/paper.service"

describe("PaperService", () => {
  it("should create a paper", async () => {
    const paper = { id: "1", title: "Test Paper", /* ... */ }
    prismaMock.paper.create.mockResolvedValue(paper)

    const result = await PaperService.create({ title: "Test Paper" })
    expect(result.title).toBe("Test Paper")
  })
})
```

### Frontend Tests

Location: `apps/frontend/src/__tests__/` or co-located with components

Frontend tests use:
- **Jest** — test runner
- **@testing-library/react** — React component testing
- **@testing-library/jest-dom** — DOM assertion matchers

Example frontend test structure:

```typescript
// apps/frontend/src/components/__tests__/EmptyState.test.tsx
import { render, screen } from "@testing-library/react"
import { EmptyState } from "../customUI/EmptyState"

describe("EmptyState", () => {
  it("renders the message", () => {
    render(<EmptyState message="No papers found" />)
    expect(screen.getByText("No papers found")).toBeInTheDocument()
  })
})
```

## What to Test

### Backend Priority Areas

1. **Auth flows** — login, register, token refresh, password reset
2. **Paper CRUD** — create, read, update, delete papers
3. **Billing webhooks** — Stripe webhook idempotency (critical — money flows)
4. **S3 presigned URLs** — upload and access control
5. **Workspace invitations** — invite, accept, decline flows
6. **Notification broadcast** — SSE delivery
7. **Admin reports** — report generation

### Frontend Priority Areas

1. **Component rendering** — EmptyState, ErrorState, DataTable, NotificationBell
2. **RTK Query cache invalidation** — that mutations properly invalidate cached data
3. **Auth flow integration** — login, logout, protected route behavior

## Writing New Tests

### Backend: Testing a service

```typescript
describe("YourService", () => {
  it("should return papers for a workspace", async () => {
    const mockPapers = [
      { id: "1", title: "Paper 1", workspaceId: "ws1" },
      { id: "2", title: "Paper 2", workspaceId: "ws1" },
    ]

    prismaMock.paper.findMany.mockResolvedValue(mockPapers)

    const result = await YourService.list("ws1")
    expect(result).toHaveLength(2)
    expect(result[0].title).toBe("Paper 1")
  })
})
```

### Backend: Testing an endpoint (with Supertest)

```typescript
import request from "supertest"
import app from "../app"

describe("GET /api/health", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/api/health")
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
  })
})
```

### Frontend: Testing a component

```typescript
import { render, screen, fireEvent } from "@testing-library/react"
import { Button } from "../ui/button"

describe("Button", () => {
  it("calls onClick when clicked", () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    fireEvent.click(screen.getByText("Click me"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
```

## Test Conventions

- **Describe blocks** name the service/component being tested
- **Test descriptions** follow the pattern: "should [expected behavior]"
- **Mock external services** (database, S3, Stripe) — never hit real services in tests
- **One assertion per test** where practical (use multiple `expect` calls when testing related behavior)
- **Clean up after tests** — reset mocks and database state between tests

## Mocking Prisma

The backend uses a mocked Prisma client for testing. The mock is configured in `apps/backend/src/mocks/prisma.ts` and provides Jest mock functions for all model operations.

```typescript
// In your test file
import { prismaMock } from "../../mocks/prisma"

// Mock a return value
prismaMock.paper.findMany.mockResolvedValue([...])

// Mock an error
prismaMock.paper.create.mockRejectedValue(new Error("DB error"))

// Assert a method was called
expect(prismaMock.paper.create).toHaveBeenCalledWith({
  data: { title: "Test" }
})
```

## CI/CD Test Expectations

When you open a Pull Request, GitHub Actions runs:

1. `yarn type-check` — TypeScript compilation
2. `yarn lint` — ESLint checks
3. `yarn test` — All test suites

All three must pass before merging. If you add new code, add corresponding tests.

## Troubleshooting

**Problem: Tests fail with "Cannot find module"**
Cause: Test dependencies missing or module path wrong.
Fix: Run `yarn install` and check the import path.

**Problem: Supertest tests hang or timeout**
Cause: Express app isn't properly exported for testing.
Fix: Make sure you're importing the Express app (not calling `app.listen()` in the test).

**Problem: Prisma mock returns undefined**
Cause: The mock hasn't been set up for the specific model/method.
Fix: Check that `prismaMock.yourModel.yourMethod` is mocked before the test runs.

## Related Docs

- [Setup Guide](./SETUP.md) — initial environment setup
- [Development Guide](./DEVELOPMENT.md) — day-to-day dev workflow
- [Contributing Guide](../CONTRIBUTING.md) — PR workflow

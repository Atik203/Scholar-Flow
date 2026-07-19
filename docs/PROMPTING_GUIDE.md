# AI Prompting Guide for Scholar-Flow

> **TL;DR**: Write `AGENTS.md` **once** per project and update it when conventions change. Don't rewrite it every session. Use model-specific strategies below to maximize cache hits and output quality.

---

## Table of Contents

1. [AGENTS.md: Write Once, Update as Needed](#agentsmd-write-once-update-as-needed)
2. [Model-Specific Prompting Strategies](#model-specific-prompting-strategies)
3. [Scenario-Based Prompting Examples](#scenario-based-prompting-examples)
4. [Prefix Caching Best Practices](#prefix-caching-best-practices)
5. [Prompt Structure Templates](#prompt-structure-templates)
6. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## AGENTS.md: Write Once, Update as Needed

### What is AGENTS.md?

`AGENTS.md` is a **persistent project context file** that lives in your project root. It tells AI agents:
- Project architecture and tech stack
- Coding conventions and rules
- File structure and where things live
- Critical security rules (Stripe, S3, auth)
- Commands and workflows

### Do NOT Rewrite AGENTS.md Every Session

**Wrong approach:**
```
User: "Write AGENTS.md with these rules..."
AI: [writes full AGENTS.md]
Next session:
User: "Write AGENTS.md again with updated rules..."
AI: [rewrites entire file]
```

**Correct approach:**
```
User: "Update AGENTS.md to add the new Stripe webhook rule"
AI: [edits only the relevant section, preserving the rest]
```

### When to Update AGENTS.md

| Trigger | Action |
|---------|--------|
| New coding convention added | Append to relevant section |
| Architecture change | Update structure section |
| New critical rule (security, auth) | Add to "Never Do" / "Always Do" |
| New command added | Add to "Exact Commands" |
| Phase completed | Update "Current Status" |
| Cache model changes | Update "Multi-Model Cache Optimization" |

### When to Regenerate Repomix

Run `yarn repomix` when:
- Major structural changes (new directories, moved files)
- New dependencies or build tools added
- Before asking a new AI agent to work on the project
- When context seems stale (agent doesn't know about recent changes)

---

## Model-Specific Prompting Strategies

### DeepSeek V4 Pro / Flash

**Characteristics:**
- Cache hits from **byte 0** on matching prefix
- Excellent for long-context reasoning
- Strong code generation
- Cost-effective for repeated queries

**Prompting Strategy:**
```markdown
# CACHE OPTIMIZATION CONTRACT
# This exact block must be first. Never modify.

[Your project context here - static between calls]

---

## Current Task
[Task-specific context - changes per session]

## Goal
[One sentence goal]

## Files to Read
1. [file path]
2. [file path]

## Implementation Approach
[Your approach]
```

**Example:**
```
Goal: Fix the auth middleware token expiration bug
Files to Read: 
1. apps/backend/src/app/middleware/auth.ts
2. apps/backend/src/app/errors/ApiError.ts

Approach: Check the JWT verify logic, look for clock skew issues,
add a 5-minute leeway for token expiration.
```

---

### Kimi K2.6

**Characteristics:**
- Cache hits from **byte 0** on matching prefix
- Excellent reasoning and context understanding
- Strong at following complex multi-step instructions
- Good at maintaining context across long conversations

**Prompting Strategy:**
- Be explicit about step ordering
- Use numbered lists for multi-step tasks
- Provide clear success criteria

**Example:**
```
Goal: Implement Phase 2.1 auth pages with figma-make design

Steps (execute in order):
1. Read figma-make/pages/LoginPage.tsx and RegisterPage.tsx
2. Create apps/frontend/src/app/login/page.tsx with figma-make design
3. Create apps/frontend/src/app/register/page.tsx with figma-make design
4. Run yarn type-check after each file
5. Update IMPLEMENTATION.md to mark Phase 2.1 items as [x]

Success Criteria:
- All 5 auth pages render with figma-make design
- Type-check passes
- No console errors
```

---

### GLM-4 / MiMo

**Characteristics:**
- Cache hits from **byte 0** on matching prefix
- Strong Chinese-English bilingual capability
- Good at structured output

**Prompting Strategy:**
- Use clear delimiters (---, ###)
- Structure output expectations explicitly

**Example:**
```
## Input
File: apps/frontend/src/components/sections/Hero.tsx

## Required Changes
1. Add "Simple 5-Step Workflow" badge above heading
2. Update heading to "Your research workflow, reimagined"
3. Add gradient text effect on "reimagined"

## Expected Output
Return the COMPLETE updated file content.
Do not summarize or truncate.
```

---

### Qwen 3.x

**Characteristics:**
- Requires **minimum 1024 tokens** to activate prefix caching
- Shorter prompts may not benefit from caching
- Excellent for reasoning and tool use

**Prompting Strategy:**
- Ensure AGENTS.md + skills content stays above 1024 tokens
- Don't shorten the frozen prefix block
- Add detailed context to activate cache

**Example:**
```
# Project: Scholar-Flow (1.3.1)
# Architecture: Turborepo + Next.js 16 + Express + Prisma + PostgreSQL
# Current Phase: Phase 2 - Auth & Onboarding
# Status: 5 of 6 auth pages pending

[Detailed project context... ensure this exceeds 1024 tokens]

---

## Task
Implement the forgot-password page matching figma-make design.

## Context
- figma-make source: figma-make/pages/ForgotPasswordPage.tsx
- Target location: apps/frontend/src/app/forgot-password/page.tsx
- Must use "use client" and Link from next/link
- Must not include Navbar/Footer (layout provides them)

## Files to Read
1. figma-make/pages/ForgotPasswordPage.tsx
2. apps/frontend/src/components/ui/card-variants.tsx
3. apps/frontend/src/components/ui/button.tsx

## Output
Return the complete file content. Do not truncate.
```

---

## Scenario-Based Prompting Examples

### Scenario 1: Feature Implementation

**When**: Adding a new feature (e.g., Phase 2.2 form components)

**Prompt Template:**
```
Goal: [One sentence]

Phase: [Current phase from IMPLEMENTATION.md]
Files to Read:
1. [Source file 1]
2. [Source file 2]
3. [Pattern example file]

Implementation Plan:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Constraints:
- [Rule 1 from AGENTS.md]
- [Rule 2 from AGENTS.md]

Verify:
- Run yarn type-check
- Run yarn lint
- Check [specific test or behavior]
```

**Example:**
```
Goal: Create FloatingInput form component

Phase: Phase 2.2 - Form Components
Files to Read:
1. figma-make/components/form/FloatingInput.tsx (pattern)
2. apps/frontend/src/components/ui/input.tsx (existing input)
3. apps/frontend/src/components/ui/label.tsx (label component)

Implementation Plan:
1. Create FloatingInput.tsx with floating label animation
2. Integrate with React Hook Form register
3. Add Zod validation support
4. Export from components/ui/index.ts

Constraints:
- Must use "motion/react" for animations (not framer-motion)
- Must integrate with react-hook-form
- Must follow OKLCH color system

Verify:
- Run yarn type-check
- Run yarn lint
- Check dark mode works
```

---

### Scenario 2: Bug Fix

**When**: Fixing a bug (e.g., Tailwind styles not applying)

**Prompt Template:**
```
Bug: [Description]

Error: [Exact error message or behavior]

Reproduce:
1. [Step 1]
2. [Step 2]

Files to Check:
1. [File 1]
2. [File 2]

Expected: [What should happen]
Actual: [What currently happens]

Additional Context:
- [Any relevant env vars, recent changes, etc.]
```

**Example:**
```
Bug: Tailwind CSS styles not applying on frontend pages

Error: Only pure HTML renders without CSS classes

Reproduce:
1. Run yarn dev:frontend
2. Open any page (e.g., /products/papers)
3. Observe no styling applied

Files to Check:
1. apps/frontend/src/app/globals.css
2. apps/frontend/postcss.config.mjs
3. apps/frontend/src/app/layout.tsx
4. apps/frontend/src/styles/_variables.scss

Expected: Styled pages with Tailwind classes
Actual: Unstyled HTML

Additional Context:
- Using Tailwind v4 with @tailwindcss/postcss
- @config directive was removed from globals.css
- SCSS files imported before @import "tailwindcss"
```

---

### Scenario 3: Code Review / Refactoring

**When**: Reviewing or refactoring existing code

**Prompt Template:**
```
Task: Review/Refactor [component/file]

Current State:
[What it currently does, issues, or goals]

Files to Read:
1. [Main file]
2. [Related files]
3. [Pattern reference]

Review Criteria:
- [Criterion 1]
- [Criterion 2]

Specific Focus:
- [Area to focus on]

Constraints:
- [Don't break X]
- [Must maintain Y compatibility]
```

**Example:**
```
Task: Refactor all marketing pages to match figma-make exactly

Current State:
- 19 pages exist but are simplified versions
- Missing full feature card grids, HowItWorks sections, CTA sections

Files to Read:
1. figma-make/pages/products/PapersPage.tsx (source of truth)
2. apps/frontend/src/app/products/papers/page.tsx (current)
3. figma-make/components/sections/Features.tsx (pattern)

Review Criteria:
- Must match figma-make section structure exactly
- Must use CardWithVariants for feature grids
- Must include gradient hero + feature cards + CTA

Specific Focus:
- Papers, Collections, Collaborate, AI-Insights pages

Constraints:
- Don't break existing routes
- Keep "use client" for animated sections
- Don't include Navbar/Footer (layout provides them)
```

---

### Scenario 4: Documentation Update

**When**: Updating AGENTS.md, IMPLEMENTATION.md, or other docs

**Prompt Template:**
```
Document: [Which file]
Change Type: [Update/Add/Remove]
Section: [Which section]

Current Content:
[Current state or relevant excerpt]

Desired Change:
[What to add/update/remove]

Reason:
[Why this change is needed]
```

**Example:**
```
Document: AGENTS.md
Change Type: Update
Section: Multi-Model Cache Optimization

Current Content:
- DeepSeek: cache hits from byte 0
- [Missing other models]

Desired Change:
Add Kimi K2.6, GLM-4, MiMo, and Qwen 3.x cache rules

Reason:
Project now supports multiple AI models. Need to document
Qwen's 1024-token minimum requirement and other model-specific
behaviors so future agents optimize correctly.
```

---

### Scenario 5: Backend API Implementation

**When**: Adding new backend routes/models

**Prompt Template:**
```
Goal: [API/Model name]

Backend Module:
- Location: apps/backend/src/app/modules/[Name]/
- Files: [name].controller.ts, [name].service.ts, [name].routes.ts, [name].validation.ts

Prisma Model:
[Schema definition]

Routes:
- GET /api/[endpoint]
- POST /api/[endpoint]

Data Flow:
1. [Request comes in]
2. [Validation happens]
3. [Service processes]
4. [Response returned]

Verify:
- Run yarn db:generate --sql
- Run yarn type-check
- Test routes with curl/Postman
```

**Example:**
```
Goal: Implement public content API (Phase 1.9)

Backend Module:
- Location: apps/backend/src/app/modules/Public/
- Files: public.controller.ts, public.service.ts, public.routes.ts, public.validation.ts

Prisma Model:
model Faq {
  id String @id @default(uuid())
  question String
  answer String
  category String
  order Int @default(0)
  isPublished Boolean @default(true)
}

Routes:
- GET /api/public/faqs
- GET /api/public/faqs/categories
- GET /api/public/testimonials
- POST /api/public/newsletter
- POST /api/public/contact
- GET /api/public/page-content/:slug

Data Flow:
1. Request hits Public routes
2. Validation middleware checks body/query/params
3. Controller calls PublicService
4. Service uses $queryRaw for all DB operations
5. Response returned via sendSuccessResponse

Verify:
- Run yarn db:generate --sql
- Run yarn type-check
- Register routes in routes/index.ts
```

---

## Prefix Caching Best Practices

### What is Prefix Caching?

Models like DeepSeek, Kimi, GLM, and MiMo cache the "prefix" (system prompt + project context) and reuse it across calls. This means:
- **First call**: Full context is processed (expensive)
- **Subsequent calls**: Only the new user message is processed (cheap)
- **Cache invalidation**: Happens if ANY byte in the prefix changes

### How to Maximize Cache Hits

1. **Put project context first** in the prompt
   - AGENTS.md content should be at the very beginning
   - Never change it between calls

2. **Use a frozen prefix block**
   ```
   # CACHE OPTIMIZATION CONTRACT — FROZEN PREFIX
   # Never modify this block between calls.
   ```

3. **Keep the prefix stable**
   - Don't add timestamps or session-specific values
   - Don't modify the first 1000+ tokens
   - Append new context at the END, not the beginning

4. **For Qwen 3.x specifically:**
   - Ensure prefix exceeds 1024 tokens
   - Include AGENTS.md + skills + project context
   - Don't shorten to save tokens — it breaks cache activation

5. **For DeepSeek/Kimi/GLM/MiMo:**
   - Any stable prefix works — they cache from byte 0
   - Even a 100-token prefix gets cached
   - These models are most efficient for iterative work

### Example: Stable vs Unstable Prefix

**Stable (good for caching):**
```
# Project: Scholar-Flow v1.3.1
# Stack: Next.js 16 + Express + Prisma + PostgreSQL
# Rules: [unchanged rules]

---

## Current Task
[This changes per session]
```

**Unstable (bad for caching):**
```
# Project: Scholar-Flow
# Date: 2026-06-08 [CHANGES EVERY SESSION - BAD!]
# Time: 14:30 [CHANGES EVERY SESSION - BAD!]
# Stack: Next.js 15 + Express + Prisma + PostgreSQL

---

## Current Task
```

---

## Prompt Structure Templates

### Template A: Implementation Task

```markdown
# Project Context
[Static project info from AGENTS.md]

---

## Current Status
[Current phase from IMPLEMENTATION.md]

## Goal
[One sentence]

## Files to Read
1. [Path]
2. [Path]

## Implementation Plan
1. [Step]
2. [Step]

## Verification
- [ ] yarn type-check
- [ ] yarn lint
- [ ] Specific test

## Constraints
- [Rule from AGENTS.md]
- [Rule from AGENTS.md]
```

### Template B: Debug Task

```markdown
# Project Context
[Static project info]

---

## Bug Description
[What is wrong]

## Error Message
```
[Exact error]
```

## Reproduction Steps
1. [Step]
2. [Step]

## Files to Check
1. [Path]
2. [Path]

## Expected vs Actual
- Expected: [What should happen]
- Actual: [What happens]

## Context
[Any relevant info]
```

### Template C: Review/Refactor Task

```markdown
# Project Context
[Static project info]

---

## Task
Review/Refactor [file/component]

## Current State
[What it does now]

## Issues
1. [Issue 1]
2. [Issue 2]

## Reference
- [Pattern file]
- [Design spec]

## Success Criteria
- [Criterion 1]
- [Criterion 2]

## Constraints
- [Don't break X]
- [Must maintain Y]
```

---

## Anti-Patterns to Avoid

### ❌ Don't: Rewrite AGENTS.md Every Session

**Wrong:**
```
User: "Write a new AGENTS.md for this session..."
```

**Right:**
```
User: "Update AGENTS.md section [X] to add [Y] rule"
```

### ❌ Don't: Add Timestamps to the Prefix

**Wrong:**
```
# Project Context
# Last updated: 2026-06-08 14:30
# Session ID: abc123
```

**Right:**
```
# Project Context
# Version: 1.1.0
# [No timestamps in prefix]
```

### ❌ Don't: Change the Prefix Mid-Conversation

**Wrong:**
```
Message 1: [Prefix A]
Message 2: [Prefix A modified]
Message 3: [Prefix A modified again]
```

**Right:**
```
Message 1: [Prefix A]
Message 2: [Prefix A - same]
Message 3: [Prefix A - same]
```

### ❌ Don't: Be Vague About Goals

**Wrong:**
```
"Fix the auth issue"
```

**Right:**
```
"Fix the JWT token expiration in auth middleware by adding 
5-minute leeway to clock tolerance. Check auth.ts line 146."
```

### ❌ Don't: Ask for Multiple Unrelated Tasks

**Wrong:**
```
"Implement auth pages, fix the footer, add a new model, 
and update the database schema"
```

**Right:**
```
"Implement auth pages (Phase 2.1). Files: login, register, 
forgot-password, reset-password, verify-email."
```

### ❌ Don't: Skip the 5-Step Pre-Implementation Checklist

**Wrong:**
```
"Implement the new feature"
[AI immediately starts coding]
```

**Right:**
```
"Goal: Implement forgot-password page

1. Read figma-make/pages/ForgotPasswordPage.tsx
2. Read apps/frontend/src/components/ui/card.tsx
3. Identify risks: Must use Link not onNavigate
4. Approach: Copy figma-make structure, adapt to Next.js
5. THEN write code"
```

---

## Quick Reference Card

| Model | Cache Strategy | Min Tokens | Best For |
|-------|---------------|------------|----------|
| DeepSeek V4 Pro | Byte 0 | Any | Long reasoning, complex tasks |
| DeepSeek Flash | Byte 0 | Any | Fast, cost-effective iteration |
| Kimi K2.6 | Byte 0 | Any | Multi-step reasoning, context heavy |
| GLM-4 | Byte 0 | Any | Bilingual, structured output |
| MiMo | Byte 0 | Any | General purpose, fast |
| Qwen 3.x | 1024+ | 1024 | Tool use, coding, when cache is critical |

| Action | Do This | Not This |
|--------|---------|----------|
| AGENTS.md | Update specific sections | Rewrite entire file |
| Prefix | Keep static, append at end | Add timestamps, modify mid-session |
| Goals | One sentence, specific | Vague, multiple unrelated |
| Files | List exact paths | "Check the backend" |
| Verify | Specify commands | "Make sure it works" |

---

## Summary

1. **Write AGENTS.md once**, update it incrementally
2. **Keep the prefix stable** — no timestamps, no session-specific data
3. **Match the model** — Qwen needs 1024+ tokens, others cache from byte 0
4. **Be specific** — exact files, exact goals, exact verification steps
5. **Use the 5-step checklist** — read, plan, identify risks, then code
6. **Regenerate repomix** when the project structure changes significantly

---

*Last updated: June 2026*
*Part of Scholar-Flow documentation*

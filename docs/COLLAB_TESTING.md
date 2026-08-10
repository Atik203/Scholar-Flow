# Collections, Workspaces & Team — Testing Guide

> Status: API-level E2E green — `node apps/backend/e2e_collab.cjs` → **55/55**
> checks (self-cleaning: creates unique users/workspaces/collections, deletes
> them in teardown). This file covers the browser walkthrough + what the E2E
> asserts so you know what is covered.
>
> Shared dev/prod DB: the E2E is re-runnable and never touches demo users
> (admin/researcher/pro.researcher) or global counts.

## Quick runs

```bash
# Full API-level suite for this module (self-cleaning, ~1 min)
node apps/backend/e2e_collab.cjs

# Regression cross-check after any change (papers + billing modules)
node apps/backend/e2e_papers.cjs
node apps/backend/e2e_admin.cjs
```

## What e2e_collab.cjs covers

1. **Registration security** — registering with `role: "ADMIN"` is clamped to
   RESEARCHER (client-supplied roles rejected; paid roles come from billing
   webhooks, elevated roles from admin team management).
2. **Collections** — create (owned workspace required), foreign read 403,
   invite (PENDING visible in received list), accept, re-invite of ACCEPTED →
   400, EDIT member update allowed, EDIT member delete → 403 (owner-only),
   outsider update → 403, search scoping (owner finds own private collection,
   non-members never see it), delete → 404 after.
3. **Workspaces** — create, invite by email, received list (route-order fixed),
   accept, EDITOR can't rename/add members, member list, owner promotes to
   MANAGER, MANAGER can invite but cannot invite as OWNER (escalation guard),
   sent-invites list.
4. **Team** — TEAM_LEAD promotion by admin, team member list scoped to shared
   workspaces (shared member + self visible; non-shared owner/outsider NEVER
   leak), cannot modify non-shared users (403), cannot grant ADMIN (403),
   cannot change own role (400), researchers blocked from team routes (403).
5. **Analytics** — workspace analytics: member of workspace reads it; foreign
   workspace → 403 (IDOR closed).
6. **Notifications** — invitee receives in-app INVITE notifications.
7. **Teardown** — deletes every created workspace + soft-deletes every created
   user; verified by querying the shared DB afterwards (0 active e2e users).

---

## Manual browser walkthrough

Prep: `yarn dev:backend` + `yarn dev:frontend`; use admin@scholarflow.com and
two throwaway accounts (register via the UI — they start as RESEARCHER;
promote one via Admin → Users or the team page as admin).

### 1. Workspaces (`/dashboard/workspaces`)
- [ ] Create workspace (modal + standalone create page) → lands on detail.
- [ ] Tabs: overview / collections / papers / members / activity / settings.
- [ ] Invite dialog: email + role; **OWNER option works only for the owner**
      (MANAGER gets an honest 403 toast, not a silent failure).
- [ ] Invitee sees the invite on `/dashboard/workspaces/shared` → accept →
      member with the invited role (VIEWER/EDITOR/MANAGER).
- [ ] EDITOR cannot rename/delete/add members (buttons may be hidden — API
      403s regardless); MANAGER can invite + manage non-owner members.
- [ ] Owner-only: delete workspace (type-to-confirm) — collection under the
      workspace disappears too (cascade soft-delete).
- [ ] Settings tab: color + toggles persist; activity feed shows workspace
      events (create/update/delete/member ops now write ActivityLogEntry, so
      they appear on the Team activity page too).

### 2. Collections (`/dashboard/collections`)
- [ ] Create (2-step wizard) requires an owned workspace (403 otherwise).
- [ ] Detail: invite by email → invitee accepts from
      `/dashboard/collections/shared` (PENDING → ACCEPTED).
- [ ] Re-inviting an accepted member → error toast (not a silent reset).
- [ ] EDIT member can edit + manage papers, **cannot delete** (owner-only).
- [ ] Delete (trash icon) → confirm → toast + navigate back to the list.
- [ ] Invites sent/received tabs show statuses incl. Expired
      (invitations auto-expire after INVITE_EXPIRY_DAYS, default 7d).

### 3. Team (`/dashboard/team`) — TEAM_LEAD+ only
- [ ] RESEARCHER hitting `/dashboard/team*` → redirected (client guard) —
      no 403 storm.
- [ ] Members list shows ONLY users sharing a workspace with you (never the
      whole platform).
- [ ] Role change: you can't grant ADMIN; you can't modify someone who
      doesn't share a workspace with you; you can't change your own role.
- [ ] Invitations: sent/received with accept/decline now actually working —
      Accept on a received invitation joins the workspace (check Shared
      Workspaces afterwards); Resend/Cancel work on sent ones.
- [ ] Settings: save toggles; Danger Zone now explains account deletion
      (no dead Archive/Delete buttons).

### 4. In-app notifications
- [ ] Bell badge appears when someone invites you to a workspace/collection
      and when they accept your invite (SSE, live without refresh).

## Known notes
- Invite expiry: `INVITE_EXPIRY_DAYS` env (default 7); the hourly
  `invitationSweeper` flips stale PENDING → EXPIRED; accept/decline also
  reject past-expiry invites with 400 regardless of sweep timing.
- Team invitations are workspace invitations (no Team entity exists); the
  team invite email links to `/dashboard/workspaces/shared` where acceptance
  actually happens.
- CollectionPaper status/star is collection-wide (not per-user) by decision.
- Socket rooms: paper/discussion/workspace joins are membership-checked
  (owner/workspace-member/thread-scope); standalone socket-server enforces the
  room-name allowlist only (no DB there).

# Admin Dashboard Skill

## When to use this skill
Any task involving: system metrics, health monitoring, admin routes,
CPU tracking, memory monitoring, storage analytics, performance data.

## Pre-task checklist
1. Read admin routes in apps/backend/src/app/
2. Check admin role middleware is present
3. Check current metric calculation logic before changing it

## Metric implementations (do not simplify)
CPU: os.cpus() idle/total delta between two samples (not instantaneous)
Memory: os.freemem() / os.totalmem()
Storage: 10x actual DB usage, minimum 100GB baseline
DB health: Prisma query response time measurement
Refresh: 10-second interval on frontend (auto-refresh)

## Health thresholds
green  → <50% utilization
blue   → 50-70%
yellow → 70-85%
red    → >85%

## Critical constraints
- NEVER simplify CPU calculation to instantaneous reading
- NEVER change the 10-second refresh interval
- NEVER remove admin role middleware check
- ALWAYS use code splitting (React.lazy) for admin panel
- HTTP caching headers are set on metrics endpoint — preserve them
- Admin routes use rate limiting — do not remove it

## Files to read first
apps/backend/src/app/ → admin routes and metrics calculation

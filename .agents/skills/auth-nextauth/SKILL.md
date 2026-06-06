# NextAuth Authentication Skill

## When to use this skill
Any task involving: login, logout, session, OAuth, protected routes,
role-based access, JWT verification, user profile, password reset.

## Pre-task checklist
1. Read NextAuth config in apps/frontend/lib/
2. Read auth middleware in apps/backend/
3. Check which OAuth providers are configured
4. Understand session vs JWT strategy in use

## Architecture
Frontend auth: NextAuth.js (Google, GitHub, email/password)
Backend auth: JWT + bcrypt (independent verification)
Session flow: NextAuth session → frontend passes JWT → 
  backend verifies JWT on protected routes

## Providers configured
- Google OAuth
- GitHub OAuth  
- Email/password (with bcrypt)
- Password reset via email verification

## Critical constraints
- NEVER suggest better-auth, Clerk, Auth0, or any replacement
- NEVER bypass auth middleware on backend protected routes
- NEVER store raw passwords — always bcrypt hash
- NEVER expose JWT secret in frontend code
- Session and JWT are separate concerns — do not conflate
- Role changes must come from backend — NextAuth session reflects role,
  not controls it

## Files to read first
apps/frontend/lib/ → NextAuth config and auth utilities
apps/backend/src/app/ → auth middleware and JWT verification

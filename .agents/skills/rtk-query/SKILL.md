# RTK Query Skill

## When to use this skill
Any task involving: API calls, data fetching, cache invalidation,
optimistic updates, loading/error states, Redux store changes.

## Pre-task checklist
1. Read the relevant slice in apps/frontend/redux/
2. Check existing providesTags patterns
3. Check existing invalidatesTags patterns
4. Identify which endpoints already exist

## Key patterns
Slice location: apps/frontend/redux/ → one file per domain
Base API: single createApi instance shared across slices
Tags: providesTags on queries, invalidatesTags on mutations
Optimistic: updateQueryData → patch → rollback on error

## Critical constraints
- NEVER make raw fetch() calls in components
- NEVER put API logic inside React components
- NEVER duplicate an endpoint that already exists in a slice
- ALWAYS add rollback on optimistic update error
- ALWAYS use the existing base API instance — never create a new one
- Cache tags must be consistent across all slices

## Files to read first
apps/frontend/redux/ → relevant domain slice

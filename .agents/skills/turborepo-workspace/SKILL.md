# Turborepo Workspace Skill

## When to use this skill
Any task involving: adding packages, workspace dependencies,
turbo pipeline changes, build configuration, shared packages,
running commands across workspaces.

## Pre-task checklist
1. Read turbo.json to understand current pipeline
2. Check root package.json for existing scripts
3. Identify which workspace the task belongs to

## Workspace names
@scholar-flow/frontend → apps/frontend
@scholar-flow/backend  → apps/backend

## Pipeline rules (from turbo.json)
build: depends on ^build (upstream must build first)
dev: cache=false, persistent=true, depends on ^dev
type-check: depends on ^build (needs build artifacts)
test: depends on ^build

## Adding a dependency
Workspace-specific: yarn workspace @scholar-flow/frontend add <package>
Root (shared):       yarn add -W <package>
Dev at root:         yarn add -DW <package>

## Critical constraints
- NEVER use pnpm or npm — yarn only
- NEVER run yarn install in apps/frontend or apps/backend directly
- ALWAYS run from root unless using workspace command
- NEVER modify turbo.json cache settings without understanding impact
- type-check and test require build to complete first
- dev pipeline is always cache=false (persistent watchers)

## Files to read first
turbo.json, root package.json

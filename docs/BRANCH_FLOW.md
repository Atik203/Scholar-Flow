# Branch Flow Documentation

## Overview

This repository uses a **strict one-way branch flow** to ensure code quality and prevent conflicts.

## Branch Flow Diagram

```
atik → dev → main
```

**Direction:** Always forward, never backward.

## Branch Descriptions

### `atik` (Development Branch)

- **Purpose**: Primary development branch for new features and bug fixes
- **Who uses**: Developers working on features
- **Merges to**: `dev` (automatic via GitHub Actions)
- **Receives from**: Feature branches (manual PRs)

### `dev` (Integration Branch)

- **Purpose**: Integration and testing of completed features
- **Who uses**: Automated workflows + testing
- **Merges to**: `main` (automatic via GitHub Actions)
- **Receives from**: `atik` (automatic merge)

### `main` (Production Branch)

- **Purpose**: Stable production-ready code
- **Who uses**: Production deployments
- **Merges to**: None (final destination)
- **Receives from**: `dev` (automatic via PR + auto-merge)

## Automated Workflows

### 1. `atik` → `dev` (Auto-merge)

- **Trigger**: Push to `atik` branch
- **Action**: Automatically merges `atik` into `dev`
- **File**: `.github/workflows/auto-merge-atik-to-dev.yml`
- **On Conflict**: Creates PR for manual resolution

### 2. `dev` → `main` (Auto-PR + Auto-merge)

- **Trigger**: Push to `dev` branch
- **Action**: Creates PR from `dev` to `main`, then auto-merges
- **Files**:
  - `.github/workflows/auto-create-pr-dev-to-main.yml`
  - `.github/workflows/auto-merge-pr.yml`

### 3. Branch Flow Guard (Protection)

- **Trigger**: Any PR to `atik` or `dev` branches
- **Action**: Prevents reverse merges (dev→atik, main→dev, main→atik)
- **File**: `.github/workflows/branch-flow-guard.yml`
- **On Violation**: Auto-closes PR and explains correct flow

## ✅ Valid Operations

### For Developers:

- Create feature branches from `atik`
- Create PRs: `feature-branch` → `atik`
- Push directly to `atik` (triggers auto-merge to dev)

### For Workflows:

- `atik` → `dev` (automatic)
- `dev` → `main` (automatic via PR)

## 🚫 Invalid Operations (Blocked)

### Reverse Merges (Prevented by automation):

- `dev` → `atik` ❌
- `main` → `dev` ❌
- `main` → `atik` ❌

### Manual Overrides:

- Force pushing to `main` ❌
- Direct pushes to `main` ❌
- Skipping the branch flow ❌

## Conflict Resolution

### When `atik` → `dev` Conflicts Occur:

1. **Automatic**: Workflow creates PR `atik` → `dev`
2. **Manual Resolution Options**:
   - **Option A**: Resolve conflicts directly in the PR
   - **Option B**: Checkout `atik` locally, resolve conflicts, push
   - **Option C**: Create feature branch from `atik`, resolve, merge back

### ⚠️ Important: Never Reverse Merge

- **Do NOT** merge `dev` into `atik` to resolve conflicts
- **Do NOT** merge `main` into `dev` to resolve conflicts
- Always resolve conflicts in the source branch or PR

## Development Workflow

### Starting New Work:

```bash
git checkout atik
git pull origin atik
git checkout -b feature/my-feature
# Make changes
git commit -m "feat: add new feature"
git push origin feature/my-feature
# Create PR: feature/my-feature → atik
```

### After PR is Merged to `atik`:

1. Push to `atik` triggers `atik` → `dev` merge
2. Push to `dev` triggers `dev` → `main` PR
3. PR auto-merges to `main`
4. Feature is live! 🚀

## Emergency Procedures

### Hotfixes:

- Create hotfix branch from `main`
- After fix, merge hotfix to `atik` (not directly to main)
- Follow normal flow: `atik` → `dev` → `main`

### Rollbacks:

- Never reverse merge
- Create revert commit in `atik`
- Follow normal flow for the revert

## Monitoring

### Check Workflow Status:

- GitHub Actions tab shows all automated merges
- Branch protection rules enforce the flow
- Failed merges create PRs for manual intervention

### Branch Status:

- `atik`: Latest development work
- `dev`: Integration testing
- `main`: Production-ready stable code

## Benefits of This Flow

1. **Prevents Conflicts**: One-way flow eliminates circular dependencies
2. **Automated Quality**: Each step can run tests/checks
3. **Clear History**: Linear progression of changes
4. **Safe Rollbacks**: Easy to revert without breaking flow
5. **Team Coordination**: Everyone follows same pattern

## Troubleshooting

### "My PR was auto-closed"

- Check that you're following correct flow direction
- Ensure PR is not a reverse merge (dev→atik, main→dev, etc.)
- Create new PR in correct direction

### "Merge conflicts in auto-merge"

- Don't panic! Workflow creates PR for manual resolution
- Never merge backwards to resolve
- Resolve in source branch or the created PR

### "Changes not appearing in main"

- Verify the flow: changes must go `atik` → `dev` → `main`
- Check GitHub Actions for failed workflows
- Ensure all automated steps completed successfully

---

**Last Updated**: August 26, 2025
**Maintained by**: Development Team
**Questions?** Check GitHub Actions logs or create an issue

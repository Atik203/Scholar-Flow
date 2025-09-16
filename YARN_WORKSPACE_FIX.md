# Yarn Workspace Fix Guide

## The Problem
The error `This package doesn't seem to be present in your lockfile` occurs due to:
1. Corrupted yarn.lock file
2. Peer dependency conflicts
3. Workspace configuration issues
4. Node modules inconsistencies

## Permanent Solution

### Method 1: Use the Clean Setup Script
```bash
# Run the clean setup script
yarn setup:clean
```

### Method 2: Manual Clean Installation
```bash
# 1. Clean everything
yarn clean

# 2. Remove lockfile and node_modules
rm yarn.lock
rm -rf node_modules
rm -rf apps/backend/node_modules
rm -rf apps/frontend/node_modules

# 3. Fresh install
yarn install

# 4. Generate Prisma client
yarn db:generate
```

### Method 3: Individual App Development
If workspace issues persist, run apps individually:

```bash
# Backend only
yarn dev:backend

# Frontend only  
yarn dev:frontend

# Or use turbo
yarn dev:turbo
```

## Configuration Files Added

### `.yarnrc.yml`
- Configures Yarn 4.9.2 properly
- Handles peer dependency conflicts
- Sets up package extensions for workspace packages

### Updated `package.json`
- Added React/React-DOM to root dependencies
- Added individual dev scripts
- Added clean setup script
- Removed conflicting packageExtensions

## Troubleshooting

### If you still get workspace errors:
1. **Check Yarn version**: `yarn --version` (should be 4.9.2)
2. **Clear Yarn cache**: `yarn cache clean`
3. **Use individual scripts**: `yarn dev:backend` or `yarn dev:frontend`
4. **Check workspace names**: Ensure `@scholar-flow/backend` and `@scholar-flow/frontend` match package.json names

### If peer dependency warnings persist:
- These are warnings, not errors
- The app will still work
- Dependencies are properly resolved via .yarnrc.yml

## Development Workflow

### Recommended Commands:
```bash
# Clean setup (when workspace issues occur)
yarn setup:clean

# Normal development
yarn dev:turbo

# Individual app development
yarn dev:backend    # Backend only
yarn dev:frontend   # Frontend only

# Database operations
yarn db:migrate     # Run migrations
yarn db:studio      # Open Prisma Studio
yarn db:seed        # Seed database
```

## Why This Happens

1. **Yarn 4.x Changes**: Yarn 4.x has different workspace handling than v1.x
2. **Peer Dependencies**: React 19 has strict peer dependency requirements
3. **Lockfile Corruption**: Sometimes yarn.lock gets corrupted during updates
4. **Node Modules Conflicts**: Different package managers can create conflicts

## Prevention

1. **Always use Yarn**: Don't mix npm and yarn
2. **Use clean scripts**: Use `yarn setup:clean` when issues occur
3. **Keep dependencies updated**: Regularly update workspace dependencies
4. **Use individual scripts**: When workspace fails, use individual app scripts

This solution provides multiple fallback options to ensure your development environment always works.

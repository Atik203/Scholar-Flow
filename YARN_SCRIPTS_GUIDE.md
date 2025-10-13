# Yarn Scripts Guide for Scholar-Flow

## Overview
This guide explains how to use the various yarn scripts available in the Scholar-Flow monorepo for development, building, testing, and deployment.

## Project Structure
Scholar-Flow is a monorepo with two main applications:
- **Frontend**: Next.js 15 application (`apps/frontend`)
- **Backend**: Node.js/Express API (`apps/backend`)

## Root Level Scripts (From project root)

### Development Scripts

#### `yarn dev`
**Description**: Start both frontend and backend in development mode
```bash
yarn dev
```
**What it does**:
- Starts backend server on port 3001 (or configured port)
- Starts frontend development server on port 3000
- Both run concurrently with hot reload

#### `yarn dev:turbo`
**Description**: Use Turbo for optimized development builds
```bash
yarn dev:turbo
```
**What it does**:
- Uses Turborepo for faster builds
- Runs both frontend and backend with caching
- Better performance for large monorepos

#### `yarn dev:frontend`
**Description**: Start only the frontend development server
```bash
yarn dev:frontend
```
**What it does**:
- Starts Next.js dev server on port 3000
- Uses Turbopack for faster builds
- Hot reload enabled

#### `yarn dev:backend`
**Description**: Start only the backend development server
```bash
yarn dev:backend
```
**What it does**:
- Starts Express server with ts-node-dev
- Auto-restart on file changes
- Database connection and API endpoints

### Build Scripts

#### `yarn build`
**Description**: Build both frontend and backend for production
```bash
yarn build
```
**What it does**:
- Compiles TypeScript to JavaScript
- Optimizes Next.js application
- Generates static pages where possible
- Creates production-ready backend

#### `yarn type-check`
**Description**: Run TypeScript type checking across all workspaces
```bash
yarn type-check
```
**What it does**:
- Validates TypeScript types
- Checks for type errors
- Runs on both frontend and backend
- No compilation, just type checking

### Testing Scripts

#### `yarn test`
**Description**: Run all tests across the monorepo
```bash
yarn test
```
**What it does**:
- Runs Jest tests for both frontend and backend
- Generates coverage reports
- Validates all functionality

### Linting Scripts

#### `yarn lint`
**Description**: Run ESLint across all workspaces
```bash
yarn lint
```
**What it does**:
- Checks code quality and style
- Enforces coding standards
- Runs on both frontend and backend

### Database Scripts

#### `yarn db:migrate`
**Description**: Run database migrations
```bash
yarn db:migrate
```
**What it does**:
- Applies pending Prisma migrations
- Updates database schema
- Creates migration files if needed

#### `yarn db:generate`
**Description**: Generate Prisma client
```bash
yarn db:generate
```
**What it does**:
- Generates TypeScript types from schema
- Updates Prisma client
- Required after schema changes

#### `yarn db:studio`
**Description**: Open Prisma Studio (Database GUI)
```bash
yarn db:studio
```
**What it does**:
- Opens web interface for database
- Browse and edit data
- Useful for development and debugging

#### `yarn db:seed`
**Description**: Seed database with initial data
```bash
yarn db:seed
```
**What it does**:
- Runs seed scripts
- Populates database with test data
- Useful for development setup

#### `yarn db:reset`
**Description**: Reset database (⚠️ DESTRUCTIVE)
```bash
yarn db:reset
```
**What it does**:
- Drops all data
- Re-runs all migrations
- Re-seeds database
- **WARNING**: This will delete all data!

### Utility Scripts

#### `yarn clean`
**Description**: Clean all build artifacts and node_modules
```bash
yarn clean
```
**What it does**:
- Removes .next, dist, node_modules
- Cleans Turbo cache
- Fresh start for builds

#### `yarn format`
**Description**: Format code with Prettier
```bash
yarn format
```
**What it does**:
- Formats all JS/TS/TSX/MD/JSON files
- Enforces consistent code style
- Auto-fixes formatting issues

#### `yarn setup`
**Description**: Initial project setup
```bash
yarn setup
```
**What it does**:
- Installs all dependencies
- Generates Prisma client
- Prepares project for development

#### `yarn setup:clean`
**Description**: Clean setup (removes everything first)
```bash
yarn setup:clean
```
**What it does**:
- Runs `yarn clean`
- Fresh install of dependencies
- Generates Prisma client
- Complete project reset

## Frontend-Specific Scripts (From `apps/frontend`)

### Development
```bash
cd apps/frontend
yarn dev          # Start Next.js dev server
yarn build        # Build for production
yarn start        # Start production server
yarn type-check   # TypeScript type checking
yarn lint         # ESLint checking
yarn test         # Run Jest tests
yarn clean        # Clean .next directory
```

### Frontend Build Process
1. **Type Checking**: `yarn type-check`
2. **Linting**: `yarn lint`
3. **Building**: `yarn build`
4. **Testing**: `yarn test`

## Backend-Specific Scripts (From `apps/backend`)

### Development
```bash
cd apps/backend
yarn dev          # Start with ts-node-dev
yarn build        # Compile TypeScript
yarn start        # Start compiled server
yarn type-check   # TypeScript type checking
yarn lint         # ESLint checking
yarn test         # Run Jest tests
yarn clean        # Clean dist directory
```

### Backend Build Process
1. **Type Checking**: `yarn type-check`
2. **Linting**: `yarn lint`
3. **Building**: `yarn build`
4. **Testing**: `yarn test`

## Common Workflows

### 1. First Time Setup
```bash
# Clone repository
git clone <repository-url>
cd Scholar-Flow

# Install dependencies and setup
yarn setup

# Start development servers
yarn dev
```

### 2. Daily Development
```bash
# Start both frontend and backend
yarn dev

# Or start individually
yarn dev:frontend  # Terminal 1
yarn dev:backend   # Terminal 2
```

### 3. Before Committing Code
```bash
# Type check
yarn type-check

# Lint code
yarn lint

# Run tests
yarn test

# Format code
yarn format
```

### 4. Production Build
```bash
# Build everything
yarn build

# Start production servers
yarn workspace @scholar-flow/backend start
yarn workspace @scholar-flow/frontend start
```

### 5. Database Management
```bash
# After schema changes
yarn db:generate
yarn db:migrate

# Reset database (development only)
yarn db:reset
yarn db:seed
```

## Troubleshooting

### Port Already in Use
If you get "address already in use" error:
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
yarn dev:frontend -- -p 3001
```

### Type Errors
```bash
# Check types
yarn type-check

# Fix and rebuild
yarn build
```

### Build Failures
```bash
# Clean and rebuild
yarn clean
yarn build
```

### Database Issues
```bash
# Reset database
yarn db:reset
yarn db:seed

# Or just regenerate client
yarn db:generate
```

## Environment Variables

Make sure you have the required environment variables:
- `.env.local` (frontend)
- `.env` (backend)

See `ENVIRONMENT.md` for detailed configuration.

## Performance Tips

1. **Use Turbo**: `yarn dev:turbo` for faster builds
2. **Parallel Development**: Use separate terminals for frontend/backend
3. **Type Checking**: Run `yarn type-check` before building
4. **Clean Builds**: Use `yarn clean` when experiencing issues

## Available URLs

After running `yarn dev`:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database Studio**: http://localhost:5555 (after `yarn db:studio`)

## Research Module Routes

The new research module includes these routes:
- `/dashboard/researcher/research` - Main research hub
- `/dashboard/researcher/research/citations` - Citation management
- `/dashboard/researcher/research/citations/export` - Citation export
- `/dashboard/researcher/research/citations/history` - Export history
- `/dashboard/researcher/research/citations/formats` - Format guide
- `/dashboard/researcher/research/discussions` - Research discussions
- `/dashboard/researcher/research/discussions/create` - Create discussion
- `/dashboard/researcher/research/discussions/[id]` - Discussion detail
- `/dashboard/researcher/research/activity-log` - Activity tracking
- `/dashboard/researcher/research/activity-log/export` - Export activity log

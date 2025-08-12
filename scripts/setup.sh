#!/bin/bash

# ScholarSphere Development Setup Script

echo "🚀 Setting up ScholarSphere development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 15+ with pgvector extension."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment files
echo "⚙️ Setting up environment files..."

if [ ! -f "apps/backend/.env" ]; then
    cp apps/backend/.env.example apps/backend/.env
    echo "✅ Created apps/backend/.env from example"
    echo "⚠️ Please update DATABASE_URL and other credentials in apps/backend/.env"
fi

if [ ! -f "apps/frontend/.env.local" ]; then
    cp apps/frontend/.env.example apps/frontend/.env.local
    echo "✅ Created apps/frontend/.env.local from example"
    echo "⚠️ Please update environment variables in apps/frontend/.env.local"
fi

# Database setup
echo "🗄️ Setting up database..."
echo "Please ensure PostgreSQL is running and update DATABASE_URL in .env files"
echo "Then run: npm run db:migrate"

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update environment variables in .env files"
echo "2. Ensure PostgreSQL is running with pgvector extension"
echo "3. Run: npm run db:migrate"
echo "4. Run: npm run dev"
echo ""
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API will be available at: http://localhost:5000"
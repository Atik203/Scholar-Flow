#!/bin/bash

# Fix Yarn workspace issues
echo "Cleaning up workspace..."

# Remove existing lockfile and node_modules
rm -f yarn.lock
rm -rf node_modules

# Remove app-specific node_modules
rm -rf apps/backend/node_modules
rm -rf apps/frontend/node_modules

echo "Installing dependencies..."
yarn install

echo "Setup complete!"

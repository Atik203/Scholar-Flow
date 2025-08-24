#!/bin/bash

# Pre-build script for Vercel deployment
# This script prepares the monorepo for deployment by resolving workspace dependencies

echo "Starting pre-build preparation..."

# Install yarn 4
npm install -g yarn@4.9.2

# Set yarn version
yarn set version 4.9.2

# Install dependencies
yarn install

echo "Pre-build preparation completed!"

#!/usr/bin/env node

/**
 * Deployment script for backend-only deployment on Vercel
 * This script temporarily modifies package.json files to avoid workspace dependency issues
 */

const fs = require('fs');
const path = require('path');

const rootPackageJsonPath = path.join(__dirname, '..', 'package.json');
const frontendPackageJsonPath = path.join(__dirname, '..', 'apps', 'frontend', 'package.json');

// Backup original files
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
const frontendPackageJson = JSON.parse(fs.readFileSync(frontendPackageJsonPath, 'utf8'));

// Create modified versions for deployment
const modifiedRootPackageJson = {
  ...rootPackageJson,
  workspaces: ["apps/backend", "packages/*"]
};

const modifiedFrontendPackageJson = {
  ...frontendPackageJson,
  dependencies: {
    ...frontendPackageJson.dependencies
  }
};

// Remove workspace dependencies from frontend for deployment
delete modifiedFrontendPackageJson.dependencies['@scholar-flow/seo'];
delete modifiedFrontendPackageJson.dependencies['@scholar-flow/types'];

// Write modified files
fs.writeFileSync(rootPackageJsonPath, JSON.stringify(modifiedRootPackageJson, null, 2));
fs.writeFileSync(frontendPackageJsonPath, JSON.stringify(modifiedFrontendPackageJson, null, 2));

console.log('✅ Modified package.json files for backend deployment');

// Restore original files after a delay (in case this is run locally)
if (process.env.VERCEL !== '1') {
  setTimeout(() => {
    fs.writeFileSync(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2));
    fs.writeFileSync(frontendPackageJsonPath, JSON.stringify(frontendPackageJson, null, 2));
    console.log('✅ Restored original package.json files');
  }, 5000);
}

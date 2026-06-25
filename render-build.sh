#!/usr/bin/env bash
# Render build script — enables Corepack so Yarn 4.9.2 is used
# instead of the global Yarn 1.x (which rejects packageManager field).
set -euo pipefail

corepack enable
yarn install --immutable
yarn build

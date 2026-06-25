#!/usr/bin/env bash
# Render build script — uses Corepack's built-in proxy to run Yarn 4.9.2
# instead of the global Yarn 1.x. Avoids `corepack enable` which needs
# write access to /usr/bin (read-only on Render).
set -euo pipefail

corepack yarn install --immutable
corepack yarn build

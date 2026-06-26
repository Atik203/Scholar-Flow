#!/usr/bin/env bash
# Render build script — uses corepack yarn directly instead of `corepack enable`.
# `corepack enable` fails on Render because /usr/bin is read-only (EROFS).
set -euo pipefail

corepack yarn install --immutable
corepack yarn build

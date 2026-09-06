#!/usr/bin/env bash
# Render build script — uses corepack yarn directly instead of `corepack enable`.
# `corepack enable` fails on Render because /usr/bin is read-only (EROFS).
set -euo pipefail

# Install native PDF extraction tools (poppler: pdftotext + pdfinfo + pdftoppm)
# pdftotext = 100x faster than PDF.js for text-based PDFs
# pdftoppm = convert PDF pages to images (needed for OCR fallback)
apt-get update -qq && apt-get install -y -qq poppler-utils

corepack yarn install --immutable
corepack yarn build

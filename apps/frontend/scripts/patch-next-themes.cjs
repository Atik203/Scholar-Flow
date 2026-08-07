#!/usr/bin/env node
/**
 * Patch next-themes@0.4.6 to fix React 19/Next.js 16 script-in-component error.
 *
 * The next-themes ThemeProvider renders a <script> tag to prevent theme flash
 * on initial paint. React 19 warns/errors when <script> is rendered inside a
 * React component (it never executes on the client).
 *
 * Fix: return null in the script-renderer component when window is defined
 * (i.e. we're on the client). The script still runs during SSR.
 *
 * Source: https://github.com/shadcn-ui/ui/pull/10238
 *
 * IMPORTANT: The package's exports map resolves bundler imports to
 * ./dist/index.mjs and require() to ./dist/index.js. Both must be patched —
 * Turbopack/webpack bundle the .mjs file.
 *
 * Idempotent: safe to re-run; will skip if already patched.
 */
const fs = require("fs");
const path = require("path");

const DIST_DIR = path.join(__dirname, "..", "node_modules", "next-themes", "dist");

const MARKER = "if(typeof window!==\"undefined\")return null;";

const TARGETS = [
  {
    file: "index.js",
    search:
      'Y=t.memo(({forcedTheme:e,storageKey:s,attribute:n,enableSystem:l,enableColorScheme:o,defaultTheme:d,value:u,themes:h,nonce:m,scriptProps:w})=>{let p=',
    replacement:
      'Y=t.memo(({forcedTheme:e,storageKey:s,attribute:n,enableSystem:l,enableColorScheme:o,defaultTheme:d,value:u,themes:h,nonce:m,scriptProps:w})=>{if(typeof window!=="undefined")return null;let p=',
  },
  {
    file: "index.mjs",
    search:
      '_=t.memo(({forcedTheme:e,storageKey:i,attribute:s,enableSystem:u,enableColorScheme:m,defaultTheme:a,value:l,themes:h,nonce:d,scriptProps:w})=>{let p=',
    replacement:
      '_=t.memo(({forcedTheme:e,storageKey:i,attribute:s,enableSystem:u,enableColorScheme:m,defaultTheme:a,value:l,themes:h,nonce:d,scriptProps:w})=>{if(typeof window!=="undefined")return null;let p=',
  },
];

if (!fs.existsSync(DIST_DIR)) {
  console.log("[patch-next-themes] next-themes not installed yet; skipping");
  process.exit(0);
}

let patchedAny = false;
let skippedAny = false;

for (const target of TARGETS) {
  const filePath = path.join(DIST_DIR, target.file);

  if (!fs.existsSync(filePath)) {
    console.log(`[patch-next-themes] ${target.file} not found; skipping`);
    continue;
  }

  const original = fs.readFileSync(filePath, "utf8");

  if (original.includes(MARKER)) {
    console.log(`[patch-next-themes] ${target.file} already patched; skipping`);
    skippedAny = true;
    continue;
  }

  if (!original.includes(target.search)) {
    console.log(
      `[patch-next-themes] WARN: pattern not found in ${target.file}; next-themes version may have changed`
    );
    skippedAny = true;
    continue;
  }

  const patched = original.replace(target.search, target.replacement);
  fs.writeFileSync(filePath, patched, "utf8");
  console.log(`[patch-next-themes] patched next-themes/dist/${target.file} (client-side script render suppressed)`);
  patchedAny = true;
}

if (!patchedAny && !skippedAny) {
  console.log("[patch-next-themes] nothing to do");
}

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
 * Idempotent: safe to re-run; will skip if already patched.
 */
const fs = require("fs");
const path = require("path");

const TARGET = path.join(
  __dirname,
  "..",
  "node_modules",
  "next-themes",
  "dist",
  "index.js"
);

const MARKER = "if(typeof window!==\"undefined\")return null;";
const SEARCH =
  'Y=t.memo(({forcedTheme:e,storageKey:s,attribute:n,enableSystem:l,enableColorScheme:o,defaultTheme:d,value:u,themes:h,nonce:m,scriptProps:w})=>{let p=';

if (!fs.existsSync(TARGET)) {
  console.log("[patch-next-themes] next-themes not installed yet; skipping");
  process.exit(0);
}

const original = fs.readFileSync(TARGET, "utf8");

if (original.includes(MARKER)) {
  console.log("[patch-next-themes] already patched; skipping");
  process.exit(0);
}

if (!original.includes(SEARCH)) {
  console.log(
    "[patch-next-themes] WARN: target pattern not found; next-themes version may have changed"
  );
  process.exit(0);
}

const patched = original.replace(
  SEARCH,
  'Y=t.memo(({forcedTheme:e,storageKey:s,attribute:n,enableSystem:l,enableColorScheme:o,defaultTheme:d,value:u,themes:h,nonce:m,scriptProps:w})=>{if(typeof window!=="undefined")return null;let p='
);

fs.writeFileSync(TARGET, patched, "utf8");
console.log("[patch-next-themes] patched next-themes/dist/index.js (client-side script render suppressed)");

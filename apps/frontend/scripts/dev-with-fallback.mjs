#!/usr/bin/env node
import { spawn } from 'node:child_process';
import net from 'node:net';

const candidatePorts = [3000, 4000];

function checkPort(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once('error', () => {
      resolve(false);
    });
    srv.once('listening', () => {
      srv.close(() => resolve(true));
    });
    srv.listen(port, '0.0.0.0');
  });
}

(async () => {
  let chosen;
  for (const p of candidatePorts) {
     
    if (await checkPort(p)) { chosen = p; break; }
  }
  if (!chosen) {
    console.error(`No free port among: ${candidatePorts.join(', ')}`);
    process.exit(1);
  }
  console.log(`Starting Next.js dev server on port ${chosen}`);
  const cmd = `yarn next dev --turbopack -p ${chosen}`;
  const child = spawn(cmd, {
    stdio: 'inherit',
    env: { ...process.env, PORT: String(chosen), NEXTAUTH_URL: `http://localhost:${chosen}` },
    cwd: process.cwd(),
    shell: true
  });
  child.on('exit', (code) => process.exit(code ?? 0));
})();

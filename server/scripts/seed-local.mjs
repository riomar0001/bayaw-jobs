// Seeds the local D1 database by running the Worker's own nightly-reset cron
// handler under `wrangler dev`, so local data is built by the same code as production.
// With --remote it then copies that data into the remote D1 database (first deploy).
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PORT = 8799;
const READY_TIMEOUT_MS = 60_000;
const RESET_TIMEOUT_MS = 120_000;
const WRANGLER = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));
const IS_WINDOWS = process.platform === 'win32';
const DATABASE = 'bayaw-jobs-db';
const EXPORT_FILE = '.wrangler/seed.sql';
const REMOTE = process.argv.includes('--remote');

function wrangler(args) {
  const result = spawnSync(process.execPath, [WRANGLER, ...args], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`wrangler ${args.join(' ')} failed (exit ${result.status})`);
}

/** Every table created by the D1 migrations. */
function appTables() {
  const dir = fileURLToPath(new URL('../prisma/migrations-d1/', import.meta.url));
  const tables = readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .flatMap((f) => [...readFileSync(join(dir, f), 'utf8').matchAll(/CREATE TABLE "([^"]+)"/g)].map((m) => m[1]));
  if (tables.length === 0) throw new Error('No tables found in prisma/migrations-d1');
  return [...new Set(tables)];
}

/** Copies the freshly seeded local data into the remote database. */
function pushToRemote() {
  wrangler(['d1', 'export', DATABASE, '--local', '--no-schema', '--output', EXPORT_FILE]);
  // The remote database keeps its own migration history; never overwrite it.
  const lines = readFileSync(EXPORT_FILE, 'utf8')
    .split('\n')
    .filter((line) => !line.startsWith('INSERT INTO "d1_migrations"'));
  // Clear every app table first so this also works on a database that already has data.
  // The file runs as one transaction and foreign keys are deferred, so order doesn't matter.
  const wipe = appTables().map((table) => `DELETE FROM "${table}";`);
  const [pragma, ...inserts] = lines;
  if (!pragma?.startsWith('PRAGMA defer_foreign_keys')) {
    throw new Error('Unexpected export format: missing PRAGMA defer_foreign_keys header');
  }
  writeFileSync(EXPORT_FILE, [pragma, ...wipe, ...inserts].join('\n'));
  wrangler(['d1', 'execute', DATABASE, '--remote', '--file', EXPORT_FILE, '--yes']);
}

const dev = spawn(process.execPath, [WRANGLER, 'dev', '--test-scheduled', '--port', String(PORT)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  // Own process group on POSIX so the workerd child dies with it.
  detached: !IS_WINDOWS,
});

let output = '';
let stopped = false;
// wrangler starts workerd as a child; killing only wrangler would leave it holding the port.
const stop = () => {
  if (stopped || dev.exitCode !== null || dev.pid === undefined) return;
  stopped = true;
  if (IS_WINDOWS) {
    spawnSync('taskkill', ['/pid', String(dev.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    try {
      process.kill(-dev.pid, 'SIGTERM');
    } catch {
      // Already exited.
    }
  }
};
process.on('exit', stop);

function waitForReady() {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('wrangler dev did not start in time')), READY_TIMEOUT_MS);
    const onData = (chunk) => {
      output += chunk;
      if (output.includes('Ready on')) {
        clearTimeout(timer);
        resolve();
      }
    };
    dev.stdout.on('data', onData);
    dev.stderr.on('data', onData);
    dev.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`wrangler dev exited early (code ${code})\n${output}`));
    });
  });
}

try {
  await waitForReady();
  const res = await fetch(`http://localhost:${PORT}/__scheduled?cron=0+16+*+*+*`, {
    signal: AbortSignal.timeout(RESET_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Scheduled handler returned ${res.status}`);

  // The handler runs in waitUntil; wait for its completion log line.
  const deadline = Date.now() + RESET_TIMEOUT_MS;
  while (!output.includes('Demo reset finished')) {
    if (output.includes('Demo reset failed')) throw new Error(`Reset failed:\n${output}`);
    if (Date.now() > deadline) throw new Error('Reset did not finish in time');
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log('Local D1 seeded with demo data.');
  stop();

  if (REMOTE) {
    pushToRemote();
    console.log('Remote D1 seeded with demo data.');
  }
  process.exitCode = 0;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  stop();
}

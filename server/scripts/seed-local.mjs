// Seeds the local D1 database by running the Worker's own nightly-reset cron
// handler under `wrangler dev`, so local data is built by the same code as production.
import { spawn } from 'node:child_process';

const PORT = 8799;
const READY_TIMEOUT_MS = 60_000;
const RESET_TIMEOUT_MS = 120_000;

const dev = spawn('npx', ['wrangler', 'dev', '--test-scheduled', '--port', String(PORT)], {
  shell: true,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let output = '';
const stop = () => {
  if (!dev.killed) dev.kill();
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
  process.exitCode = 0;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  stop();
}

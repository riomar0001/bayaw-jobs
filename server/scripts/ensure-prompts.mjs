// BayawSec keeps its real AI prompts in a gitignored file (src/services/assessment/ai/prompts.ts).
// If a fresh clone doesn't have it yet, copy the committed example so dev, type-check and
// deploy still work. The example prompts are placeholders; replace them in prompts.ts.
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'services', 'assessment', 'ai');
const target = join(dir, 'prompts.ts');
const example = join(dir, 'prompts.example.ts');

if (!existsSync(target)) {
  copyFileSync(example, target);
  console.log('[ensure-prompts] Created src/services/assessment/ai/prompts.ts from prompts.example.ts');
}

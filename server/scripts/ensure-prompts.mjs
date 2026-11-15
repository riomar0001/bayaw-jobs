// The AI services import src/services/assessment/ai/prompts.ts. The AI integration role writes
// and commits that file. Until it exists, copy the committed template so dev, type-check and
// deploy still work. The template's prompts are placeholders.
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

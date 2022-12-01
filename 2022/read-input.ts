import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';

export function getDirName(importMetaUrl: string): string {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = dirname(__filename);
  return __dirname;
}

export async function readInput(dir: string): Promise<string> {
  return await readFile(resolve(dir, 'input.txt'), 'utf-8');
}

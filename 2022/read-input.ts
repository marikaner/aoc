import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';

export function getDirName(fileUrl: string): string {
  const __filename = fileURLToPath(fileUrl);
  const __dirname = dirname(__filename);
  return __dirname;
}

export async function readInput(fileUrl: string): Promise<string> {
  return await readFile(resolve(getDirName(fileUrl), 'input.txt'), 'utf-8');
}

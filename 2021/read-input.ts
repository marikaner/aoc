import { promises } from 'fs';
import { resolve } from 'path';
const { readFile } = promises;

export async function readInput(dir: string): Promise<string> {
  return await readFile(resolve(dir, 'input.txt'), 'utf-8');
}

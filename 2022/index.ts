import { readInput, getDirName } from './read-input.js';

const input = (await readInput(getDirName(import.meta.url)))
  .split('\n')
  .map((line) => parseInt(line));

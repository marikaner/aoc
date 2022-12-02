import { readInput, getDirName } from './read-input.js';

const input = (await readInput(getDirName(import.meta.url))).split('\n');

const something = input.map((line) => parseInt(line));

function task1() {}

function task2() {}

console.log(task1());
console.log(task2());

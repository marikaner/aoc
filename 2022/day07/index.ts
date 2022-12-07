import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const terminalOutput = input.split('\n');

function cd(dir: Record<string, any>, to: string) {
  return to === '..' ? dir[to] : dir.dirs[to];
}

function mkdir(dir: Record<string, any>, newDir: string) {
  if (!(newDir in dir)) {
    dir.dirs[newDir] = { '..': dir, files: [], dirs: {} };
  }
}

function getDirSize(dir, dirSizes): number {
  const subDirsSize = Object.values(dir.dirs).reduce(
    (sum: number, subDir: Record<string, any>) =>
      sum + getDirSize(subDir, dirSizes),
    0
  );

  const filesSize = dir.files.reduce((sum, fileSize) => sum + fileSize, 0);
  const size = filesSize + subDirsSize;
  dirSizes.push(size);
  return size;
}

function buildFs() {
  const fs = { files: [], dirs: {} };
  let dir = fs;
  for (const line of terminalOutput.splice(1)) {
    if (line.startsWith('$ cd')) {
      dir = cd(dir, line.split(' ').pop());
    } else if (line.startsWith('dir')) {
      mkdir(dir, line.split(' ').pop());
    } else if (/^\d/.test(line)) {
      const fileSize = parseInt(line.split(' ').shift());
      dir.files.push(fileSize);
    }
  }

  return fs;
}

const fs = buildFs();
const dirSizes = [];
const usedSpace = getDirSize(fs, dirSizes);

const diskSpace = 70000000;
const requiredSpace = 30000000;

function task1() {
  return dirSizes
    .filter((size) => size <= 100000)
    .reduce((sum, dirSize) => sum + dirSize, 0);
}

function task2() {
  const freeSpace = diskSpace - usedSpace;
  const missingSpace = requiredSpace - freeSpace;
  return Math.min(...dirSizes.filter((size) => size >= missingSpace));
}

console.log(task1());
console.log(task2());

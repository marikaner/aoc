import { readInput } from '../read-input';

async function getInput(): Promise<Instruction[]> {
  return (await readInput(__dirname)).split('\n').map((line) => {
    const [command, num] = line.split(' ');
    return {
      command: command as Command,
      num: parseInt(num)
    };
  });
}

type Command = 'forward' | 'down' | 'up';

type Instruction = {
  command: Command;
  num: number;
};

type Pos = {
  pos: number;
  depth: number;
  aim: number;
};

async function getPos(): Promise<Pos> {
  return (await getInput()).reduce(
    (pos: Pos, { command, num }: Instruction) => {
      switch (command) {
        case 'forward':
          pos.pos += num;
          pos.depth += num * pos.aim;
          return pos;
        case 'down':
          pos.aim += num;
          return pos;
        case 'up':
          pos.aim -= num;
          return pos;
      }
    },
    {
      pos: 0,
      depth: 0,
      aim: 0
    }
  );
}

async function main() {
  const { pos, depth } = await getPos();
  console.log(pos * depth);
}

main();

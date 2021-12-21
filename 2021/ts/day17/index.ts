import { readInput } from '../read-input';

async function getInput(): Promise<TargetArea> {
  const input = await readInput(__dirname);
  const match = input.match(
    /.*x=(?<x1>-?\d*)\.\.(?<x2>-?\d*), y=(?<y1>[-]?\d*)\.\.(?<y2>[-]?\d*)/
  );
  const groups = match?.groups;
  return {
    x1: parseInt(groups?.x1!),
    x2: parseInt(groups?.x2!),
    y1: parseInt(groups?.y1!),
    y2: parseInt(groups?.y2!)
  };
}

interface TargetArea {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

class Probe {
  maxY = 0;
  possibilities = 0;
  constructor(private targetArea: TargetArea) {
    this.simulate();
  }

  private step(vx: number, vy: number) {
    const { x1, x2, y1, y2 } = this.targetArea;
    let maxY = 0;
    let x = 0;
    let y = 0;
    while (x <= x2 && y >= y1) {
      x += vx;
      y += vy;
      maxY = Math.max(maxY, y);
      if (x >= x1 && x <= x2 && y <= y2 && y >= y1) {
        this.possibilities++;
        this.maxY = Math.max(this.maxY, maxY);
        break;
      }
      vx = vx > 0 ? vx - 1 : vx;
      vy--;
    }
  }

  private simulate() {
    for (let vx = 0; vx <= this.targetArea.x2; vx++) {
      for (let vy = this.targetArea.y1; vy <= -this.targetArea.y1; vy++) {
        this.step(vx, vy);
      }
    }
  }
}

async function main() {
  const targetArea = await getInput();
  const probe = new Probe(targetArea);
  console.log(probe.maxY);
  console.log(probe.possibilities);
}

main();

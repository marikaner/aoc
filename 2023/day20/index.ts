import { readInput } from '../read-input.js';
import { memoize } from '../util.js';

const input = await readInput(import.meta.url);

const moduleArr = input.split('\n').map((line) => {
  const [moduleStr, destinationsStr] = line.split(' -> ');
  const destinations = destinationsStr.split(', ');

  const module =
    moduleStr === 'broadcaster'
      ? { type: moduleStr, name: moduleStr, destinations }
      : {
          type: moduleStr.slice(0, 1),
          name: moduleStr.slice(1),
          destinations
        };

  if (module.type === '%') {
    return { ...module, on: false };
  }
  if (module.type === '&') {
    return { ...module, memory: {} };
  }
  return module;
});
const conjunctions = moduleArr.filter(
  ({ type }) => type === '&'
) as Conjunction[];

conjunctions.forEach((conjunction) => {
  conjunction.memory = moduleArr
    .filter(({ destinations }) => destinations.includes(conjunction.name))
    .reduce((prev, { name }) => ({ ...prev, [name]: false }), {});
});
const modules: Record<string, FlipFlop | Conjunction | Broadcaster> =
  moduleArr.reduce((prev, module) => ({ ...prev, [module.name]: module }), {});

interface Module {
  name: string;
  destinations: string[];
}

interface Broadcaster extends Module {
  type: 'broadcaster';
}

interface FlipFlop extends Module {
  type: '%';
  on: boolean;
}

interface Conjunction extends Module {
  type: '&';
  // high = true, low = false
  memory: Record<string, boolean>;
}

interface Signal {
  from: string;
  to: string;
  pulse: boolean;
}

const count = {
  high: 0,
  low: 0
};

function processSignals(messageQueue: Signal[]) {
  while (messageQueue.length) {
    if (messageQueue.find(({ to, pulse }) => to === 'rx' && !pulse)) {
      return false;
    }
    const { from, to, pulse } = messageQueue.shift();
    count[pulse ? 'high' : 'low']++;

    const module = modules[to];
    if (module?.type === '%') {
      messageQueue.push(...processFlipFlop(module, pulse));
    } else if (module?.type === '&') {
      messageQueue.push(...processConjunction(from, module, pulse));
    } else {
      messageQueue.push(
        ...(module?.destinations || []).map((destination) => ({
          from: module.name,
          to: destination,
          pulse
        }))
      );
    }
  }
  return true;
}

const processFlipFlop = memoize(
  function processFlipFlop(flipFlop: FlipFlop, pulse: boolean) {
    if (pulse) {
      return [];
    }
    flipFlop.on = !flipFlop.on;
    return flipFlop.destinations.map((destination) => ({
      from: flipFlop.name,
      to: destination,
      pulse: flipFlop.on
    }));
  },
  (flipFlop, pulse) => [JSON.stringify(flipFlop), pulse].join(':')
);

const processConjunction = memoize(
  function processConjunction(
    from: string,
    conjunction: Conjunction,
    pulse: boolean
  ) {
    conjunction.memory[from] = pulse;
    const nextPulse = Object.values(conjunction.memory).some(
      (pulseMemory) => !pulseMemory
    );
    return conjunction.destinations.map((destination) => ({
      from: conjunction.name,
      to: destination,
      pulse: nextPulse
    }));
  },
  (from, conjunction, pulse) =>
    [from, JSON.stringify(conjunction), pulse].join(':')
);

function part1() {
  for (let i = 0; i < 1000; i++) {
    processSignals([
      {
        from: 'button',
        to: 'broadcaster',
        pulse: false
      }
    ]);
  }
  return count.low * count.high;
}

function part2() {
  let buttonPressCount = 1;
  let shouldContinue;
  while (
    (shouldContinue = processSignals([
      { from: 'button', to: 'broadcaster', pulse: false }
    ])) === true
  ) {
    console.log(buttonPressCount);
    buttonPressCount++;
  }
  return buttonPressCount;
}

console.log(part1());
// console.log(part2());

// broadcaster -> a
// %a -> inv, con
// &inv -> b
// %b -> con
// &con -> output

const tree = {
  output: {
    pulse: false,
    dependencies: {
      con: {
        pulse:
      }
    }
  }
}

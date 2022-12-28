import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

interface Robot {
  type: keyof Wallet;
  price: { unit: keyof Wallet; amount: number }[];
}

interface Blueprint {
  robots: Robot[];
  maxValues: Record<keyof Wallet, number>;
}

interface Wallet {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
}

interface State {
  production: Wallet;
  wallet: Wallet;
  path: (string | undefined)[];
}

const blueprints: Blueprint[] = input.split('\n').map((line) => {
  const groups = line.match(
    /Blueprint \d+: Each ore robot costs (?<oreOre>\d+) ore. Each clay robot costs (?<clayOre>\d+) ore. Each obsidian robot costs (?<obsidianOre>\d+) ore and (?<obsidianClay>\d+) clay. Each geode robot costs (?<geodeOre>\d+) ore and (?<geodeObsidian>\d+) obsidian./
  ).groups;
  const robots = [
    {
      type: 'geode',
      price: [
        {
          amount: parseInt(groups.geodeOre),
          unit: 'ore'
        },
        {
          amount: parseInt(groups.geodeObsidian),
          unit: 'obsidian'
        }
      ]
    },
    {
      type: 'obsidian',
      price: [
        {
          amount: parseInt(groups.obsidianOre),
          unit: 'ore'
        },
        {
          amount: parseInt(groups.obsidianClay),
          unit: 'clay'
        }
      ]
    },
    {
      type: 'clay',
      price: [
        {
          amount: parseInt(groups.clayOre),
          unit: 'ore'
        }
      ]
    },
    {
      type: 'ore',
      price: [
        {
          amount: parseInt(groups.oreOre),
          unit: 'ore'
        }
      ]
    }
  ] satisfies Robot[];
  return {
    robots,
    maxValues: {
      ore: Math.max(...robots.map((robot) => robot.price[0].amount)),
      clay: robots[1].price[1].amount,
      obsidian: robots[0].price[1].amount,
      geode: Number.MAX_SAFE_INTEGER
    }
  };
});

const initialState = {
  production: {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0
  },
  wallet: {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0
  },
  path: []
};

function drill(times = 1, state: State) {
  Object.entries(state.production).forEach(([unit, amount]) => {
    state.wallet[unit] += amount * times;
  });
}

function canAfford(robot: Robot, { wallet }: State): boolean {
  return robot.price.every(({ unit, amount }) => wallet[unit] >= amount);
}

function hasTotalProduction(robot: Robot, { production }: State): boolean {
  return robot.price.every(({ unit, amount }) => production[unit] >= amount);
}

function pay(robot: Robot, state: State) {
  if (robot) {
    robot.price.forEach(({ unit, amount }) => {
      state.wallet[unit] -= amount;
    });
  }
}

function build(robot: Robot, state: State) {
  if (robot) {
    state.production[robot.type] += 1;
  }
}

function getGeodePotential({ wallet, production }: State, timeLeft: number) {
  return (
    wallet.geode + production.geode * timeLeft + (timeLeft * (timeLeft - 1)) / 2
  );
}

function getAffordableRobots(blueprint: Blueprint, state: State) {
  let affordableRobots = blueprint.robots.filter(
    (robot) =>
      canAfford(robot, state) &&
      state.production[robot.type] < blueprint.maxValues[robot.type] &&
      !couldBuyBefore(state, robot)
  );

  if (hasTotalProduction(blueprint.robots[0], state)) {
    affordableRobots = [blueprint.robots[0]];
  } else {
    affordableRobots = [undefined, ...(affordableRobots || [])];
  }
  return affordableRobots;
}

function getMaxGeodes(states: State[], maxedOut: number) {
  return states.reduce(
    (max, { wallet }) => (wallet.geode > max ? wallet.geode : max),
    maxedOut
  );
}

function simulate(
  blueprint: Blueprint,
  states: State[],
  maxedOut: number,
  timeLeft: number
) {
  if (!timeLeft) {
    return getMaxGeodes(states, maxedOut);
  }
  let newStates = states.flatMap((state) => {
    return getAffordableRobots(blueprint, state).map((robot) => {
      const newState = cloneState(state);
      newState.path.push(robot?.type);
      pay(robot, newState);
      drill(1, newState);
      build(robot, newState);
      return newState;
    });
  });

  const max = getMaxGeodes(states, maxedOut);

  if (max && timeLeft) {
    newStates = newStates.filter(
      (state) => getGeodePotential(state, timeLeft - 1) > max
    );
  }
  const newMaxedOut = newStates.filter((state) =>
    hasTotalProduction(blueprint.robots[0], state)
  );

  if (newMaxedOut.length) {
    maxedOut = Math.max(
      ...newMaxedOut.map(
        (state) => (state.wallet.geode = getGeodePotential(state, timeLeft - 1))
      )
    );
    newStates = newStates.filter(
      (state) => !hasTotalProduction(blueprint.robots[0], state)
    );
  }

  return simulate(blueprint, newStates, maxedOut, timeLeft - 1);
}

function cloneState({ production, wallet, path }: State): State {
  return {
    production: { ...production },
    wallet: { ...wallet },
    path: [...path]
  };
}

function couldBuyBefore(state: State, robot: Robot): boolean {
  if (!state.path.at(-1)) {
    const newState = cloneState(state);
    drill(-1, newState);
    return canAfford(robot, newState);
  }
}

function getGeodesByBlueprint(blueprints: Blueprint[], totalTime: number) {
  return blueprints.map((blueprint) =>
    simulate(blueprint, [cloneState(initialState)], 0, totalTime)
  );
}

function task1() {
  return getGeodesByBlueprint(blueprints, 24).reduce(
    (sum, geodes, i) => sum + geodes * (i + 1),
    0
  );
}

function task2() {
  return getGeodesByBlueprint(blueprints.slice(0, 3), 32).reduce(
    (prod, geodes) => prod * geodes,
    1
  );
}

console.log(task1());
console.log(task2());

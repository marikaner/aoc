import { stat } from 'node:fs';
import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

interface Robot {
  type: keyof Wallet;
  price: { unit: keyof Wallet; amount: number }[];
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
}

const blueprints: Robot[][] = input.split('\n').map((line) => {
  const groups = line.match(
    /Blueprint \d+: Each ore robot costs (?<oreOre>\d+) ore. Each clay robot costs (?<clayOre>\d+) ore. Each obsidian robot costs (?<obsidianOre>\d+) ore and (?<obsidianClay>\d+) clay. Each geode robot costs (?<geodeOre>\d+) ore and (?<geodeObsidian>\d+) obsidian./
  ).groups;
  return [
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
  ];
});

const initialProduction = {
  ore: 1,
  clay: 0,
  obsidian: 0,
  geode: 0
};

const initialWallet = {
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0
};

let production = {} as Wallet;
let wallet = {} as Wallet;

function drill(times = 1, state = { production, wallet }) {
  Object.entries(state.production).forEach(([unit, amount]) => {
    state.wallet[unit] += amount * times;
  });
}

function canAfford(robot: Robot): boolean {
  return robot.price.every(({ unit, amount }) => wallet[unit] >= amount);
}

function hasProduction(robot: Robot): boolean {
  return robot.price.every(({ unit }) => production[unit]);
}

function getTimeToAfford(robot: Robot, state = { wallet, production }): number {
  return Math.max(
    0,
    ...robot.price.map(({ unit, amount }) =>
      Math.ceil((amount - state.wallet[unit]) / state.production[unit])
    )
  );
}

function getTimeToAffordWithPreBot(robot: Robot, preBot: Robot): number {
  const timeToAffordPreBot = getTimeToAfford(preBot);
  const newState = { wallet: { ...wallet }, production: { ...production } };
  drill(timeToAffordPreBot + 1, newState);
  pay(preBot, newState);
  build(preBot, newState);
  const timeToAfford = getTimeToAfford(robot, newState);
  return timeToAffordPreBot + timeToAfford;
}

function getPreBot(robot: Robot, blueprint: Robot[]) {
  if (robot.type !== 'ore') {
    return blueprint.find(({ type }) => type === robot.price.at(-1).unit);
  }
}

function getPostBot(robot: Robot, blueprint: Robot[]) {
  if (robot.type !== 'geode') {
    return blueprint.find(({ price }) => price.at(-1).unit === robot.type);
  }
}

function shouldBuildRobot(robot: Robot, blueprint: Robot[]): boolean {
  if (canAfford(robot)) {
    return true;
  }
  if (!hasProduction(robot)) {
    return false;
  }
  const postBot = getPostBot(robot, blueprint);
  if (postBot && production[robot.type] >= postBot.price.at(-1).amount) {
    return false;
  }

  const timeToAfford = getTimeToAfford(robot);
  console.log(robot.type);
  console.log('timeToAfford', timeToAfford);
  const preBot = getPreBot(robot, blueprint);
  if (preBot) {
    const timeToAffordWithNext = getTimeToAffordWithPreBot(robot, preBot);
    console.log('timeToAffordWithNext', timeToAffordWithNext);

    if (timeToAffordWithNext === timeToAfford) {
      console.log('same', robot.type, preBot.type);
    }
    return timeToAffordWithNext > timeToAfford;
  }
  return true;
}

function getNextRobot(blueprint: Robot[]) {
  for (const robot of blueprint) {
    if (shouldBuildRobot(robot, blueprint)) {
      return robot;
    }
  }
}

function pay(robot: Robot, state = { wallet }) {
  if (robot) {
    robot.price.forEach(({ unit, amount }) => {
      state.wallet[unit] -= amount;
    });
  }
}

function build(robot: Robot, state = { production }) {
  if (robot) {
    state.production[robot.type] += 1;
  }
}

// function getPostBot(robot: Robot, blueprint: Robot[]) {
//   if (robot.type !== 'geode') {
//     return blueprint.find(({ price }) => price.at(-1).unit === robot.type);
//   }
// }

function getQualityLevel(geodesByBlueprint) {
  return geodesByBlueprint.reduce(
    (sum, geodes, i) => sum + geodes * (i + 1),
    0
  );
}

function task1() {
  const geodesByBlueprint = [];
  blueprints.forEach((blueprint) => {
    production = { ...initialProduction };
    wallet = { ...initialWallet };
    let newRobot = getNextRobot(blueprint);
    let canAffordNewRobot = true;
    for (let i = 0; i < 24; i++) {
      canAffordNewRobot = canAfford(newRobot);
      console.log(i + 1, canAffordNewRobot ? newRobot?.type : 'wait');
      if (canAffordNewRobot) {
        pay(newRobot);
      }
      drill();
      if (canAffordNewRobot) {
        build(newRobot);
        newRobot = getNextRobot(blueprint);
      }
    }
    console.log(wallet);
    geodesByBlueprint.push(wallet.geode);
  });

  console.log(geodesByBlueprint);
  return getQualityLevel(geodesByBlueprint);
}

function getDurationUntilNextGeode() {
  const prodOre = { ...production, ore: production.ore + 1 };

  const blueprint = blueprints[0];
  const geode = blueprint[0];

  let duration = 0;
  let ore = geode.price[0].amount;
  if (prodOre.obsidian) {
    duration = Math.max(
      Math.ceil(ore / prodOre.ore),
      Math.ceil(geode.price[1].amount / prodOre.obsidian)
    );
    return duration;
  }

  duration += geode.price[1].amount;
  const obsidian = blueprint[1];
  ore = obsidian.price[0].amount;

  if (prodOre.clay) {
    duration = Math.max(
      Math.ceil(ore / prodOre.ore),
      Math.ceil(obsidian.price[1].amount / prodOre.clay)
    );
    return duration;
  }

  duration += obsidian.price[1].amount;
  const clay = blueprint[2];
  ore = clay.price[0].amount;

  duration = Math.max(
    Math.ceil(ore / prodOre.ore),
    Math.ceil(clay.price[1].amount / prodOre.clay)
  );
  return duration;
}

// function simulateTimeToAfford() {
//   const blueprint = blueprints[0];

//   const timeToProdGeode =

//   const geode = blueprint[0];
//   const maxGeodeProduction = Math.floor(
//     24 / Math.max(...geode.price.map(({ amount }) => amount))
//   );

//   const obsidian = blueprint[1];
//   const maxObsidianProduction = Math.floor(
//     24 / Math.max(...obsidian.price.map(({ amount }) => amount))
//   );

//   const clay = blueprint[2];
//   const maxClayProduction = Math.floor(
//     24 / Math.max(...clay.price.map(({ amount }) => amount))
//   );
// }

function task2() {}

console.log(task1());
console.log(task2());

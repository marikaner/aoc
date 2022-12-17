import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

interface Valve {
  name: string;
  flowRate: number;
  neighbors: Valve[];
}

const valves: Valve[] = input.split('\n').map((line) => {
  const groups = line.match(
    /Valve (?<name>[A-Z]{2}) has flow rate=(?<flowRate>\d+); tunnels? leads? to valves? (?<neighbors>.+)/
  )?.groups;

  return {
    name: groups.name,
    flowRate: parseInt(groups.flowRate),
    neighbors: groups.neighbors.split(', ') as any
  };
});

valves.forEach((valve, _, rawValves) => {
  valve.neighbors = valve.neighbors.map((neighbor) =>
    rawValves.find((rawValve) => rawValve.name === (neighbor as any))
  );
});

const distances = valves.reduce(
  (distances, { name }) => ({
    ...distances,
    [name]: {}
  }),
  {}
);

function setDistance(from: Valve, to: Valve, distance: number): number {
  const currDistance = distances[from.name][to.name] || Number.MAX_SAFE_INTEGER;
  const minDistance = Math.min(currDistance, distance);
  distances[from.name][to.name] = minDistance;
  distances[to.name][from.name] = minDistance;
  return minDistance;
}

function getDistance(from: Valve, to: Valve): number {
  return distances[from.name][to.name] || Number.MAX_SAFE_INTEGER;
}

function setShortestDistance(from: Valve, to: Valve, visited = []) {
  if (from.neighbors.map(({ name }) => name).includes(to.name)) {
    return setDistance(from, to, 1);
  }

  from.neighbors.forEach((neighbor) => {
    if (!visited.includes(neighbor.name)) {
      setDistance(
        from,
        to,
        1 + setShortestDistance(neighbor, to, [...visited, neighbor.name])
      );
    }
  });

  return getDistance(from, to);
}

valves.forEach((valve, i) => {
  setDistance(valve, valve, 0);
  valves.slice(i + 1).forEach((otherValve) => {
    setShortestDistance(valve, otherValve);
  });
});

function getFlow(time: number, from: Valve, to: Valve): number {
  return (time - distances[from.name][to.name] - 1) * to.flowRate;
}

function sortValves(from: Valve, time: number, closedValves: Valve[]) {
  const bestValves = closedValves
    .map((valve) => ({
      valve,
      flow: getFlow(time, from, valve),
      distance: getDistance(from, valve)
    }))
    .sort((a, b) => b.flow - a.flow);

  return bestValves;
}

function releasePressure(
  [time1, time2] = [26, 26],
  [valve1, valve2] = [
    valves.find(({ name }) => name === 'AA'),
    valves.find(({ name }) => name === 'AA')
  ],
  closedValves = valves.filter(({ flowRate }) => flowRate),
  totalFlow = 0
) {
  if (!closedValves.length || (!time1 && !time2)) {
    return totalFlow;
  }
  const isElephant = time2 > time1;
  const time = isElephant ? time2 : time1;
  const currValve = isElephant ? valve2 : valve1;

  const bestValves = sortValves(currValve, time, closedValves);
  const relevantValves = bestValves.filter(
    ({ flow }) => flow > 0 && flow >= bestValves[0].flow * 0.5
  );
  const totalFlows = [];
  for (const nextValve of relevantValves) {
    const { valve, distance, flow } = nextValve;
    totalFlows.push(
      releasePressure(
        isElephant
          ? [time1, time - (distance + 1)]
          : [time - (distance + 1), time2],
        isElephant ? [valve1, valve] : [valve, valve2],
        closedValves.filter(({ name }) => name !== valve.name),
        totalFlow + flow
      )
    );
  }
  return Math.max(...totalFlows, totalFlow);
}

function task1() {
  return releasePressure([30, 0]);
}

function task2() {
  return releasePressure();
}

console.log(task1());
console.log(task2());

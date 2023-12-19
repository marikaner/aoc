import { readInput } from '../read-input.js';
import { product, sum } from '../util.js';

const input = await readInput(import.meta.url);

const [workflowsStr, partsStr] = input.split('\n\n');
const parts = partsStr.split('\n').map((partStr) => {
  const [x, m, a, s] = partStr
    .match(/\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}/)
    .slice(1, 5)
    .map((num) => parseInt(num));
  return { x, m, a, s };
});

const ruleSets = parseRules();
const workflows = ruleSets.reduce(
  (prev, { rules, otherwise, name }) => ({
    ...prev,
    [name]: { rules, otherwise }
  }),
  {} as Record<string, Omit<RuleSet, 'name'>>
);

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

interface Rule {
  key: 'x' | 'm' | 'a' | 's';
  operator: '<' | '>';
  value: number;
  next: string;
}

interface RuleSet {
  rules: Rule[];
  otherwise: string;
  name: string;
}

interface ReverseWorkflow {
  x: Range;
  m: Range;
  a: Range;
  s: Range;
  name: string;
}

interface Range {
  min: number;
  max: number;
}

function parseRules() {
  return workflowsStr.split('\n').map((workflowStr) => {
    const [name, rulesStr] = workflowStr.slice(0, -1).split('{');
    const ruleParts = rulesStr.split(',');

    return {
      name,
      rules: ruleParts.slice(0, -1).map((ruleStr) => {
        const [key, operator, value, next] = ruleStr
          .match(/(\w+)([><])(\d+):(\w+)/)
          .slice(1, 5);

        return { key, operator, value: parseInt(value), next };
      }),
      otherwise: ruleParts.slice(-1)[0]
    };
  });
}

function getNextWorkflow(part: Part, name: string) {
  const { rules, otherwise } = workflows[name];
  return (
    rules.find(
      ({ key, operator, value }) =>
        (operator === '>' && part[key] > value) ||
        (operator === '<' && part[key] < value)
    )?.next || otherwise
  );
}

function process(part: Part, workflow = 'in') {
  while (true) {
    workflow = getNextWorkflow(part, workflow);
    if (workflow === 'A') {
      return true;
    }
    if (workflow === 'R') {
      return false;
    }
  }
}

const rulesByNextWorkflow = reverseWorkflows();

function reverseWorkflows() {
  const rulesByNextWorkflow: Record<
    string,
    (Range & { key: string; name: string })[][]
  > = Object.keys(workflows).reduce((prev, key) => ({ ...prev, [key]: [] }), {
    R: [],
    A: []
  });

  ruleSets.forEach(({ otherwise, name, rules }) => {
    const reverseRules = rules.map(({ key, operator, value }) =>
      operator === '<'
        ? { key, min: value, max: 4000, name }
        : { key, min: 1, max: value, name }
    );

    rulesByNextWorkflow[otherwise].push(reverseRules);
    rules.forEach(({ key, operator, value, next }, i) => {
      const rule =
        operator === '<'
          ? { key, min: 1, max: value - 1, name }
          : { key, min: value + 1, max: 4000, name };
      rulesByNextWorkflow[next].push([rule, ...reverseRules.slice(0, i)]);
    });
  });
  return rulesByNextWorkflow;
}

function applyReverseWorkflows(workflow: ReverseWorkflow): ReverseWorkflow[] {
  return rulesByNextWorkflow[workflow.name].flatMap((ruleSet) => {
    const currWorkflow = copyWorkflow(workflow);
    ruleSet.forEach(({ key, min, max, name }) => {
      currWorkflow[key].min = Math.max(currWorkflow[key].min, min);
      currWorkflow[key].max = Math.min(currWorkflow[key].max, max);
      currWorkflow.name = name;
    });

    return currWorkflow.name === 'in'
      ? currWorkflow
      : applyReverseWorkflows(currWorkflow);
  });
}

function copyWorkflow({ name, ...xmas }: ReverseWorkflow) {
  return Object.entries(xmas).reduce(
    (prev, [key, value]) => ({ ...prev, [key]: { ...value } }),
    { name } as ReverseWorkflow
  );
}

function part1() {
  return sum(
    parts.filter((part) => process(part)).map(({ x, m, a, s }) => x + m + a + s)
  );
}

function part2() {
  const res = applyReverseWorkflows({
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
    name: 'A'
  });

  return sum(
    res.map(({ name, ...ranges }) =>
      product(Object.values(ranges).map(({ min, max }) => max - min + 1))
    )
  );
}

console.log(part1());
console.log(part2());

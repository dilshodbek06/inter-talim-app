export type Question = {
  id: number;
  question: string;
  answer: string;
};

export type OperationKey = "add" | "sub" | "mul" | "div";
export type DifficultyKey = "easy" | "medium" | "hard";

const OPERATION_ORDER: OperationKey[] = ["add", "sub", "mul", "div"];

const DIFFICULTY_CONFIG: Record<
  DifficultyKey,
  {
    addSub: { min: number; max: number };
    mul: { min: number; max: number };
    div: { min: number; max: number };
  }
> = {
  easy: {
    addSub: { min: 0, max: 10 },
    mul: { min: 1, max: 10 },
    div: { min: 1, max: 10 },
  },
  medium: {
    addSub: { min: 0, max: 30 },
    mul: { min: 2, max: 12 },
    div: { min: 2, max: 12 },
  },
  hard: {
    addSub: { min: 0, max: 100 },
    mul: { min: 3, max: 20 },
    div: { min: 2, max: 20 },
  },
};

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
};

const createSeededRandom = (seed: number) => {
  let current = seed >>> 0;
  return () => {
    current = (current * 1664525 + 1013904223) >>> 0;
    return current / 2 ** 32;
  };
};

export const buildRopeQuestions = (
  operations: OperationKey[],
  difficulty: DifficultyKey,
) => {
  const normalizedOperations = OPERATION_ORDER.filter((operation) =>
    operations.includes(operation),
  );

  if (normalizedOperations.length === 0) return [];

  const config = DIFFICULTY_CONFIG[difficulty];
  const random = createSeededRandom(
    hashString(`${difficulty}-${normalizedOperations.join(",")}`),
  );
  const randInt = (min: number, max: number) =>
    Math.floor(random() * (max - min + 1)) + min;

  const questions: Question[] = [];
  const seen = new Set<string>();
  let id = 1;

  const pushQuestion = (question: string, answer: number) => {
    const key = `${question}|${answer}`;
    if (seen.has(key)) return false;
    seen.add(key);
    questions.push({ id: id++, question, answer: String(answer) });
    return true;
  };

  const targetPerOp = 40;

  const buildAdd = () => {
    let added = 0;
    let guard = 0;
    while (added < targetPerOp && guard < targetPerOp * 30) {
      const a = randInt(config.addSub.min, config.addSub.max);
      const b = randInt(config.addSub.min, config.addSub.max);
      if (pushQuestion(`${a} + ${b} = ?`, a + b)) added += 1;
      guard += 1;
    }
  };

  const buildSub = () => {
    let added = 0;
    let guard = 0;
    while (added < targetPerOp && guard < targetPerOp * 30) {
      let a = randInt(config.addSub.min, config.addSub.max);
      let b = randInt(config.addSub.min, config.addSub.max);
      if (b > a) [a, b] = [b, a];
      if (pushQuestion(`${a} - ${b} = ?`, a - b)) added += 1;
      guard += 1;
    }
  };

  const buildMul = () => {
    let added = 0;
    let guard = 0;
    while (added < targetPerOp && guard < targetPerOp * 30) {
      const a = randInt(config.mul.min, config.mul.max);
      const b = randInt(config.mul.min, config.mul.max);
      if (pushQuestion(`${a} x ${b} = ?`, a * b)) added += 1;
      guard += 1;
    }
  };

  const buildDiv = () => {
    let added = 0;
    let guard = 0;
    while (added < targetPerOp && guard < targetPerOp * 30) {
      const divisor = randInt(config.div.min, config.div.max);
      const quotient = randInt(config.div.min, config.div.max);
      const dividend = divisor * quotient;
      if (pushQuestion(`${dividend} / ${divisor} = ?`, quotient)) added += 1;
      guard += 1;
    }
  };

  normalizedOperations.forEach((operation) => {
    if (operation === "add") buildAdd();
    if (operation === "sub") buildSub();
    if (operation === "mul") buildMul();
    if (operation === "div") buildDiv();
  });

  return questions;
};

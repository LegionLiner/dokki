import { DateTime, type DurationLike } from "luxon";

interface Plus {
  plus: DurationLike;
  minus?: never;
}

interface Minus {
  plus?: never;
  minus: DurationLike;
}

const unitMap = {
  s: "seconds",
  S: "seconds",
  h: "hours",
  H: "hours",
  d: "days",
  D: "days",
  m: "months",
  M: "months",
  y: "years",
  Y: "years",
};

type Unit = keyof typeof unitMap;

export const parseMeasurement = (count: number, unit: Unit): DurationLike => {
  const key = unitMap[unit];

  return {
    [key]: count,
  };
};

export const parseDuration = (v: string): Plus | Minus => {
  if (v.startsWith("-")) {
    const minus: DurationLike = {};
    const matches = /^-(\d+)([SsMmDdHhYy])/.exec(v);

    if (!matches) {
      return {
        minus,
      };
    }

    const [, count, unit] = matches;

    return {
      minus: parseMeasurement(Number(count), unit as Unit),
    };
  }

  const plus: DurationLike = {};
  const matches = /^\+?(\d+)([SsMmDdHhYy])/.exec(v);

  if (!matches) {
    return {
      plus,
    };
  }

  const [, count, unit] = matches;

  return {
    plus: parseMeasurement(Number(count), unit as Unit),
  };
};

export const computeRange = (date: Date, range: string): Date => {
  const newDate = Array.from(range.matchAll(/([+-]*\d+[SsMmHhDdYy])/g)).reduce(
    (date, line) => {
      const [operation] = line;

      const duration = parseDuration(operation);
      const { plus, minus } = duration;

      if (minus) {
        return date.minus(minus);
      }

      return date.plus(plus!);
    },
    DateTime.fromJSDate(date),
  );

  return newDate.toJSDate();
};

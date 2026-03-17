export type Transform<T> = (data: T[]) => T[];

export type Where<T extends Record<PropertyKey, unknown>> = <K extends keyof T>(
  key: K,
  value: T[K]
) => Transform<T>;

export type Sort<T extends Record<PropertyKey, unknown>> = <K extends keyof T>(
  key: K
) => Transform<T>;

export type Group<T, K extends keyof T> = {
  key: T[K];
  items: T[];
};

export type GroupTransform<T, K extends keyof T> = (
  data: Group<T, K>[]
) => Group<T, K>[];

export type GroupBy<T extends Record<PropertyKey, unknown>> = <K extends keyof T>(
  key: K
) => (data: T[]) => Group<T, K>[];

export type Having<T extends Record<PropertyKey, unknown>> = <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;

export const where = <T extends Record<PropertyKey, unknown>>(): Where<T> => {
  return <K extends keyof T>(key: K, value: T[K]) =>
    (data: T[]) =>
      data.filter((item) => item[key] === value);
};

export const sort = <T extends Record<PropertyKey, unknown>>(): Sort<T> => {
  return <K extends keyof T>(key: K) =>
    (data: T[]) =>
      [...data].sort((a, b) => {
        const av = a[key];
        const bv = b[key];

        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
      });
};

export const groupBy = <T extends Record<PropertyKey, unknown>>(): GroupBy<T> => {
  return <K extends keyof T>(key: K) =>
    (data: T[]) => {
      const map = new Map<T[K], Group<T, K>>();

      for (const item of data) {
        const groupKey = item[key];
        const existing = map.get(groupKey);

        if (existing) {
          existing.items.push(item);
        } else {
          map.set(groupKey, {
            key: groupKey,
            items: [item],
          });
        }
      }

      return Array.from(map.values());
    };
};

export const having = <T extends Record<PropertyKey, unknown>>(): Having<T> => {
  return <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) =>
    (groups: Group<T, K>[]) =>
      groups.filter(predicate);
};

type AnyStep<Input, Output> = (data: Input[]) => Output[];

export function query<T>(...steps: Array<(data: any[]) => any[]>) {
  return (data: T[]) => steps.reduce((acc, step) => step(acc), data as any[]);
}
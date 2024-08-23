import { Falsy } from "./falsy";

/**
 * Key used in `Map` such as `store` or `subscribers`
 */
export type Key = string;
/**
 * More flexible key used in `view` and `intent` to be combined with object-like dependencies.
 * Similar to query keys used in `@tanstack/react-query`
 */
export type RawKey = string | number | Record<string, unknown>;

const hashKey = (target: RawKey | Falsy): Key => {
  if (target === false || target === null || target === undefined) return "";
  if (typeof target === "string") return target;
  if (typeof target === "number") return target.toString();
  return JSON.stringify(
    Object.keys(target)
      .sort()
      .reduce((result, key) => {
        if (typeof target[key] === "object" && target[key] !== null && !Array.isArray(target[key])) {
          result[key] = hashKey(target[key] as Record<string, unknown>);
          return result;
        }
        if (key[0] !== "_") result[key] = target[key];
        return result;
      }, {} as any),
  );
};

export const hashKeys = (targets: (RawKey | Falsy)[]) =>
  Object.keys(targets)
    .sort()
    .reduce((acc: string, index) => {
      const key = targets[index as keyof typeof targets];
      if (typeof key === "string") return acc + "_" + key;
      return acc + "_" + hashKey(key as Record<string, unknown>);
    }, "");

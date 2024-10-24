import { Falsy, isFalsy } from "../common/falsy";

export type Key = string;
export type RawKey = string | number | Record<string, string | number>;
export type AnyKey = RawKey | RawKey[] | Key;

const hashKey = (target: RawKey | Falsy) => {
  if (target === false || target === null || target === undefined) return "";
  if (typeof target === "string") return target;
  if (typeof target === "number") return target.toString();
  return JSON.stringify(
    Object.keys(target)
      .filter(key => key[0] !== "_" && !isFalsy(target[key]))
      .sort()
      .reduce<Record<string, string>>((result, key) => {
        result[key] = hashKey(target[key]);
        return result;
      }, {}),
  );
};

const hashKeys = (targets: (RawKey | Falsy)[]) =>
  targets.filter(target => !isFalsy(target)).reduce((acc: string, target) => acc + "_" + hashKey(target), "");

const parseKey = (key: AnyKey): Key => {
  if (Array.isArray(key)) return hashKeys(key);
  return hashKey(key);
};

export { parseKey };

/**
 * Convert undefined union fields to optional.
 */
export type UndefinedToOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<T[K], undefined>;
} & {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

export const dropUndefinedKeys = <T>(obj: T) => {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result as T;
};

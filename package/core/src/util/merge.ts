import merge from "deepmerge";
import merge2 from "lodash/merge";
import { DeepPartial } from "./deep";
import { isPlainObject } from "lodash";

export const deepMerge = <T>(original: T, partial: DeepPartial<T> | T) =>
  merge<T>(original, partial as any, { arrayMerge: (_, source) => source, isMergeableObject: isPlainObject });

export const deepMergeSoft = <T>(original: T, partial: DeepPartial<T> | T): T => merge2(original, partial as any);

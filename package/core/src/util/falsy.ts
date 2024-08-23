/**
 * Indicates value that can be filtered out with `isFalsy()`.
 *
 * __CAUTION:__ `Falsy` is different from value considered falsy in JavaScript.
 * So never use more general types such as lodash `Falsey` instead of this.
 */
export type Falsy = false | null | undefined;

/**
 *
 * @param value Any value that can be optional
 * @returns `true` if the value is `false`, `null`, or `undefined`.
 */
export const isFalsy = (value: unknown): value is Falsy => value === false || value === null || value === undefined;

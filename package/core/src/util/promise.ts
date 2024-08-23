/**
 * Check if the value is a promise.
 */
export const isPromise = (value: unknown): value is Promise<unknown> =>
  typeof (value as any)?.then === "function" &&
  typeof (value as any)?.catch === "function" &&
  typeof (value as any)?.finally === "function";
// TODO: Consider using PromiseLike instead of Promise

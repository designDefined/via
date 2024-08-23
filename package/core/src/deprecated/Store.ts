// import { Key } from "../types";
// import { From, Setter, Stored, SetterConfig, StoredParams } from "./Stored";

// export type SetParams<T> = [Key, Setter<T>, SetterConfig | undefined];
// export type SubscribeParams = [Key, Key, () => void];

// /*
//  * Utility API
//  */

// const isStale = <T>(stored: Stored<T>) =>
//   !stored.value ||
//   stored.updatedAt + (stored.config?.staleTime ?? Infinity) < Date.now();

// const validate = <T>(stored: Stored<T>, from?: From<T>) => {
//   if (isStale(stored)) stored.invalidate(from);
//   return stored;
// };

// const isCachable = <T>(stored: Stored<T>) =>
//   stored.config?.gcTime !== undefined && stored.config.gcTime > 0;

// /*
//  * Main API
//  */
// export const createStore = () => {
//   const _store = new Map<Key, Stored<any>>();

//   const get = <T>({ key, ...params }: { key: Key } & StoredParams<T>) => {
//     const stored = _store.get(key);
//     if (stored) return validate<T>(stored);
//     const created = new Stored<T>(params);
//     _store.set(key, created);
//     return created;
//   };

//   const set = <T>(...[key, setter, config]: SetParams<T>) => {
//     const stored = _store.get(key);
//     if (!stored) return;
//     stored.set(setter, config);
//   };

//   const subscribe = (...[key, subscriptionKey, next]: SubscribeParams) => {
//     const stored = _store.get(key);
//     if (!stored) throw new Error("No stored found"); // TODO: Error handling
//     stored.subscribers.set(subscriptionKey, next);
//     if (stored.gcTimer) clearTimeout(stored.gcTimer);
//     return () => {
//       stored.subscribers.delete(subscriptionKey);
//       if (stored.subscribers.size < 1) {
//         if (isCachable(stored))
//           stored.gcTimer = setTimeout(
//             () => _store.delete(key),
//             stored.config?.gcTime,
//           );
//         else _store.delete(key);
//       }
//     };
//   };

//   const invalidate = (key: Key) => {
//     const stored = _store.get(key);
//     if (!stored) return;
//     return stored.invalidate;
//   };

//   const refresh = () =>
//     _store.forEach((stored) => {
//       if (isStale(stored)) stored.invalidate();
//     });

//   const debug = () => _store;

//   return {
//     get,
//     set,
//     subscribe,
//     invalidate,
//     refresh,
//     debug,
//   };
// };

// export type Store = ReturnType<typeof createStore>;

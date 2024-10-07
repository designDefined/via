// type Key = string;

// type StoredConfig = {
//   staleTime?: number;
//   gcTime?: number;
// };

// type StoredTime = {
//   staleAt?: number;
//   gcAt?: number;
// };

// type Initiator<T> =
//   | { type: "ASYNC"; fn: () => Promise<T> }
//   | { type: "SYNC"; fn: () => T };
// type Setter<T> =
//   | { type: "WHOLE"; value: T }
//   | { type: "PARTIAL"; value: Partial<T> }
//   | { type: "DRAFT"; value: (draft: T) => void };

// type Stored<T> = {
//   value?: T;
//   model?: (input: T) => T;
//   promise?: Promise<T>; // TODO: manage promise as queue
//   error?: unknown;
//   init: Initiator<T>;
//   config: StoredConfig;
//   time: StoredTime;
//   subscribers: Map<string, () => void>;
// };

// export const createStore = () => {
//   const store = new Map<Key, Stored<any>>();

//   /*
//    * Get & Set
//    */
//   const set = <T>({
//     key,
//     setter,
//     // updateTime,
//   }: {
//     key: Key;
//     setter: Setter<T>;
//     updateTime?: boolean;
//   }) => {
//     const stored = store.get(key);
//     if (!stored) return;

//     const time = stored.time;

//     switch (setter.type) {
//       case "WHOLE":
//         store.set(key, {
//           ...stored,
//           value: setter.value,
//           promise: undefined,
//           time,
//         });
//         break;
//       case "PARTIAL":
//         store.set(key, {
//           ...stored,
//           value: { ...stored.value, ...setter.value, time }, // TODO: Change to deep merge
//         });
//         break;
//     }

//     stored.subscribers.forEach((cb) => cb());
//   };

//   const get = ({ key }: { key: Key }) => {
//     const stored = store.get(key);
//     if (!stored) return undefined;
//     const { model, value, promise, error, init, time } = stored;
//     const currentTime = Date.now();

//     // return value
//     if (!time.staleAt || time.staleAt >= currentTime || promise)
//       return { model, value, promise, error };

//     // auto invalidate if stale
//     const newPromise = init.fn().then((value) => {
//       set({ key, setter: { type: "WHOLE", value }, updateTime: true });
//     });
//     set({
//       key,
//       setter: {
//         type: "PARTIAL",
//         value: { promise: newPromise, value: undefined },
//       },
//     });
//   };

//   /*
//    * Registration
//    */
//   const register = <T>({
//     key,
//     initialSubscribers,
//     init,
//     config,
//   }: {
//     key: Key;
//     config: StoredConfig;
//     initialSubscribers: { key: string; callback: () => void }[];
//     init: Initiator<T>;
//   }) => {
//     const currentTime = Date.now();
//     const time = {
//       staleAt: config.staleTime ? currentTime + config.staleTime : undefined,
//       gcAt:
//         initialSubscribers.length > 0 ? 0 : currentTime + (config.gcTime ?? 0),
//     };
//     const subscribers = new Map<string, () => void>(
//       initialSubscribers.map(({ key, callback }) => [key, callback]),
//     );
//     if (init.type === "SYNC") {
//       store.set(key, { init, value: init.fn(), subscribers, time, config });
//     }
//     if (init.type === "ASYNC") {
//       const promise = init.fn().then((value) => {
//         set({ key, setter: { type: "WHOLE", value } });
//         subscribers.forEach((callback) => callback());
//       });
//       store.set(key, { init, promise, subscribers, time, config });
//     }
//   };

//   const unregister = ({ key }: { key: Key }) => store.delete(key);

//   return {
//     set,
//     get,
//     register,
//     unregister,
//   };
// };

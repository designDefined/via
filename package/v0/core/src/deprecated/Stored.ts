// import { produce } from "immer";

// export type Model<T> = (input: T) => T;
// export type From<T> =
//   | { type: "ASYNC"; fn: () => Promise<T> }
//   | { type: "SYNC"; fn: () => T };
// export type Setter<T> = T | Partial<T> | ((draft: T) => void);
// export type AsyncSetter<T> = () => Promise<Setter<T>>;
// export type SetterConfig = { override?: boolean };

// export type Subscriber<T> = (next: Stored<T>) => void;

// export type StoredConfig = {
//   staleTime?: number;
//   gcTime?: number;
// };
// export type StoredParams<T> = {
//   from?: From<T>;
//   model?: Model<T>;
//   config?: StoredConfig;
// };

// export class Stored<T> {
//   // specifications
//   from?: From<T>;
//   model?: Model<T>;
//   config?: StoredConfig;

//   // values
//   value?: T = undefined;
//   promise?: Promise<void> = undefined;
//   error?: unknown = undefined;

//   // internals
//   subscribers: Map<string, Subscriber<T>> = new Map();
//   updatedAt: number = 0;
//   gcTimer: number | null = null;

//   constructor({ from, model, config }: StoredParams<T>) {
//     this.from = from;
//     this.model = model;
//     this.config = config;
//     if (from) {
//       if (from.type === "ASYNC") this.setAsync(from.fn());
//       else this.value = model ? model(from.fn()) : from.fn();
//     }
//   }

//   next() {
//     this.subscribers.forEach((cb) => cb(this));
//   }

//   set(setter: Setter<T>, config?: SetterConfig) {
//     try {
//       if (!this.value) return;
//       let result: T;
//       if (typeof setter === "function") {
//         result = produce(this.value, setter as (draft: T) => void);
//       } else if (config?.override) {
//         result = setter as T;
//       } else {
//         result = { ...this.value, ...(setter as Partial<T>) };
//       }
//       const nextValue = this.model ? this.model(result) : result;
//       this.value = nextValue;
//       this.next();
//       console.log(this.value);
//       return nextValue;
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   setAsync(promise: Promise<Setter<T>>, config?: SetterConfig) {
//     this.promise = promise.then((setter) => {
//       this.set(setter, config);
//     });
//     this.next();
//   }

//   invalidate(override?: From<T>) {
//     const from = override || this.from;
//     if (!from) throw new Error("No from found");
//     if (from.type === "ASYNC") this.setAsync(from.fn(), { override: true });
//     else this.set(from.fn(), { override: true });
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from "immer";
import { Key } from "../util/hashKey";
import { isPromise } from "../util/promise";
import { DeepPartial } from "../util/deep";
import { deepMerge } from "../util/merge";

/*
 * Stored Info
 */

/**
 * Provides intial value of stored item.
 */
export type From<T> = () => T | Promise<T>;

/**
 * Information of stored item. The reference of `StoredInfo` remains same throughout the lifetime of each items.
 */
export type StoredInfo<T> = {
  key: Key;
  from?: From<T>;
  staleTime?: number;
  cacheTime?: number;
};

/*
 * Setter
 */
export type SetterWhole<T> = T;
export type SetterPartial<T> = DeepPartial<T>;
export type SetterFn<T> = (draft: T) => void;
export type Setter<T> = SetterWhole<T> | SetterPartial<T> | SetterFn<T>;
export type SetterConfig = {
  override?: boolean;
  clearPromise?: boolean;
  error?: unknown;
};

/*
 * Stored Values
 */

/**
 * The current value fo stored item.
 * If `value` exists, the item is currently available. If not, status of the item depends on whether `promise` or `error` exists.
 * The reference changes on every `set`.
 */
export type StoredValues<T> = {
  value?: T;
  promise?: Promise<unknown>; // TODO: Refine promise type
  error?: unknown;
};

/*
 * Subscriber
 */
export type Subscriber<T> = { next: (stored: [StoredValues<T>, StoredInfo<T>]) => void };

/*
 * Stored
 */
export type Stored<T> = {
  values: StoredValues<T>;
  info: StoredInfo<T>;
  subscribers: Map<Key, Subscriber<T>>;
  updatedAt: number; // -1 for never updated or invalidated item
  gcTimer: ReturnType<typeof setTimeout> | null;
};

/*
 * API
 */

// Manipulator
type _ManipulatorParams<T> = {
  stored: Stored<T>;
};

// CRUD
type _CreateParams<T> = StoredInfo<T> & StoredValues<T>;
type _ReadParams = { key: Key };
type _UpdateParams<T> = {
  key: Key;
  setter: Setter<T> | undefined;
  config?: SetterConfig;
};
type _UpdateAsyncParams<T> = {
  key: Key;
  promise: Promise<Setter<T>>;
  config?: SetterConfig;
};
type _DeleteParams = {
  key: Key;
};

export type GetParams<T> = _CreateParams<T>;
export type SetParams<T> = {
  key: Key;
  setter: Setter<T> | Promise<Setter<T>>;
  config?: SetterConfig;
};
export type SubscribeParams<T> = {
  key: Key;
  subscriptionKey: Key;
  subscriber: Subscriber<T>;
} & Omit<GetParams<T>, "key">;

export const createStore = () => {
  const store = new Map<Key, Stored<any>>();

  // private method starts with underscore

  // Manipulator
  const _resolve = <T>({ stored }: _ManipulatorParams<T>) => {
    stored.subscribers.forEach(({ next }) => {
      next([stored.values, stored.info]);
    });
  };

  const _cache = <T>({ stored }: _ManipulatorParams<T>) => {
    const time = stored.info.cacheTime ?? 0;
    const timeout = setTimeout(() => {
      store.delete(stored.info.key);
    }, time);
    stored.gcTimer = timeout;
  };

  const _reset = <T>({ stored }: _ManipulatorParams<T>) => {
    if (!stored.info.from) throw new Error("No from found");
    const setter = stored.info.from();
    if (isPromise(setter)) _updateAsync({ key: stored.info.key, promise: setter, config: { override: true } });
    else _update({ key: stored.info.key, setter, config: { override: true } });
  };

  const _check = <T>({ stored }: _ManipulatorParams<T>) => {
    if (
      // refresh if values are totally empty
      (stored.values.value === undefined && stored.values.promise === undefined && stored.values.error === undefined) ||
      // or stored is stale
      stored.updatedAt < 0 ||
      stored.updatedAt + (stored.info.staleTime ?? Infinity) < Date.now()
    )
      _reset<T>({ stored });
  };

  // CRUD
  const _create = <T>({ key, value, promise, error, ...info }: _CreateParams<T>) => {
    const created: Stored<T> = {
      values: { value, promise, error },
      info: { key, ...info },
      subscribers: new Map(),
      updatedAt: value === undefined ? -1 : Date.now(),
      gcTimer: null,
    };
    store.set(key, created);
    return created;
  };

  const _read = <T>({ key }: _ReadParams): Stored<T> | undefined => {
    return store.get(key);
  };

  const _update = <T>({ key, setter, config }: _UpdateParams<T>) => {
    // read stored
    const stored = _read<T>({ key });

    // add stored if it doesn't exist and request is overridable
    if (!stored) {
      if (!config?.override) return;
      _create({ key, value: setter, ...config });
      return;
    }

    // update stored
    let newValues: StoredValues<T>;

    // replace existing value with setter if override
    if (config?.override) newValues = { ...stored.values, value: setter as T };
    // prevent partial merge if value is empty
    else if (stored.values.value === undefined) newValues = stored.values; // TODO: Is this okay?
    // merge with immer
    else if (typeof setter === "function")
      newValues = { ...stored.values, value: produce(stored.values.value, setter as (draft: T) => void) };
    // merge with deepMerge
    else newValues = { ...stored.values, value: deepMerge(stored.values.value, setter) };

    if (config?.clearPromise) newValues.promise = undefined;
    if (config?.error) newValues.error = config.error;
    stored.values = newValues;
    stored.updatedAt = Date.now();
    _resolve({ stored });
  };

  const _updateAsync = <T>({ key, promise, config }: _UpdateAsyncParams<T>) => {
    const stored = _read<T>({ key });
    if (!stored) return;
    if (stored.values.promise) return;

    promise
      .then((setter) => {
        _update({ key, setter, config: { ...config, clearPromise: true } });
      })
      .catch((e) => {
        _update({ key, setter: undefined, config: { ...config, clearPromise: true, error: e } });
      });

    const newValues = { ...stored.values, promise };
    stored.values = newValues;
    stored.updatedAt = Date.now();
    _resolve({ stored });
  };

  const _delete = <T>({ key }: _DeleteParams) => {
    const stored = _read<T>({ key });
    if (!stored || stored.info.cacheTime === undefined) store.delete(key);
    else _cache({ stored });
  };

  // public
  const get = <T>({ key, ...rest }: GetParams<T>) => {
    const read = _read<T>({ key });
    const stored = read ?? _create({ key, ...rest });
    _check({ stored });
    return stored;
  };

  const set = <T>({ key, setter, config }: SetParams<T>) => {
    const stored = _read<T>({ key });
    if (!stored) return;

    if (isPromise(setter)) _updateAsync({ key, promise: setter, config });
    else _update({ key, setter, config });
  };

  const subscribe = <T>({ key, subscriptionKey, subscriber }: SubscribeParams<T>) => {
    const stored = _read<T>({ key });
    if (!stored) throw new Error(`No stored found: ${key}`); // TODO: Error handling

    // clear gc timer
    if (stored.gcTimer !== null) {
      clearTimeout(stored.gcTimer);
      stored.gcTimer = null;
    }

    // add subscription
    stored.subscribers.set(subscriptionKey, subscriber);
    subscriber.next([stored.values, stored.info]);
    return () => {
      stored.subscribers.delete(subscriptionKey);
      if (stored.subscribers.size < 1) _delete({ key });
    };
  };

  const clear = (key: Key) => {
    const stored = _read({ key });
    if (!stored) return;
    const newValues = { value: undefined, promise: undefined, error: undefined };
    stored.values = newValues;
    stored.updatedAt = -1;
    _resolve({ stored });
  };

  const invalidate = (key: Key) => {
    const stored = _read({ key });
    if (!stored) return;
    stored.updatedAt = -1;
    _check({ stored });
  };

  const invalidateFilter = (key: Key) => {
    store.forEach((stored, storedKey) => {
      if (!storedKey.startsWith(key)) return;
      stored.updatedAt = -1;
      _check({ stored });
    });
  };

  const setFilter = <T>({ key, setter, config }: SetParams<T>) => {
    store.forEach((_, storedKey) => {
      if (!storedKey.startsWith(key)) return;
      set({ key: storedKey, setter, config });
    });
  };

  const checkAll = () => store.forEach((stored) => _check({ stored }));

  const invalidateAll = () =>
    store.forEach((stored) => {
      stored.updatedAt = -1;
      _check({ stored });
    });

  return {
    read: _read,
    get,
    set,
    subscribe,
    clear,
    invalidate,
    invalidateFilter,
    setFilter,
    checkAll,
    invalidateAll,
  };
};

export type Store = ReturnType<typeof createStore>;
export type Next = (store: Store) => void;

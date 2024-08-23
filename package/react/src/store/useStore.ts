import { Setter, SetterConfig, Store, StoredInfo, StoredValues } from "viajs-core";
import { nanoid } from "nanoid";
import { useCallback, useContext, useEffect, useReducer, useRef } from "react";
import { ViaContext } from "./storeContext";

export type UseStoreParams<T> = StoredInfo<T> & { value?: T };

type Get<T, Slice> = [StoredValues<Slice>, StoredInfo<T>];
type Set<T> = (setter: Setter<T> | Promise<Setter<T>>, config?: SetterConfig) => void;

export const useStore = <T>({ key, ...params }: UseStoreParams<T>): [Get<T, T>, Set<T>, Store] => {
  const store = useContext(ViaContext);
  if (!store) throw new Error("useStore must be used within proper context");

  // subscriptionKey and configs remains same throughout the lifecycle of the component
  const subscriptionKey = useRef(nanoid());

  const [[values, info], dispatch] = useReducer<(prev: Get<T, T>, next: Get<T, T>) => Get<T, T>, null>(
    (prev, next) => {
      return Object.is(prev[0], next[0]) && Object.is(prev[1], next[1]) // TODO: Add slice for rerender optimization
        ? prev
        : next;
    },
    null,
    () => {
      const { values, info } = store.get<T>({ ...params, key });
      return [values, info];
    },
  );

  // if key changes, re-initiate the store
  if (key !== info.key) {
    const { values, info } = store.get<T>({ ...params, key });

    dispatch([values, info]);
  }

  const set: Set<T> = useCallback((setter, config) => store.set<T>({ key, setter, config }), [store, key]);

  useEffect(() => {
    store.get<T>({ ...params, key });
    return store.subscribe<T>({
      ...params,
      key: info.key,
      subscriptionKey: subscriptionKey.current,
      subscriber: { next: dispatch },
    });
  }, [info.key]); // subscription depends nothing but the key

  return [[values, info], set, store] as const;
};

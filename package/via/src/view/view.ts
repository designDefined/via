import { InferredSnapshot } from "../state";
import { AnyKey, getStore, Getter, parseKey, Store } from "../store";

export const View =
  <Deps extends unknown[], T>(builder: (...deps: Deps) => { key: AnyKey; from: () => T }) =>
  (...deps: Deps) => {
    const { key: _key, from } = builder(...deps);
    const getter: Getter<T> = { key: parseKey(_key), from };

    const getValue = (store?: Store) =>
      getStore(store).read(getter.key)?.subject.getValue()?.value as Awaited<T> | undefined;
    const getSnapshot = (store?: Store) => getStore(store).getState(getter).subject.getValue() as InferredSnapshot<T>;

    const subscribe = (
      subscriber: { next?: (s: InferredSnapshot<T>) => void } | ((s: InferredSnapshot<T>) => void),
      storeOverride?: Store,
    ) => {
      const store = getStore(storeOverride);
      const next = typeof subscriber === "function" ? subscriber : subscriber.next;
      const { subject } = store.getState(getter);
      const subscription = subject.subscribe({ next } as any);
      // state.actor.send({ type: "subscribe" });
      return () => {
        subscription.unsubscribe();
        // state.actor.send({ type: "unsubscribe" });
        if (!subject.observed) {
          // state.actor.send({ type: "unsubscribeAll" });
          store.remove(getter.key);
        }
      };
    };

    return { key: getter.key, getValue, getSnapshot, subscribe };
  };

export type View<T> = ReturnType<ReturnType<typeof View<[], T>>>;

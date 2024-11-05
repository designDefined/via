import { InferredState } from "../state";
import { AnyKey, getStore, parseKey } from "../store";

export const View =
  <Deps extends unknown[], T>(builder: (...deps: Deps) => { key: AnyKey; from?: () => T }) =>
  (...deps: Deps) => {
    const subscribe = (subscriber: Parameters<InferredState<T>["subject"]["subscribe"]>[0], fromOverride?: () => T) => {
      const { key: _key, from: _from } = builder(...deps);
      const key = parseKey(_key);
      const from = fromOverride ?? _from;
      if (!from) throw new Error(`View ${key} must have a from function.`);

      const store = getStore();
      const state = store.getState(key, from);
      const subscription = state.subject.subscribe(...(subscriber as any));
      // state.actor.send({ type: "subscribe" });
      return () => {
        subscription.unsubscribe();
        // state.actor.send({ type: "unsubscribe" });
        if (!state.subject.observed) {
          // state.actor.send({ type: "unsubscribeAll" });
          store.remove(key);
        }
      };
    };

    return { subscribe };
  };

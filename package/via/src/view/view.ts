import { AsyncronousFrom, From, makeFromAsync } from "../state/from";
import { AnyKey, getStore, parseKey } from "../store";
import { AsyncronousSubscribable } from "../subscription/subscribable";
import { AsyncronousSubscriber } from "../subscription/subscriber";

type ViewBuilder<Deps extends unknown[], Value> = (...deps: Deps) => {
  key: AnyKey;
  from?: From<Value>;
};
export type View<Deps extends unknown[], Value> = AsyncronousSubscribable<Value> & {
  from: (from: From<Value>) => AsyncronousSubscribable<Value>;
};

export const View =
  <Deps extends unknown[], Value>(builder: ViewBuilder<Deps, Value>) =>
  (...deps: Deps): View<Deps, Value> => {
    let fromOverride: From<Value> | undefined;

    const subscribe = (subscriber: AsyncronousSubscriber<Value>) => {
      const { key: _key, from: _from } = builder(...deps);
      const key = parseKey(_key);
      const from = fromOverride ?? _from;
      if (!from) throw new Error(`View ${key} must have a from function.`);

      const store = getStore();
      const state = store.getAsyncState<Value>(key, makeFromAsync(from));

      const subscription = state.subject.subscribe(subscriber);
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

    const subscribable: AsyncronousSubscribable<Value> = { subscribe };

    const from = (_from: From<Value>) => {
      fromOverride = _from;
      return subscribable;
    };

    return { ...subscribable, from };
  };

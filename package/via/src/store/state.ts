import { SnapshotFrom } from "xstate";
import { createStateActor, StateActor } from "./actor";
import { AnyKey, Key } from "./key";
import { Init, Updater } from "./initAndUpdate";
import { getStore, Store } from "./store";
import { createStateSubject, StateSubject } from "./subject";

export type State<Value> = { subject: StateSubject<Value>; actor: StateActor<Value> };
export type StateSnapshot<Value> = SnapshotFrom<StateActor<Value>>;

type CreateStateProps<Value> = {
  key: AnyKey;
  init?: Init<Value>;
  updater?: Updater<Value>;
};
export const createState = <T>(params: CreateStateProps<T>): State<T> => {
  const key = Key.parse(params.key);
  const actor = createStateActor<T>({ key: key, init: params.init, updater: params.updater });
  const subject = createStateSubject<T>({ initialValue: actor.getSnapshot() });
  actor.subscribe(snapshot => {
    subject.next(snapshot);
  });
  return { subject, actor };
};

type FetchStateParams<Value> = {
  key: AnyKey;
  store?: Store;
  init?: Init<Value>;
  updater?: Updater<Value>;
};
export const fetchState = <T>(params: FetchStateParams<T>) => {
  const key = Key.parse(params.key);
  const store = getStore({ store: params.store });
  const { subject, actor } =
    store.get<State<T>>({ key }) ??
    store.set<State<T>>({
      key,
      value: createState<T>({ key, init: params.init, updater: params.updater }),
    });
  return [subject, actor.send] as const;
};

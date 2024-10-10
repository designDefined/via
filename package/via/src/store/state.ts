import { SnapshotFrom } from "xstate";
import { createStateActor, StateActor } from "./actor";
import { AnyKey, Key } from "./key";
import { Initializer, Updater } from "./setter";
import { getStore, Store } from "./store";
import { createStateSubject, StateSubject } from "./subject";

export type State<Value> = {
  actor: StateActor<Value>;
  subject: StateSubject<Value>;
};
export type StateSnapshot<Value> = SnapshotFrom<StateActor<Value>>;

type CreateStateProps<Value> = {
  key: Key;
  initalizer?: Initializer<Value>;
  updater?: Updater<Value>;
};

export const createState = <T>({ key, initalizer, updater }: CreateStateProps<T>): State<T> => {
  const actor = createStateActor<T>({ key, initalizer, updater });
  const subject = createStateSubject<T>({ initialValue: actor.getSnapshot() });
  actor.subscribe(snapshot => {
    subject.next(snapshot);
  });
  actor.start();
  return { actor, subject };
};

type SubscribeStateParams = {
  key: AnyKey;
  store?: Store;
};
export const subscribeState = <T>(params: SubscribeStateParams) => {
  const key = Key.parse(params.key);
  const store = getStore({ store: params.store });
  const { subject, actor } =
    store.get<State<T>>({ key }) ?? store.set<State<T>>({ key, value: createState<T>({ key }) });
  const subscribe = (subscriber: (value: StateSnapshot<T>) => void) => subject.subscribe(subscriber).unsubscribe;
  const getSnapshot = () => subject.value;
  const dispatch = actor.send;

  return {
    subject,
    actor,
    subscribe,
    getSnapshot,
    dispatch,
  };
};

import { createStateActor, StateActor } from "./actor";
import { AnyKey, Key } from "./key";
import { Initializer, Updater } from "./setter";
import { getStore, Store } from "./store";
import { createStateSubject, StateSubject } from "./subject";

export type State<Value> = {
  actor: StateActor<Value>;
  subject: StateSubject<Value>;
};

type CreateStateProps<Value> = {
  key: Key;
  initalizer?: Initializer<Value>;
  updater?: Updater<Value>;
};

export const createState = <T>({ key, initalizer, updater }: CreateStateProps<T>): State<T> => {
  const actor = createStateActor<T>({ key, initalizer, updater });
  const subject = createStateSubject<T>();
  actor.subscribe(snapshot => subject.next(snapshot));
  actor.start();

  return { actor, subject };
};

type GetStateParams = {
  key: AnyKey;
  store?: Store;
};

export const getState = <T>(params: GetStateParams): State<T> => {
  const key = Key.parse(params.key);
  const store = getStore({ store: params.store });

  const prev = store.get<State<T>>({ key });
  if (prev) return prev;

  return store.set<State<T>>({ key, value: createState<T>({ key }) });
};

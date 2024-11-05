import { createState, InferredState, State } from "../state";

type _Store = Map<string, State<any>>;
export type Store = {
  debug: () => _Store;
  read: <T>(key: string) => State<T> | undefined;
  set: <T>(key: string, value: State<T>) => void;
  remove: (key: string) => void;
  getState: <T>(key: string, from: () => T) => InferredState<T>;
};

let globalStore: Store | undefined; // Used in CSR Environment

export const createStore = (isGlobal?: boolean): Store => {
  const _store: _Store = new Map<string, State<any>>();
  const debug = () => _store;

  const read = <T>(key: string) => _store.get(key) as State<T> | undefined;
  const set = <T>(key: string, value: State<T>) => _store.set(key, value);
  const remove = (key: string) => _store.delete(key);

  const getState = <T>(key: string, from: () => T): InferredState<T> => {
    const stored = read<T>(key);
    if (stored) return stored as InferredState<T>;
    const initialValue = from();
    const newState = createState({ id: key, from, initialValue }) as InferredState<T>;
    set<T>(key, newState as State<T>);
    return newState;
  };

  const store: Store = { debug, read, set, remove, getState };

  if (isGlobal) globalStore = store;

  return store;
};

export const getStore = (store?: Store) => store ?? globalStore ?? createStore(true);

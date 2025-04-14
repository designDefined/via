import { createState, InferredState, State } from "../state";

// core types
export type Getter<T> = { key: string; from: () => T };
export type Setter<T> = { key: string; a?: T };
export type Subscriber<T> = { key: string; next: ((s: T) => void | T) | Partial<T> };

// store
type _Store = Map<string, State<any>>;
export type Store = {
  debug: () => _Store;
  read: <T>(key: string) => State<T> | undefined;
  write: <T>(key: string, value: State<T>) => void;
  remove: (key: string) => void;
  getState: <T>(getter: Getter<T>) => InferredState<T>;
  setState: <T>(setter: Setter<T>) => void;
};

let globalStore: Store | undefined = undefined; // Used in CSR Environment

export const createStore = (isGlobal?: boolean): Store => {
  const _store: _Store = new Map<string, State<any>>();
  const debug = () => _store;

  const read = <T>(key: string) => _store.get(key) as State<T> | undefined;
  const write = <T>(key: string, value: State<T>) => _store.set(key, value);
  const remove = (key: string) => _store.delete(key);

  const getState = <T>({ key, from }: Getter<T>): InferredState<T> => {
    const stored = read(key);
    if (stored) return stored as InferredState<T>;
    const initialValue = from();
    const newState = createState({ id: key, from, initialValue }) as InferredState<T>;
    write(key, newState as State<T>);
    return newState;
  };

  const setState = <T>({ key }: Setter<T>) => {
    const stored = read(key);
    if (!stored) return;
  };

  const store: Store = { debug, read, write, remove, getState, setState };

  if (isGlobal) globalStore = store;

  return store;
};

export const getStore = (store?: Store) => store ?? globalStore ?? createStore(true);

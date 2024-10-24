import { AsyncronousState, createState, SyncronousState } from "../state";
import { AsyncronousFrom, SyncronousFrom } from "../state/from";

type _Store = Map<string, Stored<any>>;
type Stored<T> = { type: "async"; state: AsyncronousState<T> } | { type: "sync"; state: SyncronousState<T> };
export type Store = {
  debug: () => _Store;
  read: <T>(key: string) => Stored<T> | undefined;
  set: <T>(key: string, value: Stored<T>) => void;
  remove: (key: string) => void;
  getSyncState: <T>(key: string, from: SyncronousFrom<T>) => SyncronousState<T>;
  getAsyncState: <T>(key: string, from: AsyncronousFrom<T>) => AsyncronousState<T>;
};

let globalStore: Store | undefined; // Used in CSR Environment

export const createStore = (isGlobal?: boolean): Store => {
  const _store: _Store = new Map<string, Stored<any>>();
  const debug = () => _store;

  const read = <T>(key: string) => _store.get(key) as Stored<T> | undefined;
  const set = <T>(key: string, value: Stored<T>) => _store.set(key, value);
  const remove = (key: string) => _store.delete(key);

  const getSyncState = <T>(key: string, from: SyncronousFrom<T>) => {
    const stored = read<T>(key);
    if (stored) {
      if (stored.type === "sync") return stored.state;
      throw new Error(`Expected sync state, but got async state.`); // TODO: Error handling
    }
    const newState = createState({ id: key, from }) as SyncronousState<T>;
    set<T>(key, { type: "sync", state: newState });
    return newState;
  };

  const getAsyncState = <T>(key: string, from: AsyncronousFrom<T>) => {
    const stored = read<T>(key);
    if (stored) {
      if (stored.type === "async") return stored.state;
      throw new Error(`Expected async state, but got sync state.`); // TODO: Error handling
    }
    const newState = createState({ id: key, from }) as AsyncronousState<T>;
    set<T>(key, { type: "async", state: newState });
    return newState;
  };

  const store: Store = { debug, read, set, remove, getSyncState, getAsyncState };

  if (isGlobal) globalStore = store;

  return store;
};

export const getStore = (store?: Store) => store ?? globalStore ?? createStore(true);

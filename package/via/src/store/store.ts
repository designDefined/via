export type Store = {
  get: <T>(param: { key: string }) => T;
  set: <T>(param: { key: string; value: T }) => T;
  delete: (param: { key: string }) => void;
};

export const createStore = (): Store => {
  const map = new Map<string, any>();
  return {
    get: ({ key }) => map.get(key),
    set: ({ key, value }) => {
      map.set(key, value);
      return value;
    },
    delete: ({ key }) => map.delete(key),
  };
};

type GetStoreParams = { store?: Store };
export const getStore = ({ store }: GetStoreParams) => store ?? createStore();

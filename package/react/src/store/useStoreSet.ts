import { Key, SetterWhole } from "viajs-core";
import { useStoreContext } from "./useStoreContext";
import { useCallback } from "react";

type StoreSetParams<T> = {
  key: Key;
  setter: SetterWhole<T>;
};

export const useStoreSet = () => {
  const store = useStoreContext();
  const set = useCallback(
    <T>({ key, setter }: StoreSetParams<T>) => {
      const value = store.read<T>({ key });
      if (value) store.set<T>({ key, setter, config: { override: true } });
      else store.get<T>({ key, value: setter, from: () => setter });
    },
    [store],
  );
  return { set };
};

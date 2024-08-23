import { useCallback } from "react";
import { useStore } from "../store";
import { View, ViewParams, dropUndefinedKeys } from "viajs-core";

type UseViewParams<T> = { view: View<T> } & Omit<ViewParams<T>, "key">;

export const useViewOptional = <T>({ view: { key, ...viewStatus }, ...overrideStatus }: UseViewParams<T>) => {
  const [[view, status], set] = useStore<T>({ ...viewStatus, ...dropUndefinedKeys(overrideStatus), key });

  const update = useCallback(() => {
    const updater = overrideStatus.updater ?? viewStatus.updater;
    if (!updater) throw new Error("no updater provided"); // TODO: Handle error
    if (!view.value) throw new Error("no value found"); // TODO: Handle error
    set(updater(view.value));
  }, [set, overrideStatus.updater, viewStatus.updater, view.value]);

  return {
    value: view.value,
    error: view.error,
    promise: view.promise,
    status,
    update,
  };
};

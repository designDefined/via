import { InferredSnapshot, View } from "@viable/via";
import { useEffect, useReducer, useRef } from "react";
import { useStore } from "../store";

export const useView = <T>({ view }: { view: View<T> }) => {
  const store = useStore();
  const currentKey = useRef(view.key);
  const [{ state, value, promise, error }, dispatch] = useReducer<
    (prev: InferredSnapshot<T>, next: InferredSnapshot<T>) => InferredSnapshot<T>,
    null
  >(
    (_, next) => next,
    null,
    () => view.getSnapshot(store),
  );

  if (currentKey.current !== view.key) dispatch(view.getSnapshot(store));

  useEffect(() => {
    const unsub = view.subscribe(dispatch, store);
    return unsub;
  }, [view.key]);

  if (state === "pending") throw promise;
  if (state === "rejected") throw error;

  return { value, state };
};

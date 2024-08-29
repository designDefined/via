import { useCallback, useMemo } from "react";
import { Intent, IntentParams, ParserTree, StoredIntent, Inferred, isPromise, To, StoredInfo } from "viajs-core";
import { useStore } from "../store";

type UseIntentParams<P extends ParserTree<unknown>, O> = {
  intent: Intent<P, O>;
} & Omit<IntentParams<P, O>, "key" | "input">;

export type UseIntent<P extends ParserTree<unknown>, O> = {
  send: (...args: Parameters<To<Inferred<P>, O>>) => Promise<O>;
  info: StoredInfo<StoredIntent<Inferred<P>, O>>;
  isWorking: boolean;
};

export const useIntent = <P extends ParserTree<unknown>, O>({
  intent: { key, to, next, catch: _catch, model, ...intentInfo },
  to: overrideTo,
  next: overrideNext,
  catch: overrideCatch,
  model: overrideModel,
  ...overrideInfo
}: UseIntentParams<P, O>): UseIntent<P, O> => {
  const storeInfoMemo = useMemo(() => ({ ...intentInfo, ...overrideInfo }), [key]);
  const toMemo = useMemo(() => overrideTo ?? to, [key]);
  const nextMemo = useMemo(() => overrideNext ?? next, [key]);
  const catchMemo = useMemo(() => overrideCatch ?? _catch, [key]);
  const modelMemo = useMemo(() => ({ ...model, ...overrideModel }), [key]);
  const [[intent, info], set, store] = useStore<StoredIntent<Inferred<P>, O>>({
    ...storeInfoMemo,
    key,
    value: { isWorking: false },
  });

  const resolve = useCallback(
    (result: { i: Inferred<P>; o: O }) => {
      if (!nextMemo) return Promise.resolve();
      return Promise.all(nextMemo(result).map(next => (next ? next(store) : Promise.resolve())));
    },
    [store, nextMemo],
  );

  const reject = useCallback(
    (result: { i: Inferred<P>; error: unknown }) => {
      if (!catchMemo) return Promise.resolve();
      return Promise.all(catchMemo(result).map(_catch => (_catch ? _catch(store) : Promise.resolve())));
    },
    [store, catchMemo],
  );

  const send = useCallback(
    (...args: Parameters<To<Inferred<P>, O>>) => {
      try {
        if (!toMemo) throw new Error("no to provided");
        if (intent.value?.isWorking) return Promise.reject(new Error("already working")); // TODO: Add config to allow simultaneous requests
        const input = args && modelMemo.i ? ([modelMemo.i(args[0])] as Parameters<To<Inferred<P>, O>>) : args;
        const toResult = toMemo(...input);

        if (isPromise(toResult)) {
          // set info working
          set({ isWorking: true });
          return toResult
            .then(async output => {
              // resolve asyncronous request
              const validOutput = modelMemo.o ? modelMemo.o(output) : output;
              await resolve({ i: input?.[0] as Inferred<P>, o: validOutput });
              set({ isWorking: false, lastInput: input?.[0] as Inferred<P>, lastOutput: validOutput });
              return validOutput;
            })
            .catch(async e => {
              // reject asyncronous request
              await reject({ i: input?.[0] as Inferred<P>, error: e });
              set({ isWorking: false }, { error: e });
              console.error("Asyncronous send rejected"); // TODO: Change temporal debug message
              return Promise.reject(e);
            });
        } else {
          // resolve syncronous request
          set({ isWorking: false, lastInput: input?.[0] as Inferred<P>, lastOutput: toResult });
          resolve({ i: input?.[0] as Inferred<P>, o: toResult });
          return Promise.resolve(toResult);
        }
      } catch (e) {
        // reject wrong input
        console.error(e);
        set({ lastInput: args?.[0] as Inferred<P>, lastOutput: undefined, isWorking: false }, { error: e });
        reject({ i: args?.[0] as Inferred<P>, error: e });
        return Promise.reject(e);
      }
    },
    [key, intent.value?.isWorking, set, resolve, reject],
  );

  return { send, info, isWorking: intent.value?.isWorking ?? false };
};

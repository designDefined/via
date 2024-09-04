import { Inferred, InputSetter, Intent, IntentParams, ParserTree, ToArgs } from "viajs-core";
import { UseIntent, useIntent } from "./useIntent";
import { useIntentInput } from "./useIntentInput";
import { useCallback, useEffect, useRef } from "react";
import { UseInput } from "../input";

type UseIntentSubmitParams<P extends ParserTree<unknown>, O> = {
  intent: Intent<P, O>;
  initialSetter?: InputSetter<P>;
  cacheTime?: number;
  resetImmediately?: boolean;
} & Omit<IntentParams<P, O>, "key" | "input">;

export type UseIntentSubmit<P extends ParserTree<unknown>, O> = UseInput<P> &
  UseIntent<P, O> & { submit: () => Promise<O> };

export const useIntentSubmit = <P extends ParserTree<unknown>, O>({
  intent: { key, ...intent },
  initialSetter,
  resetImmediately,
  ...params
}: UseIntentSubmitParams<P, O>): UseIntentSubmit<P, O> => {
  const needReset = useRef(false);
  const { send, info, isWorking } = useIntent<P, O>({ intent: { ...intent, key }, ...params });
  const { state, value, current, isValid, isModified, errors, set, reset } = useIntentInput<P, O>({
    intent: { ...intent, key },
    initialSetter,
    cacheTime: params.cacheTime ?? intent.cacheTime,
  });

  const submit = useCallback(() => {
    if (!isValid) return Promise.reject(new Error("input is invalid")); // TODO: Merge error
    const submission = send(...([current] as ToArgs<Inferred<P>>));
    submission.then(output => {
      if (!resetImmediately) needReset.current = true; // Do not reset immmediately.
      return output;
    });
    if (resetImmediately) reset(); // Reset immediately.
    return submission;
  }, [key, current, isValid, send, reset, resetImmediately]);

  // Reset at the next render after the submission.
  useEffect(() => {
    if (!isWorking && needReset.current === true) reset();
  }, [isWorking]);

  return { set, send, reset, submit, info, value, current, state, isWorking, isValid, isModified, errors };
};

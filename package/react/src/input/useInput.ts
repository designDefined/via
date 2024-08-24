import {
  initiateParser,
  InputSetter,
  ParserTree,
  stateFromParserTree,
  StateTree,
  StoredInput,
  update,
  valueFromState,
  ValueTree,
  isStateModified,
  isStateValid,
  InferredInitial,
  UpdateConfig,
} from "viajs-core";
import { useCallback, useEffect, useMemo } from "react";
import { useStore } from "../store";

type UseInputParams<P extends ParserTree<unknown>> = {
  key: string;
  parser: P;
  initialSetter?: InputSetter<P>;
  cacheTime?: number;
};

export type UseInput<P extends ParserTree<unknown>> = {
  set: (setter: InputSetter<P>, config?: UpdateConfig) => void;
  reset: () => void;
  value: ValueTree<P>;
  current: InferredInitial<P>;
  currentInput: InferredInitial<P>;
  state: StateTree<P>;
  errors: unknown[];
  isEmpty: boolean;
  isValid: boolean;
};

export const useInput = <P extends ParserTree<unknown>>({
  key,
  parser,
  initialSetter,
  cacheTime,
}: UseInputParams<P>): UseInput<P> => {
  const [[{ value: input }], setStored] = useStore<StoredInput<P>>({
    key,
    cacheTime,
    from: () => {
      const state = stateFromParserTree(parser);
      const current = initiateParser(parser);
      return { parser, state, current };
    },
  });

  if (!input) throw new Error("Input not found");

  const set = useCallback(
    (setter: InputSetter<P>, config?: UpdateConfig) => setStored(update(input, setter, config), { override: true }),
    [input, setStored],
  );

  const reset = useCallback(() => {
    const state = stateFromParserTree(parser);
    const current = initiateParser(parser);
    setStored({ parser, state, current }, { override: true });
    if (initialSetter) set(initialSetter, { silent: true });
  }, [parser, setStored, set, initialSetter]);

  const value = useMemo(() => valueFromState(input.state), [input.state]);
  const isEmpty = useMemo(() => !isStateModified(input.state), [input.state]);
  const isValid = useMemo(() => isStateValid(input.state), [input.state]);

  useEffect(() => {
    if (initialSetter) set(initialSetter, { silent: true });
  }, [key]);

  return {
    state: input.state,
    value,
    current: input.current,
    currentInput: input.current,
    isEmpty,
    isValid,
    errors: [],
    set,
    reset,
  };
};

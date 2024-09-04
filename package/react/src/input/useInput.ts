import {
  InputSetter,
  ParserTree,
  StateTree,
  StoredInput,
  update,
  ValueTree,
  UpdateConfig,
  getParserStateTree,
  getParserStructure,
  InferredStructure,
  reduceState,
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
  state: StateTree<P>;
  value: ValueTree<P>;
  current: InferredStructure<P>;
  isModified: boolean;
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
      const state = getParserStateTree(parser);
      const current = getParserStructure(parser);
      return { parser, state, current };
    },
  });

  if (!input) throw new Error("Input not found");

  const set = useCallback(
    (setter: InputSetter<P>, config?: UpdateConfig) => setStored(update(input, setter, config), { override: true }),
    [input, setStored],
  );

  const reset = useCallback(() => {
    const state = getParserStateTree(parser);
    const current = getParserStructure(parser);
    setStored({ parser, state, current }, { override: true });
    if (initialSetter) set(initialSetter, { silent: true });
  }, [parser, setStored, set, initialSetter]);

  const { value, isValid, isModified } = useMemo(() => {
    return reduceState(input.state);
  }, [key, input.state]);

  useEffect(() => {
    if (initialSetter) set(initialSetter, { silent: true });
  }, [key]);

  return { state: input.state, current: input.current, value, isValid, isModified, set, reset };
};

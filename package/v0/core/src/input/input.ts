/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from "immer";
import { InferredPartial, InferredStructure, Parser, ParserTree, parseSafe } from "./parser";
import { isState, isStateArray, State, getParserStateTree, StateTree } from "./state";

// core-types
export type StoredInput<P extends ParserTree<unknown>> = {
  parser: P;
  state: StateTree<P>;
  current: InferredStructure<P>;
};

export type InputSetterFunction<P extends ParserTree<unknown>> = (
  arg: InferredStructure<P>,
) => InferredStructure<P> | void;
export type InputSetter<P extends ParserTree<unknown>> = InferredPartial<P> | InputSetterFunction<P>;

// configs
export type UpdateConfig = { silent?: boolean };

// api
export const isInputSetterFunction = <P extends ParserTree<unknown>>(
  setter: InputSetter<P>,
): setter is InputSetterFunction<P> => typeof setter === "function";

export const mergePartial = <P extends ParserTree<unknown>>(
  state: StateTree<P>,
  prev: InferredStructure<P>,
  partial: InferredPartial<P>,
): InferredStructure<P> => {
  if (isState(state)) return partial as InferredStructure<P>;
  if (isStateArray(state)) {
    if (partial === undefined) return [] as InferredStructure<P>;
    const length = Math.max(state.value.length, (partial as any[]).length);
    return Array.from({ length }, (_, i) => {
      const itemState = getParserStateTree(state.parser);
      const itemPrev = (prev as any[])[i];
      const itemPartial = (partial as any[])[i];
      if (itemPrev !== undefined && itemPartial === undefined) return itemPrev;
      if (itemPrev === undefined && itemPartial !== undefined)
        return mergePartial(itemState as any, state.initial, itemPartial);
      if (itemPrev === undefined && itemPartial === undefined) return itemPrev;
      return mergePartial(itemState as any, itemPrev, itemPartial);
    }) as InferredStructure<P>;
  }

  return Object.keys(state).reduce((acc, key) => {
    if (!(key in (partial as object))) acc[key] = prev[key as keyof typeof prev];
    else
      acc[key] = mergePartial(
        state[key as keyof typeof state] as any,
        prev[key as keyof typeof prev],
        partial[key as keyof typeof partial],
      );
    return acc;
  }, {} as any);
};

export const mergeFunction = <P extends ParserTree<unknown>>(
  prev: InferredStructure<P>,
  setter: InputSetterFunction<P>,
): InferredStructure<P> => produce(prev, setter);

export const updateState = <P extends Parser<unknown>>(
  state: State<P>,
  current: InferredStructure<P>,
  silent?: boolean,
): State<P> => {
  const { value, parsed, error } = parseSafe(state.parser, current);
  return {
    ...state,
    value: (parsed ?? value) as InferredStructure<P>,
    error,
    modified: state.modified || (!silent && value !== state.value),
  };
};

export const updateStateTree = <P extends ParserTree<unknown>>(
  prevState: StateTree<P>,
  current: InferredStructure<P>,
  config?: UpdateConfig,
): StateTree<P> => {
  if (isState(prevState)) return updateState(prevState, current, config?.silent) as StateTree<P>;
  if (isStateArray(prevState)) {
    const commonState = getParserStateTree(prevState.parser);
    return {
      ...prevState,
      value: (current as any[]).map(itemValue => updateStateTree(commonState as any, itemValue, config)),
    };
  }
  return Object.keys(prevState).reduce((acc, key) => {
    const itemState = prevState[key as keyof typeof prevState] as any;
    const itemValue = current[key as keyof typeof current];
    return { ...acc, [key]: updateStateTree(itemState, itemValue, config) };
  }, {} as any);
};

export const update = <P extends ParserTree<unknown>>(
  prev: StoredInput<P>,
  setter: InputSetter<P>,
  config?: UpdateConfig,
): StoredInput<P> => {
  const newCurrent = isInputSetterFunction(setter)
    ? mergeFunction(prev.current, setter)
    : mergePartial(prev.state, prev.current, setter);
  const newState = updateStateTree(prev.state, newCurrent, config);
  return { ...prev, state: newState, current: newCurrent };
};

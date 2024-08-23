/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from "immer";
import { InferredPartial, InferredInitial, Parser, ParserTree } from "./parser";
import { isState, isStateArray, State, stateFromParserTree, StateTree } from "./state";

// core-types
export type StoredInput<P extends ParserTree<unknown>> = {
  parser: P;
  state: StateTree<P>;
  current: InferredInitial<P>;
};

export type InputSetterFunction<P extends ParserTree<unknown>> = (arg: InferredInitial<P>) => InferredInitial<P> | void;
export type InputSetter<P extends ParserTree<unknown>> = InferredPartial<P> | InputSetterFunction<P>;

// configs
export type UpdateConfig = { silent?: boolean };

// appi

export const isInputSetterFunction = <P extends ParserTree<unknown>>(
  setter: InputSetter<P>,
): setter is InputSetterFunction<P> => typeof setter === "function";

export const mergePartial = <P extends ParserTree<unknown>>(
  state: StateTree<P>,
  prev: InferredInitial<P>,
  partial: InferredPartial<P>,
): InferredInitial<P> => {
  if (isState(state)) return partial as InferredInitial<P>;
  if (isStateArray(state)) {
    if (partial === undefined) return [] as InferredInitial<P>;
    const length = Math.max(state.value.length, (partial as any[]).length);
    return Array.from({ length }, (_, i) => {
      const itemState = stateFromParserTree(state.parser);
      const itemPrev = (prev as any[])[i];
      const itemPartial = (partial as any[])[i];
      if (itemPrev !== undefined && itemPartial === undefined) return itemPrev;
      if (itemPrev === undefined && itemPartial !== undefined)
        return mergePartial(itemState as any, state.initial, itemPartial);
      if (itemPrev === undefined && itemPartial === undefined) return itemPrev;
      return mergePartial(itemState as any, itemPrev, itemPartial);
    }) as InferredInitial<P>;
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
  prev: InferredInitial<P>,
  setter: InputSetterFunction<P>,
): InferredInitial<P> => produce(prev, setter);

export const updateState = <P extends Parser<unknown>>(
  state: State<P>,
  value: InferredInitial<P>,
  silent?: boolean,
): State<P> => {
  try {
    if (value === undefined) return { ...state, value: undefined, error: undefined, modified: !silent };
    const parsed = state.parser(value) as InferredInitial<P>;
    return { ...state, value: parsed, error: undefined, modified: !silent };
  } catch (e) {
    return { ...state, value, error: e, modified: !silent };
  }
};

export const updateStateTree = <P extends ParserTree<unknown>>(
  prevState: StateTree<P>,
  value: InferredInitial<P>,
  config?: UpdateConfig,
): StateTree<P> => {
  if (isState(prevState)) return updateState(prevState, value, config?.silent) as StateTree<P>;
  if (isStateArray(prevState)) {
    const commonState = stateFromParserTree(prevState.parser);
    return {
      ...prevState,
      value: (value as any[]).map(itemValue => updateStateTree(commonState as any, itemValue, config)),
    };
  }
  return Object.keys(prevState).reduce((acc, key) => {
    const itemState = prevState[key as keyof typeof prevState] as any;
    const itemValue = value[key as keyof typeof value];
    if (itemValue === undefined) return { ...acc, [key]: itemState };
    return { ...acc, [key]: updateStateTree(itemState, itemValue, config) };
  }, {} as any);
};

export const update = <P extends ParserTree<unknown>>(
  prev: StoredInput<P>,
  setter: InputSetter<P>,
  config?: UpdateConfig,
) => {
  const newCurrent = isInputSetterFunction(setter)
    ? mergeFunction(prev.current, setter)
    : mergePartial(prev.state, prev.current, setter);
  const newState = updateStateTree(prev.state, newCurrent, config);
  return { ...prev, state: newState, current: newCurrent };
};

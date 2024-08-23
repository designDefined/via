/* eslint-disable @typescript-eslint/no-explicit-any */
import { InferredInitial, Parser, ParserTree, initiateParser, isParser, isParserArray } from "./parser";

// core types
export type State<P extends Parser<unknown>> = {
  type: "STATE";
  parser: P;
  value: InferredInitial<P> | undefined;
  error: unknown;
  modified: boolean;
};

export type StateArray<P extends [ParserTree<unknown>]> = {
  type: "ARRAY";
  parser: P[0];
  initial: InferredInitial<P[0]>;
  value: StateTree<P[0]>[];
};

export type StateTree<P extends ParserTree<unknown>> =
  P extends Parser<unknown>
    ? State<P>
    : P extends ParserTree<unknown>[]
      ? StateArray<[P[number]]>
      : P extends { [key in keyof P]: ParserTree<P[key]> }
        ? { [K in keyof P]: StateTree<P[K]> }
        : never;

export type Value<P> = P extends Parser<infer U> ? { value: U; error: unknown } : never;
export type ValueTree<P extends ParserTree<unknown>> =
  P extends Parser<unknown>
    ? Value<P>
    : P extends ParserTree<unknown>[]
      ? ValueTree<P[number]>[]
      : P extends { [key in keyof P]: ParserTree<P[key]> }
        ? { [K in keyof P]: ValueTree<P[K]> }
        : never;

// api
export const isState = <P extends Parser<unknown>>(state: unknown): state is State<P> => {
  return typeof state === "object" && state !== null && "type" in state && state.type === "STATE";
};

export const isStateArray = <P extends [ParserTree<unknown>]>(state: unknown): state is StateArray<P> =>
  typeof state === "object" && state !== null && "type" in state && state.type === "ARRAY";

export const stateFromParserTree = <P extends ParserTree<unknown>>(parserTree: P): StateTree<P> => {
  if (isParser(parserTree))
    return {
      type: "STATE" as const,
      parser: parserTree,
      value: undefined,
      error: undefined,
      modified: false,
    } as State<typeof parserTree> as StateTree<P>;

  if (isParserArray(parserTree))
    return {
      type: "ARRAY" as const,
      parser: parserTree[0],
      initial: initiateParser(parserTree[0]),
      value: [] as any[],
    } as StateArray<typeof parserTree> as StateTree<P>;

  return Object.keys(parserTree).reduce((acc, key) => {
    acc[key] = stateFromParserTree(parserTree[key as keyof P] as ParserTree<unknown>);
    return acc;
  }, {} as any) as StateTree<P>;
};

// extract
export const isStateModified = <P extends ParserTree<unknown>>(state: StateTree<P>): boolean => {
  if (isState(state)) return state.modified;
  if (isStateArray(state)) return state.value.some(isStateModified as any);
  return Object.values(state).some(isStateModified as any);
};

export const isStateValid = <P extends ParserTree<unknown>>(state: StateTree<P>): boolean => {
  if (isState(state)) return !state.error;
  if (isStateArray(state)) return state.value.every(isStateValid as any);
  return Object.values(state).every(isStateValid as any);
};

export const valueFromState = <P extends ParserTree<unknown>>(state: StateTree<P>): ValueTree<P> => {
  if (isState(state)) return { value: state.value, error: state.error } as any;
  if (isStateArray(state)) return state.value.map(valueFromState as any) as any;
  return Object.keys(state).reduce((acc, key) => {
    acc[key] = valueFromState(state[key as keyof typeof state] as unknown as any);
    return acc;
  }, {} as any) as ValueTree<P>;
};

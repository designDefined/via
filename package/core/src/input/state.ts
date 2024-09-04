/* eslint-disable @typescript-eslint/no-explicit-any */
import { InferredStructure, Parser, ParserTree, isParser, isParserArray, parseSafe } from "./parser";

// core types

// state
export type State<P extends Parser<unknown>> = {
  type: "STATE";
  parser: P;
  value: InferredStructure<P> | undefined;
  error: unknown;
  modified: boolean;
};

export type StateArray<P extends [ParserTree<unknown>]> = {
  type: "ARRAY";
  parser: P[0];
  initial: InferredStructure<P[0]>;
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

// value
export type Value<P> = P extends Parser<infer U> ? { value: U; error: unknown; modified: boolean } : never;
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

export const getParserStateTree = <P extends ParserTree<unknown>>(parserTree: P): StateTree<P> => {
  if (isParser(parserTree)) {
    const { value, error } = parseSafe<typeof parserTree, undefined>(parserTree, undefined);
    return { type: "STATE" as const, parser: parserTree, value, error, modified: false } as StateTree<P>;
  }
  if (isParserArray(parserTree))
    return {
      type: "ARRAY" as const,
      parser: parserTree[0],
      initial: parserTree[0],
      value: [] as any[],
    } as StateTree<P>;

  return Object.keys(parserTree).reduce((acc, key) => {
    acc[key] = getParserStateTree(parserTree[key as keyof P] as ParserTree<unknown>);
    return acc;
  }, {} as any) as StateTree<P>;
};

export const reduceState = <P extends ParserTree<unknown>>(
  state: StateTree<P>,
): { value: ValueTree<P>; isModified: boolean; isValid: boolean } => {
  if (isState(state))
    return {
      value: { value: state.value, error: state.error, modified: state.modified } as ValueTree<P>,
      isModified: state.modified,
      isValid: !state.error,
    };
  if (isStateArray(state))
    return state.value.reduce(
      (acc, item) => {
        const { value, isModified, isValid } = reduceState(item as StateTree<any>);
        acc.value.push(value);
        if (isModified) acc.isModified = true;
        if (!isValid) acc.isValid = false;
        return acc;
      },
      { value: [], isModified: false, isValid: true } as any,
    );
  return Object.keys(state).reduce(
    (acc, key) => {
      const { value, isModified, isValid } = reduceState(state[key as keyof typeof state] as StateTree<any>);
      acc.value[key] = value;
      if (isModified) acc.isModified = true;
      if (!isValid) acc.isValid = false;
      return acc;
    },
    { value: {} as any, isModified: false, isValid: true } as any,
  );
};

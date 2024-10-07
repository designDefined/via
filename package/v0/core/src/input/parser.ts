/* eslint-disable @typescript-eslint/no-explicit-any */
import { UndefinedToOptional } from "../util/optional";

/**
 * Parser defines the type and structure of input data.
 */

// core types
export type Parser<T> = (arg: unknown) => T;
export type ParserTree<T> = Parser<T> | { [key in keyof T]: ParserTree<T[key]> } | [ParserTree<T>];

// type inference
type TypeOfParserTree<P extends ParserTree<unknown>> =
  P extends Parser<infer U>
    ? U
    : P extends [infer U extends ParserTree<unknown>]
      ? TypeOfParserTree<U>[]
      : P extends { [key in keyof P]: ParserTree<P[key]> }
        ? UndefinedToOptional<{ [K in keyof P]: TypeOfParserTree<P[K]> }>
        : never;

type StructureOfParserTree<P extends ParserTree<unknown>> =
  P extends Parser<infer U>
    ? U | undefined // primitive values are still optional
    : P extends [infer U extends ParserTree<unknown>]
      ? StructureOfParserTree<U>[]
      : P extends { [key in keyof P]: ParserTree<P[key]> }
        ? { [K in keyof P]: StructureOfParserTree<P[K]> }
        : never;

type PartialTypeOfParserTree<P extends ParserTree<unknown>> =
  P extends Parser<infer U>
    ? U | undefined
    : P extends [infer U extends ParserTree<unknown>]
      ? PartialTypeOfParserTree<U>[] | undefined
      : P extends { [key in keyof P]: ParserTree<P[key]> }
        ? { [K in keyof P]?: PartialTypeOfParserTree<P[K]> }
        : never;

export type Inferred<P extends ParserTree<unknown>> = TypeOfParserTree<P>;
export type InferredStructure<P extends ParserTree<unknown>> = StructureOfParserTree<P>;
export type InferredPartial<P extends ParserTree<unknown>> = PartialTypeOfParserTree<P>;

// api
export const isParser = <T>(parser: unknown): parser is Parser<T> => typeof parser === "function";
export const isParserArray = <T>(parser: unknown): parser is [ParserTree<T>] => Array.isArray(parser);

export const Parser = <T>(arg: unknown) => {
  if (arg === undefined) throw new Error("Value is empty");
  return arg as T;
};
export const ParserOptional = <T>(arg: unknown) => arg as T | undefined;
export const ParserOf = <T>(parser: Parser<T>) => parser;

export const getParserStructure = <P extends ParserTree<unknown>>(parserTree: P): InferredStructure<P> =>
  isParser(parserTree)
    ? undefined
    : isParserArray(parserTree)
      ? ([] as InferredStructure<P>[])
      : Object.keys(parserTree).reduce((acc, key) => {
          acc[key] = getParserStructure(parserTree[key as keyof P] as ParserTree<unknown>);
          return acc;
        }, {} as any);

export const parseSafe = <P extends Parser<unknown>, T>(
  parser: P,
  value: T,
): { value: T; parsed?: Inferred<P>; error?: unknown } => {
  try {
    const parsed = parser(value) as Inferred<P>;
    return { value, parsed };
  } catch (e) {
    return { value, error: e };
  }
};

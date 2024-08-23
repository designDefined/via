/* eslint-disable @typescript-eslint/no-explicit-any */
import { UndefinedToOptional } from "../util/optional";

// core types
export type Parser<T> = (arg: unknown) => T;
export type ParserTree<T> = Parser<T> | { [key in keyof T]: ParserTree<T[key]> } | [ParserTree<T>];

// inference types
type TypeOfParserTree<P extends ParserTree<unknown>> =
  P extends Parser<infer U>
    ? U
    : P extends [infer U extends ParserTree<unknown>]
      ? TypeOfParserTree<U>[]
      : P extends { [key in keyof P]: ParserTree<P[key]> }
        ? UndefinedToOptional<{ [K in keyof P]: TypeOfParserTree<P[K]> }>
        : never;

type PartialTypeOfParserTree<P extends ParserTree<unknown>> =
  P extends Parser<infer U>
    ? U | undefined
    : P extends [infer U extends ParserTree<unknown>]
      ? PartialTypeOfParserTree<U>[] | undefined
      : P extends { [key in keyof P]: ParserTree<P[key]> }
        ? { [K in keyof P]?: PartialTypeOfParserTree<P[K]> }
        : never;

type InitialTypeOfParserTree<P extends ParserTree<unknown>> =
  P extends Parser<infer U>
    ? U | undefined // primitive values are still optional
    : P extends [infer U extends ParserTree<unknown>]
      ? InitialTypeOfParserTree<U>[]
      : P extends { [key in keyof P]: ParserTree<P[key]> }
        ? { [K in keyof P]: InitialTypeOfParserTree<P[K]> }
        : never;

// alias
export type Inferred<P extends ParserTree<unknown>> = TypeOfParserTree<P>;
export type InferredPartial<P extends ParserTree<unknown>> = PartialTypeOfParserTree<P>;
export type InferredInitial<P extends ParserTree<unknown>> = InitialTypeOfParserTree<P>;

// api
export const isParser = <T>(parser: unknown): parser is Parser<T> => typeof parser === "function";
export const isParserArray = <T>(parser: unknown): parser is [ParserTree<T>] => Array.isArray(parser);

export const Parser = <T>(arg: unknown) => arg as T;
export const initiateParser = <P extends ParserTree<unknown>>(parserTree: P): InferredInitial<P> =>
  isParser(parserTree)
    ? undefined
    : isParserArray(parserTree)
      ? ([] as InferredInitial<P>[])
      : Object.keys(parserTree).reduce((acc, key) => {
          acc[key] = initiateParser(parserTree[key as keyof P] as ParserTree<unknown>);
          return acc;
        }, {} as any);

// import { UndefinedToOptional } from "../util/optional";

// // Parser
// export type Parser<T> = (arg: unknown) => T;
// export type ParserTree<T> = Parser<T> | { [key in keyof T]: ParserTree<T[key]> };
// export type TypeOfParserTree<T extends ParserTree<unknown>> =
//   T extends Parser<infer U>
//     ? U
//     : T extends ParserTree<infer U>[]
//       ? TypeOfParserTree<ParserTree<U>>[]
//       : T extends { [key in keyof T]: ParserTree<T[key]> }
//         ? UndefinedToOptional<{ [K in keyof T]: TypeOfParserTree<T[K]> }>
//         : never;
// export const Parser = <T>(arg: unknown) => arg as T;

// export type PartialTypeOfParserTree<P extends ParserTree<unknown>> =
//   P extends Parser<infer U>
//     ? U | undefined
//     : P extends ParserTree<infer U>[]
//       ? PartialTypeOfParserTree<ParserTree<U>>[] | undefined
//       : P extends { [key in keyof P]: ParserTree<P[key]> }
//         ? UndefinedToOptional<{ [K in keyof P]: PartialTypeOfParserTree<P[K]> }>
//         : never;

// export type Inferred<P extends ParserTree<unknown>> = TypeOfParserTree<P>; // Shorter alias for TypeOfParserTree
// export type InferredPartial<P extends ParserTree<unknown>> = PartialTypeOfParserTree<P>; // Shorter alias for PartialTypeOfParserTree

// const isParser = <T>(parser: any): parser is Parser<T> => {
//   return typeof parser === "function";
// };

// // Input State
// export type InputState<T> = {
//   _isLeaf: true;
//   parser: Parser<T>;
//   compared?: T;
//   value?: T;
//   error?: unknown;
// };

// export type InputStateArray<T> = {
//   _isArray: true;
//   parser: ParserTree<T>;
//   children: InputStateTree<ParserTree<T>>[];
// };

// export type InputStateTree<P extends ParserTree<unknown>> =
//   P extends Parser<infer U>
//     ? InputState<U>
//     : P extends ParserTree<infer U>[]
//       ? InputStateArray<U>
//       : P extends { [key in keyof P]: ParserTree<P[key]> }
//         ? UndefinedToOptional<{ [K in keyof P]: InputStateTree<P[K]> }>
//         : never;

// // Input Value
// export type InputValue<T> = {
//   value?: T;
//   error: unknown;
// };
// export type InputValueTree<P extends ParserTree<unknown>> =
//   P extends Parser<infer U>
//     ? InputValue<U>
//     : P extends { [key in keyof P]: ParserTree<P[key]> }
//       ? { [K in keyof P]: InputValueTree<P[K]> }
//       : never;

// const isInputState = <P extends ParserTree<unknown>>(value: any): value is InputState<Inferred<P>> => {
//   return typeof value === "object" && value !== null && "_isLeaf" in value && value["_isLeaf"] === true;
// };
// const isInputStateArray = <P extends ParserTree<unknown>>(value: any): value is InputStateArray<Inferred<P>> => {
//   return typeof value === "object" && value !== null && "_isArray" in value && value["_isArray"] === true;
// };

// // Merge
// const mergeValue = <T>(inputState: InputState<T>, value?: T): InputState<T> => {
//   try {
//     const parsed = value === undefined ? undefined : inputState.parser(value);
//     return { ...inputState, value: parsed, error: null };
//   } catch (e) {
//     return { ...inputState, value, error: e };
//   }
// };

// const mergeCompared = <T>(inputState: InputState<T>, compared: T): InputState<T> => {
//   return { ...inputState, compared };
// };

// // export const mergeValueWithInputState = <P extends ParserTree<unknown>>(
// //   inputState: InputStateTree<P>,
// //   value: Inferred<P>,
// // ): InputStateTree<P> => {
// //   if (isInputState<P>(inputState)) return mergeValue<Inferred<P>>(inputState, value) as InputStateTree<P>;

// //   return Object.keys(inputState).reduce((acc, key) => {
// //     acc[key] = mergeValueWithInputState(
// //       inputState[key as keyof typeof inputState] as any,
// //       value[key as keyof typeof value],
// //     );
// //     return acc;
// //   }, {} as any);
// // };

// export const mergePartialValueWithInputState = <P extends ParserTree<unknown>>(
//   inputState: InputStateTree<P>,
//   partial?: InferredPartial<P>,
// ): InputStateTree<P> => {
//   if (isInputState<P>(inputState))
//     return mergeValue<Inferred<P>>(inputState, partial as Inferred<P> | undefined) as InputStateTree<P>;
//   if (isInputStateArray<P>(inputState)) {
//     if (!partial || !Array.isArray(partial)) return inputState;

//     return {
//       ...inputState,
//       children: partial.map((partial, index) => {
//         if (inputState.children[index] === undefined) {
//           const newState = initializeInputStateFromParser(inputState.parser);
//           return mergePartialValueWithInputState(newState, partial as any);
//         }
//         return mergePartialValueWithInputState(inputState.children[index], partial as any);
//       }),
//     };
//   }

//   return Object.keys(inputState).reduce((acc, key) => {
//     if (key in (partial ?? {})) {
//       const nextValue = partial ? partial?.[key as keyof typeof partial] : undefined;
//       acc[key] = mergePartialValueWithInputState(inputState[key as keyof typeof inputState] as any, nextValue);
//       return acc;
//     } else {
//       acc[key] = inputState[key as keyof typeof inputState];
//       return acc;
//     }
//   }, {} as any);
// };

// export const mergePartialComparedWithInputState = <P extends ParserTree<unknown>>(
//   inputState: InputStateTree<P>,
//   partial?: PartialTypeOfParserTree<P>,
// ): InputStateTree<P> => {
//   if (partial === undefined) return inputState;
//   if (isInputState<P>(inputState))
//     return mergeCompared<Inferred<P>>(inputState, partial as Inferred<P>) as InputStateTree<P>;

//   return Object.keys(inputState).reduce((acc, key) => {
//     const nextValue = partial ? partial?.[key as keyof typeof partial] : undefined;
//     acc[key] = mergePartialComparedWithInputState(inputState[key as keyof typeof inputState] as any, nextValue);
//     return acc;
//   }, {} as any);
// };

// // Extract
// // export const extractExistingValueFromInputState = <P extends ParserTree<unknown>>(
// //   inputState: InputStateTree<P>,
// // ): Inferred<P> => {
// //   if (isInputState(inputState))
// //     return (inputState.input !== undefined ? inputState.input : inputState.init) as Inferred<P>;

// //   return Object.keys(inputState).reduce((acc, key) => {
// //     acc[key] = extractExistingValueFromInputState(inputState[key as keyof typeof inputState] as any);
// //     return acc;
// //   }, {} as any);
// // };

// export const extractFromInputState = <P extends ParserTree<unknown>>(
//   inputState: InputStateTree<P>,
// ): { inputValue: InputValueTree<P>; current: InferredPartial<P>; isEmpty: boolean; errors: unknown[] } => {
//   if (isInputState(inputState))
//     return {
//       inputValue: { value: inputState.value, error: inputState.error } as InputValueTree<P>,
//       current: inputState.value as InferredPartial<P>,
//       isEmpty: inputState.value === undefined,
//       errors: inputState.error ? [inputState.error] : [],
//     };

//   if (isInputStateArray(inputState)) {
//     const { current, ...newState } = inputState.children.reduce(
//       (acc, state) => {
//         const { inputValue, current, isEmpty, errors } = extractFromInputState(state);
//         if (current !== undefined) acc.current.push(current);
//         acc.inputValue.push(inputValue);
//         acc.errors.push(...errors);
//         if (acc.isEmpty) acc.isEmpty = isEmpty;
//         return acc;
//       },
//       { inputValue: [], current: [], isEmpty: true, errors: [] } as any,
//     );
//     if (current.length > 0) newState.current = current;
//     return newState;
//   }

//   return Object.keys(inputState).reduce(
//     (acc, key) => {
//       const { inputValue, current, isEmpty, errors } = extractFromInputState(
//         inputState[key as keyof typeof inputState] as any,
//       );
//       if (current !== undefined) acc.current[key as keyof typeof inputState] = current;
//       acc.inputValue[key as keyof typeof inputState] = inputValue;
//       acc.errors = [...acc.errors, ...errors];
//       if (acc.isEmpty) acc.isEmpty = isEmpty;

//       return acc;
//     },
//     { inputValue: {}, current: {}, isEmpty: true, errors: [] } as any,
//   );
// };

// // export const extractErrorsFromInputState = <P extends ParserTree<unknown>>(
// //   inputState: InputStateTree<P>,
// // ): unknown[] => {
// //   if (isInputState(inputState)) {
// //     if (inputState.error) return [inputState.error];
// //     return [];
// //   }

// //   return Object.keys(inputState).reduce((acc, key) => {
// //     acc = [...acc, ...extractErrorsFromInputState(inputState[key as keyof typeof inputState] as any)];
// //     return acc;
// //   }, [] as unknown[]);
// // };

// // export const extractInitFromInputState = <P extends ParserTree<unknown>>(
// //   inputState: InputStateTree<P>,
// // ): Inferred<P> => {
// //   if (isInputState(inputState)) return inputState.init as Inferred<P>;

// //   return Object.keys(inputState).reduce((acc, key) => {
// //     acc[key] = extractInitFromInputState(inputState[key as keyof typeof inputState] as any);
// //     return acc;
// //   }, {} as any);
// // };

// // export const extractInputValueFromInputState = <P extends ParserTree<unknown>>(
// //   inputState: InputStateTree<P>,
// // ): InputValueTree<P> => {
// //   if (isInputState(inputState)) {
// //     return {
// //       value: inputState.input !== undefined ? inputState.input : inputState.init,
// //       error: inputState.error,
// //     } as InputValueTree<P>;
// //   }

// //   return Object.keys(inputState).reduce((acc, key) => {
// //     acc[key] = extractInputValueFromInputState(inputState[key as keyof typeof inputState] as any);
// //     return acc;
// //   }, {} as any);
// // };

// // Initialize
// export const initializeInputStateFromParser = <P extends ParserTree<unknown>>(parser: P): InputStateTree<P> => {
//   if (isParser(parser)) return { _isLeaf: true, parser, error: null, value: undefined } as InputStateTree<P>;
//   if (Array.isArray(parser))
//     return { _isArray: true, parser: parser[0], children: [] } as InputStateArray<P> as InputStateTree<P>;
//   return Object.keys(parser).reduce((acc, key) => {
//     acc[key] = initializeInputStateFromParser(parser[key as keyof typeof parser] as any);
//     return acc;
//   }, {} as any);
// };

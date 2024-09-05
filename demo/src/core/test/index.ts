import { Inferred, Intent, Parser, ParserOptional, View } from "viajs-core";

export const TestParser = {
  required: Parser<string>,
  optional1: ParserOptional<string>,
  optional2: ParserOptional<string>,
};
export const TestIntent = Intent<[], typeof TestParser>(() => ({
  key: ["intent", "test"],
  parser: TestParser,
  to: input => input.required,
  next: ({ i }) => [TestView().set(i)],
}));

export const TestView = View<[], Inferred<typeof TestParser>>(() => ({
  key: ["view", "test"],
  from: () => ({ required: "초기값" }),
}));

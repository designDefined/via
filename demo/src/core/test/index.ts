import { Intent, Parser, ParserOptional } from "viajs-core";

export const TestParser = {
  required: Parser<string>,
  optional1: ParserOptional<string>,
  optional2: ParserOptional<string>,
};
export const TestIntent = Intent<[], typeof TestParser>(() => ({
  key: ["intent", "test"],
  parser: TestParser,
  to: input => {
    const promise = new Promise<string>(resolve => {
      const message = Object.values(input).join(", ");
      setTimeout(() => {
        resolve(message);
      }, 5000);
    });
    return promise;
  },
}));

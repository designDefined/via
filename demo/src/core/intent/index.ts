import { Intent, Parser } from "viajs-core";
import { mock } from "../repository";
import { TextView } from "../view";

export const TextIntent = Intent<[], Parser<string>>(() => ({
  key: ["intent", "text"],
  parser: Parser<string>,
  to: input => mock.post("test_text", input),
  next: () => [TextView().invalidate],
}));

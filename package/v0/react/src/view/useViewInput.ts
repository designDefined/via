import { InputSetter, ParserTree, View } from "viajs-core";
import { useInput } from "../input/useInput";

type UseViewInputParams<P extends ParserTree<unknown>, O> = {
  view: View<O>;
  parser: P;
  initialSetter?: InputSetter<P>;
};

export const useViewInput = <P extends ParserTree<unknown>, O>({
  view: { key },
  parser,
  initialSetter,
}: UseViewInputParams<P, O>) => {
  if (!parser) throw new Error("no parser provided");
  const input = useInput<P>({ key: "input" + key, parser, initialSetter });
  return input;
};

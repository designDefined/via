import { Inferred, Parser, ParserTree } from "../input";
import { Next } from "../store";
import { Falsy } from "../util/falsy";
import { hashKeys, RawKey } from "../util/hashKey";

export type ToArgs<I> = I extends void ? never[] : [I];
export type To<I, O> = (...args: ToArgs<I>) => O | Promise<O>;

export type IntentParams<P extends ParserTree<unknown>, O> = {
  key: (RawKey | Falsy)[];
  parser?: P;
  to?: To<Inferred<P>, O>;
  next?: (result: { i: Inferred<P>; o: O }) => (Next | Falsy)[];
  catch?: (result: { i: Inferred<P>; error: unknown }) => (Next | Falsy)[];
  model?: { i?: Parser<Inferred<P>>; o?: Parser<O> };
  cacheTime?: number;
};

export type StoredIntent<I, O> = {
  lastInput?: I;
  lastOutput?: O;
  isWorking: boolean;
};

export const Intent =
  <Deps extends unknown[] = never[], P extends ParserTree<unknown> = () => void, O = unknown>(
    params: (...deps: Deps) => IntentParams<P, O>,
  ) =>
  (...args: Deps) => {
    const intent = params(...args);
    const key = hashKeys(intent.key);
    return { ...intent, key };
  };

export type Intent<P extends ParserTree<unknown>, O> = ReturnType<ReturnType<typeof Intent<unknown[], P, O>>>;

import { AnyKey, fetchState, StateSnapshot } from "../store";
import { Init } from "../store/initAndUpdate";
import { Observable } from "rxjs";

export type ViewParams<Deps extends unknown[], Value> = (deps: Deps) => {
  key: AnyKey;
  from?: Init<Value>;
};

export const View =
  <Deps extends unknown[], T>(params: ViewParams<Deps, T>) =>
  (...deps: Deps) => {
    const { key, from } = params(deps);
    const [subject] = fetchState<T>({ key, init: from });
    const slice = new Observable<StateSnapshot<T>>(subject.subscribe);
    return slice;
  };

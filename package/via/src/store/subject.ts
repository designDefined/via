import { Subject } from "rxjs";
import { SnapshotFrom } from "xstate";
import { StateActor } from "./actor";

export const createStateSubject = <T>() => {
  const subject = new Subject<SnapshotFrom<StateActor<T>>>();
  return subject;
};

export type StateSubject<Value> = ReturnType<typeof createStateSubject<Value>>;

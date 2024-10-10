import { BehaviorSubject, Subject } from "rxjs";
import { SnapshotFrom } from "xstate";
import { StateActor } from "./actor";

type CreateStateSubjectParams<Value> = {
  initialValue: SnapshotFrom<StateActor<Value>>;
};
export const createStateSubject = <T>({ initialValue }: CreateStateSubjectParams<T>) => {
  const subject = new BehaviorSubject<SnapshotFrom<StateActor<T>>>(initialValue);
  return subject;
};

export type StateSubject<Value> = ReturnType<typeof createStateSubject<Value>>;

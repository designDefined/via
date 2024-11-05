import { BehaviorSubject } from "rxjs";
import { AsyncronousActor, createAsyncActor, createSyncActor, SyncronousActor } from "./actor";
import { isPromise } from "../common/promise";
import { SnapshotFrom } from "xstate";

// core types

// snapshot
export type SyncronousSnapshot<T> = { state: "fulfilled"; value: T; promise: undefined; error: unknown };
export type AsyncronousSnapshot<T> =
  | { state: "pending"; value: undefined; promise: Promise<T>; error: unknown }
  | { state: "fulfilled"; value: T; promise: undefined; error: unknown }
  | { state: "rejected"; value: undefined; promise: undefined; error: unknown };

// state
export type SyncronousState<T> = {
  actor: SyncronousActor<T>;
  subject: BehaviorSubject<SyncronousSnapshot<T>>;
};
export type AsyncronousState<T> = {
  actor: AsyncronousActor<T>;
  subject: BehaviorSubject<AsyncronousSnapshot<T>>;
};
export type State<T> = SyncronousState<T> | AsyncronousState<T>;

// inferred
export type InferredSnapshot<T> = T extends Promise<infer U> ? AsyncronousSnapshot<U> : SyncronousSnapshot<T>;
export type InferredState<T> = T extends Promise<infer U> ? AsyncronousState<U> : SyncronousState<T>;

// syncronous
const mapSyncSnapshot = <Value>(actorSnapshot: SnapshotFrom<SyncronousActor<Value>>): SyncronousSnapshot<Value> => ({
  state: actorSnapshot.value,
  value: actorSnapshot.context.value,
  promise: undefined,
  error: undefined,
});
export const createSyncState = <Value>({
  id,
  from,
  initialValue,
}: {
  id: string;
  from: () => Value;
  initialValue: Value;
}): SyncronousState<Value> => {
  const actor = createSyncActor({ id, from, initialValue: initialValue });
  const subject = new BehaviorSubject<SyncronousSnapshot<Value>>(mapSyncSnapshot(actor.getSnapshot()));
  actor.subscribe(s => subject.next(mapSyncSnapshot(s)));
  actor.start();

  return { actor, subject };
};

// asyncronous
const mapAsyncSnapshot = <Value>(actorSnapshot: SnapshotFrom<AsyncronousActor<Value>>): AsyncronousSnapshot<Value> =>
  ({
    state: actorSnapshot.value,
    value: actorSnapshot.context.value,
    promise: actorSnapshot.context.promise,
    error: actorSnapshot.context.error,
  }) as AsyncronousSnapshot<Value>;

export const createAsyncState = <Value>({
  id,
  from,
  initialValue,
}: {
  id: string;
  from: () => Promise<Value>;
  initialValue: Promise<Value>;
}): AsyncronousState<Value> => {
  const actor = createAsyncActor({ id, from, initialValue });
  const subject = new BehaviorSubject<AsyncronousSnapshot<Value>>(mapAsyncSnapshot(actor.getSnapshot()));
  actor.subscribe(s => subject.next(mapAsyncSnapshot(s)));
  actor.start();
  return { actor, subject };
};

// api
export const createState = <T>({ id, from, initialValue }: { id: string; from: () => T; initialValue: T }) => {
  return (
    isPromise(initialValue)
      ? createAsyncState({ id, from: from as () => Promise<unknown>, initialValue })
      : createSyncState({ id, from, initialValue })
  ) as InferredState<T>;
};

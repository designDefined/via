import { BehaviorSubject } from "rxjs";
import { AsyncronousActor, createAsyncActor, createSyncActor, SyncronousActor } from "./actor";
import { AsyncronousFrom, From, SyncronousFrom } from "./from";
import { isPromise } from "../utility/isPromise";
import { SnapshotFrom } from "xstate";

// core types
export type SyncronousSnapshot<T> = { state: "fulfilled"; value: T; promise: undefined; error: unknown };
export type AsyncronousSnapshot<T> =
  | { state: "pending"; value: undefined; promise: Promise<T>; error: unknown }
  | { state: "fulfilled"; value: T; promise: undefined; error: unknown }
  | { state: "rejected"; value: undefined; promise: undefined; error: unknown };

export type SyncronousState<T> = {
  actor: SyncronousActor<T>;
  subject: BehaviorSubject<SyncronousSnapshot<T>>;
};
export type AsyncronousState<T> = {
  actor: AsyncronousActor<T>;
  subject: BehaviorSubject<AsyncronousSnapshot<T>>;
};
export type State<T> = SyncronousState<T> | AsyncronousState<T>;

// syncronous
const mapSyncSnapshot = <Value>(actorSnapshot: SnapshotFrom<SyncronousActor<Value>>): SyncronousSnapshot<Value> => ({
  state: actorSnapshot.value,
  value: actorSnapshot.context.value,
  promise: undefined,
  error: undefined,
});
const createSyncState = <Value>({
  id,
  from,
  initialValue,
}: {
  id: string;
  from: SyncronousFrom<Value>;
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

const createAsyncState = <Value>({
  id,
  from,
  initialValue,
}: {
  id: string;
  from: AsyncronousFrom<Value>;
  initialValue: Promise<Value>;
}) => {
  const actor = createAsyncActor({ id, from, initialValue });
  const subject = new BehaviorSubject<AsyncronousSnapshot<Value>>(mapAsyncSnapshot(actor.getSnapshot()));
  actor.subscribe(s => subject.next(mapAsyncSnapshot(s)));
  actor.start();
  return { actor, subject };
};

// api
export const createState = <Value>({ id, from }: { id: string; from: From<Value> }) => {
  const initialValue = from();
  return (
    isPromise(initialValue)
      ? createAsyncState({ id, from: from as AsyncronousFrom<Value>, initialValue })
      : createSyncState({ id, from: from as SyncronousFrom<Value>, initialValue })
  ) as ReturnType<typeof from> extends Promise<unknown> ? AsyncronousState<Value> : SyncronousState<Value>;
};

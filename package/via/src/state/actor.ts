import { setup, assign, createActor, fromPromise } from "xstate";
import { AsyncronousFrom, SyncronousFrom } from "./from";

// syncronous
type SyncronousContext<Value> = {
  from: SyncronousFrom<Value>;
  value: Value;
};
type SyncronousEvent<Value> = { type: "set"; value: Value };

export const createSyncActor = <Value>({
  id,
  from,
  initialValue,
}: {
  id: string;
  from: SyncronousFrom<Value>;
  initialValue: Value;
}) => {
  const machine = setup({
    types: {
      context: {} as SyncronousContext<Value>,
      events: {} as SyncronousEvent<Value>,
    },
  }).createMachine({
    context: { from, value: initialValue },
    id,
    initial: "fulfilled",
    states: {
      fulfilled: {
        on: {
          set: { actions: assign({ value: ({ event }) => event.value }) },
        },
      },
    },
  });
  const actor = createActor(machine);
  return actor;
};

export type SyncronousActor<T> = ReturnType<typeof createSyncActor<T>>;

// asyncronous
type AsyncronousContext<Value> = {
  from: AsyncronousFrom<Value>;
  value?: Value;
  promise?: Promise<Value>;
  error?: unknown;
};

type AsyncronousEvent<T> = { type: "set"; value: T };

export const createAsyncActor = <T>({
  id,
  from,
  initialValue,
}: {
  id: string;
  from: AsyncronousFrom<T>;
  initialValue: Promise<T>;
}) => {
  const machine = setup({
    types: {
      context: {} as AsyncronousContext<T>,
      events: {} as AsyncronousEvent<T>,
    },
    actors: {
      fetch: fromPromise(({ input }: { input: { promise: Promise<T> } }) => input.promise),
    },
  }).createMachine({
    context: { from, promise: initialValue },
    id,
    initial: "pending",
    states: {
      pending: {
        invoke: {
          id: "fetcher",
          src: "fetch",
          input: ({ context }) => ({ promise: context.promise ?? from() }),
          onDone: {
            target: "fulfilled",
            actions: assign({ value: ({ event }) => event.output, promise: undefined }),
          },
          onError: {
            target: "rejected",
            actions: assign({ error: ({ event }) => event.error, promise: undefined }),
          },
        },
      },
      fulfilled: {},
      rejected: {},
    },
  });

  const actor = createActor(machine);
  return actor;
};

export type AsyncronousActor<T> = ReturnType<typeof createAsyncActor<T>>;

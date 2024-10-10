import { setup, assign, createActor } from "xstate";
import { Key } from "./key";
import { Init, Updater } from "./initAndUpdate";

// core types
type Context<Value> = {
  value?: Value;
  promise?: Promise<Value>;
  error: unknown;
  init?: Init<Value>;
  updater?: Updater<Value>;
  staleTime?: number;
  gcTimer?: number;
};

type Event<Value> =
  | { type: "value.initialized"; value: Value }
  | { type: "value.requested"; promise: Promise<Value> }
  | { type: "value.thrown"; error: unknown }
  | { type: "value.retried" }
  | { type: "value.invalidated"; promise: Promise<Value> }
  | { type: "value.updateRequested"; promise: Promise<Value> }
  | { type: "request.fulfilled"; value: Value }
  | { type: "request.rejected"; error: unknown }
  | { type: "updateRequest.fulfilled"; value: Value }
  | { type: "updateRequest.rejected"; error: unknown };

// createStateActor
type CreateStateActorParams<Value> = {
  key: Key;
  init?: Init<Value>;
  updater?: Updater<Value>;
};

export const createStateActor = <T>({ key, init, updater }: CreateStateActorParams<T>) => {
  const machine = setup({
    types: {
      context: {} as Context<T>,
      events: {} as Event<T>,
    },
  }).createMachine({
    context: {
      staleTime: undefined,
      promise: undefined,
      value: undefined,
      error: undefined,
      init: init,
      updater: updater,
    },
    id: key,
    initial: "empty",
    states: {
      empty: {
        on: {
          "value.initialized": {
            target: "success",
            actions: assign({ value: ({ event }) => event.value }),
          },
          "value.requested": {
            target: "pending",
            actions: assign({ promise: ({ event }) => event.promise }),
          },
          "value.thrown": {
            target: "fail",
            actions: assign({ error: ({ event }) => event.error }),
          },
        },
      },
      success: {
        initial: "fresh",
        states: {
          fresh: {
            on: {
              "value.invalidated": {
                target: "refetching",
                actions: assign({ promise: ({ event }) => event.promise }),
              },
              "value.updateRequested": {
                target: "updating",
                actions: assign({ promise: ({ event }) => event.promise }),
              },
            },
          },
          refetching: {
            on: {
              "request.fulfilled": {
                target: "fresh",
                actions: assign({ value: ({ event }) => event.value }),
              },
              "request.rejected": {
                target: "..fail",
                actions: assign({ error: ({ event }) => event.error }),
              },
            },
          },
          updating: {
            on: {
              "updateRequest.fulfilled": {
                target: "fresh",
                actions: assign({ value: ({ event }) => event.value }),
              },
              "updateRequest.rejected": {
                target: "..fail",
                actions: assign({ error: ({ event }) => event.error }),
              },
            },
          },
        },
      },
      pending: {
        on: {
          "request.fulfilled": {
            target: "success",
            actions: assign({ value: ({ event }) => event.value }),
          },
          "request.rejected": {
            target: "fail",
            actions: assign({ error: ({ event }) => event.error }),
          },
        },
      },
      fail: {
        on: {
          "value.retried": "pending",
        },
      },
    },
  });

  const actor = createActor(machine);
  return actor;
};

export type StateActor<Value> = ReturnType<typeof createStateActor<Value>>;

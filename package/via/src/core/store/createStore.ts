import { assign, createActor, createMachine, MachineTypes, setup } from "xstate";
import { AnyKey, Key } from "./key";

type CreateStoreParams = {
  key: AnyKey;
};

export const createStore = <T>({ key: _key }: CreateStoreParams) => {
  const key = Key.parse(_key);
  const machine = setup({
    types: {
      context: {} as {
        value?: T;
        promise?: Promise<T>;
        error: unknown;
        staleTime?: number;
        gcTimer?: number;
      },
      events: {} as
        | { type: "value.initialized"; value: T }
        | { type: "value.requested"; promise: Promise<T> }
        | { type: "value.thrown"; error: unknown }
        | { type: "value.retried" }
        | { type: "value.invalidated"; promise: Promise<T> }
        | { type: "value.updateRequested"; promise: Promise<T> }
        | { type: "request.fulfilled"; value: T }
        | { type: "request.rejected"; error: unknown }
        | { type: "updateRequest.fulfilled"; value: T }
        | { type: "updateRequest.rejected"; error: unknown },
    },
  }).createMachine({
    context: {
      staleTime: undefined,
      promise: undefined,
      value: undefined,
      error: undefined,
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

  actor.subscribe(({ value, context }) => {
    console.log(value);
    console.log(context);
  });

  actor.start();

  return { key, actor };
};

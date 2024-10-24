import { AsyncronousSubscriber } from "./subscriber";

export type AsyncronousSubscribable<Value> = {
  subscribe: (subscriber: AsyncronousSubscriber<Value>) => () => void;
};

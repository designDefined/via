import { AsyncronousSnapshot } from "../state";

export type AsyncronousSubscriber<Value> = (snaphsot: AsyncronousSnapshot<Value>) => (() => void) | void;

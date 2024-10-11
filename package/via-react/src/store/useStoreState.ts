import { useSyncExternalStore } from "react";

import { BehaviorSubject } from "rxjs";

type UseSubscribedStateParams<Value> = {
  subject: BehaviorSubject<Value>;
};

export const useSubscribedState = <T>({ subject }: UseSubscribedStateParams<T>) => {
  const value = useSyncExternalStore(sub => subject.subscribe(sub).unsubscribe, subject.getValue);
  return value;
};

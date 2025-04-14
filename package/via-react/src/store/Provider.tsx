import { Store } from "@viable/via";
import { PropsWithChildren } from "react";
import { ViaContext } from "./context";

export const Via = ({ store, children }: PropsWithChildren<{ store: Store }>) => (
  <ViaContext.Provider value={store}>{children}</ViaContext.Provider>
);

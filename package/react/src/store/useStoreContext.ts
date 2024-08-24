import { useContext } from "react";
import { ViaContext } from "./storeContext";

export const useStoreContext = () => {
  const store = useContext(ViaContext);
  if (!store) throw new Error("useStore must be used within proper context");

  return store;
};

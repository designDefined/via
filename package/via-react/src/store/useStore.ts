import { useContext } from "react";
import { ViaContext } from "./context";

export const useStore = () => {
  const store = useContext(ViaContext);
  if (!store) throw new Error("No store provided");
  return store;
};

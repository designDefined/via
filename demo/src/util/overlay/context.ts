import { createContext, useContext } from "react";

export type OverlayContextType = {
  close: () => void;
};

export const OverlayContext = createContext<OverlayContextType | null>(null);

export const useOverlayController = (): OverlayContextType => {
  const controller = useContext(OverlayContext);
  if (!controller)
    throw new Error("useOverlayController must be used within OverlayContext");
  return controller;
};

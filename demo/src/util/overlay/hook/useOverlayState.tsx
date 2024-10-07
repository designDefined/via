import { useCallback, useState } from "react";
import { OverlayContext } from "../context";
import { PropsWithChildren } from "react";

type OverlayStateProps = PropsWithChildren;

export const useOverlayState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const Overlay = useCallback(
    ({ children }: OverlayStateProps) => {
      if (!isOpen) return null;
      return (
        <OverlayContext.Provider value={{ close }}>
          {children}
        </OverlayContext.Provider>
      );
    },
    [close, isOpen],
  );

  return { Overlay, open, close, isOpen };
};

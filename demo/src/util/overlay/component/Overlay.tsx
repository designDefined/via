import { PropsWithChildren } from "react";
import { OverlayContext } from "../context";

type OverlayProps = {
  isOpen: boolean;
  close: () => void;
} & PropsWithChildren;

export default function Overlay({ isOpen, close, children }: OverlayProps) {
  if (!isOpen) return null;
  return (
    <OverlayContext.Provider value={{ close }}>
      {children}
    </OverlayContext.Provider>
  );
}

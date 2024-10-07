import { CSSProperties, MouseEventHandler, useCallback, useMemo, useRef, useState } from "react";
import styles from "../styles.module.css";
import { OverlayContext } from "../context";
import { PropsWithChildren } from "react";
import { bindCSS } from "@flexive/core";

/*
 * Primitives
 */
type PositionValue = number | string;
type Position = Partial<Record<"top" | "bottom" | "left" | "right", PositionValue>>;
type Target = HTMLElement;

/*
 * Types
 */
type CommonConfig = {
  preventCloseOnClick?: boolean;
};
type OverlayConfig = {
  click: CommonConfig;
  target: CommonConfig;
  center: CommonConfig & { isBlurred?: boolean };
};
type OverlayParams = {
  click: [Position];
  target: [Target];
  center: never[];
};
type OverlayType = keyof OverlayConfig;
type OverlayState<Type extends OverlayType> =
  | {
      type: Type;
      isOpen: true;
      config: OverlayConfig[Type];
      params: OverlayParams[Type];
    }
  | {
      type: Type;
      isOpen: false;
      config: OverlayConfig[Type];
      params: never[];
    };

/*
 * Hook
 */
type HookReturnType<Type extends OverlayType> = {
  overlay: OverlayState<Type> & { close: () => void };
  isOpen: boolean;
  open: (...args: OverlayParams[Type]) => void;
  close: () => void;
};

export const useOverlay = <Type extends OverlayType>(
  config: { type: Type } & OverlayConfig[Type],
): HookReturnType<Type> => {
  const [openState, setOpenState] = useState<OverlayState<Type>>({
    type: config.type,
    config: config,
    isOpen: false,
    params: [],
  });
  const open = useCallback(
    (...args: OverlayParams[Type]) =>
      setOpenState(prev => ({
        type: prev.type,
        config: prev.config,
        isOpen: true,
        params: args,
      })),
    [],
  );
  const close = useCallback(
    () =>
      setOpenState(prev => ({
        type: prev.type,
        config: prev.config,
        isOpen: false,
        params: [],
      })),
    [],
  );

  return {
    open,
    close,
    isOpen: openState.isOpen,
    overlay: { close, ...openState },
  };
};

/*
 * Component
 */
type OverlayProps<Type extends OverlayType> = PropsWithChildren & {
  overlay: OverlayState<Type> & { close: () => void };
  className?: string;
  wrapperClassName?: string;
  onClose?: () => void;
};

const cx = bindCSS(styles);

export function Overlay<Type extends OverlayType>({
  children,
  className,
  wrapperClassName,
  overlay,
  onClose,
}: OverlayProps<Type>) {
  const opened = useRef(false);
  const computedStyle: CSSProperties = useMemo(() => {
    if (!overlay.isOpen) return {};
    if (overlay.type === "click") return (overlay.params as OverlayParams["click"])[0];
    if (overlay.type === "target") {
      const { bottom, left } = (overlay.params as OverlayParams["target"])[0].getBoundingClientRect();
      return { top: bottom + 8, left };
    }
    return {};
  }, [overlay.isOpen, overlay?.type, overlay?.params]);

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      e.stopPropagation();
      e.preventDefault();
      if (overlay.config?.preventCloseOnClick) return;
      overlay.close();
    },
    [overlay.config?.preventCloseOnClick, overlay.close],
  );

  if (!overlay.isOpen) {
    if (opened.current) {
      opened.current = false;
      onClose?.();
    }
    return null;
  }

  if (!opened.current) opened.current = true;

  return (
    <OverlayContext.Provider value={{ close: overlay.close }}>
      <div
        className={cx("wrapper", overlay.type, overlay.config ?? "", wrapperClassName)}
        onClick={onClick}
        onContextMenu={onClick}
      >
        {["click", "target"].includes(overlay.type) ? (
          <div
            className={cx("absolute", className)}
            style={computedStyle}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </OverlayContext.Provider>
  );
}

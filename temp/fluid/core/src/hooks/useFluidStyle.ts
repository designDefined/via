import { CSSProperties, useRef, useMemo } from "react";
import { FluidStyle, fluidStyleWithDefault } from "../core/fluidStyle";

/*
 * hooks
 */
export const useFluidStyle = (style?: FluidStyle, override?: CSSProperties, defaultIsInline?: boolean) => {
  const {
    flex: [grow, shrink, basis],
    flow: [direction, wrap, alignAlias, justifyAlias],
    align: [align, alignMax, alignMin],
    justify: [justify, justifyMax, justifyMin],
    spacing: [padding, gap, margin],
    overflow: [overflowX, overflowY],
    isInline,
  } = fluidStyleWithDefault(style ?? {}, defaultIsInline);

  const overrideRef = useRef(override);
  const { alignKey, justifyKey } = useMemo(() => {
    const isVertical = direction === "column" || direction === "column-reverse";
    return {
      alignKey: isVertical ? "Width" : "Height",
      justifyKey: isVertical ? "Height" : "Width",
    };
  }, [direction]);

  const styleObject: CSSProperties = useMemo(
    () => ({
      display: isInline ? "inline-flex" : "flex",
      flex: `${grow} ${shrink} ${basis}`,
      flexFlow: `${direction} ${wrap}`,
      alignItems: `${align ?? alignAlias}`,
      justifyContent: `${justify ?? justifyAlias}`,
      [`max${alignKey}`]: alignMax,
      [`min${alignKey}`]: alignMin,
      [`max${justifyKey}`]: justifyMax,
      [`min${justifyKey}`]: justifyMin,
      gap,
      padding,
      margin,
      overflow: `${overflowX} ${overflowY}`,
      ...overrideRef.current,
    }),
    [
      isInline,
      grow,
      shrink,
      basis,
      direction,
      wrap,
      alignAlias,
      justifyAlias,
      align,
      justify,
      padding,
      gap,
      margin,
      alignKey,
      alignMax,
      alignMin,
      justifyKey,
      justifyMax,
      justifyMin,
      overflowX,
      overflowY,
    ],
  );

  return styleObject;
};

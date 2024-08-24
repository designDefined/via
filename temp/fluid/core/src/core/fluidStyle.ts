/*
 * types
 */

/* simple */
type Value = number | string | undefined;

/* flex */
type FlexGrow = number;
type FlexShrink = number;
type FlexBasis = string;
type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

/* justify */
type FlexJustify = "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
type FlexJustifyMax = Value;
type FlexJustifyMin = Value;

/* align */
type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
type FlexAlignMax = Value;
type FlexAlignMin = Value;

/* spacing */
type Padding = Value;
type Gap = Value;
type Margin = Value;

/* overflow */
type Overflow = "auto" | "hidden" | "scroll" | "visible";

export type FluidStyle = {
  flex?: [FlexGrow?, FlexShrink?, FlexBasis?];
  flow?: [FlexDirection?, FlexWrap?, FlexAlign?, FlexJustify?];
  align?: [FlexAlign?, FlexAlignMax?, FlexAlignMin?];
  justify?: [FlexJustify?, FlexJustifyMax?, FlexJustifyMin?];
  spacing?: [Padding?, Gap?, Margin?];
  isInline?: boolean;
  overflow?: [Overflow?, Overflow?];
};

/*
 * default value
 */
const defaultFluidStyle: Required<FluidStyle> = {
  flex: [0, 0, "auto"],
  flow: ["column", "nowrap"],
  align: [],
  justify: [],
  spacing: [],
  isInline: false,
  overflow: ["auto"],
};

/*
 * merge
 */
export const fluidStyleWithDefault = (fluidStyle: FluidStyle, isInline?: boolean): Required<FluidStyle> => {
  return Object.keys(defaultFluidStyle).reduce((acc, _key) => {
    const key = _key as keyof Required<FluidStyle>;
    if (key === "isInline") return { ...acc, isInline: fluidStyle.isInline ?? isInline ?? defaultFluidStyle.isInline };
    return { ...acc, [key]: fluidStyle[key] || defaultFluidStyle[key] };
  }, {} as Required<FluidStyle>);
};

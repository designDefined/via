import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidSpanProps } from "../../types/fluidElementProps";

export function Span({ children, fluid, style, ...props }: FluidSpanProps) {
  const fluidStyle = useFluidStyle(fluid, style, true);
  const fluidClass = useFluidClass(props);

  return (
    <span {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </span>
  );
}

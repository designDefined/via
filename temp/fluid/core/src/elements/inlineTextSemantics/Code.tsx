import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidCodeProps } from "../../types/fluidElementProps";

export function Code({ children, fluid, style, ...props }: FluidCodeProps) {
  const fluidStyle = useFluidStyle(fluid, style, true);
  const fluidClass = useFluidClass(props);

  return (
    <code {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </code>
  );
}

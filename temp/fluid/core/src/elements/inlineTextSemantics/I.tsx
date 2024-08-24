import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidIProps } from "../../types/fluidElementProps";

export function I({ children, fluid, style, ...props }: FluidIProps) {
  const fluidStyle = useFluidStyle(fluid, style, true);
  const fluidClass = useFluidClass(props);

  return (
    <i {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </i>
  );
}

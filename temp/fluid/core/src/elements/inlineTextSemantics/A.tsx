import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidAProps } from "../../types/fluidElementProps";

export function A({ children, fluid, style, ...props }: FluidAProps) {
  const fluidStyle = useFluidStyle(fluid, style, true);
  const fluidClass = useFluidClass(props);

  return (
    <a {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </a>
  );
}

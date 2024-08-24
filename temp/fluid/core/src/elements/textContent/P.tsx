import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidPProps } from "../../types/fluidElementProps";

export function P({ children, fluid, style, ...props }: FluidPProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <p {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </p>
  );
}

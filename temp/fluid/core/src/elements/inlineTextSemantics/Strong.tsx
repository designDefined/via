import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidStrongProps } from "../../types/fluidElementProps";

export function Strong({ children, fluid, style, ...props }: FluidStrongProps) {
  const fluidStyle = useFluidStyle(fluid, style, true);
  const fluidClass = useFluidClass(props);

  return (
    <strong {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </strong>
  );
}

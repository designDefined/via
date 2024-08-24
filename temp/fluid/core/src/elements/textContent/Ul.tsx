import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidUlProps } from "../../types/fluidElementProps";

export function Ul({ children, fluid, style, ...props }: FluidUlProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <ul {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </ul>
  );
}

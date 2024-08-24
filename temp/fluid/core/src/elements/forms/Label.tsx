import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidLabelProps } from "../../types/fluidElementProps";

export function Label({ children, fluid, style, ...props }: FluidLabelProps) {
  const fluidStyle = useFluidStyle(fluid, style, true);
  const fluidClass = useFluidClass(props);

  return (
    <label {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </label>
  );
}

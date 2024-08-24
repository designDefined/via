import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidLiProps } from "../../types/fluidElementProps";

export function Li({ children, fluid, style, ...props }: FluidLiProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <li {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </li>
  );
}

import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidNavProps } from "../../types/fluidElementProps";

export function Nav({ children, fluid, style, ...props }: FluidNavProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <nav {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </nav>
  );
}

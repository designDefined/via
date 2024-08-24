import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidMainProps } from "../../types/fluidElementProps";

export function Main({ children, fluid, style, ...props }: FluidMainProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <main {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </main>
  );
}

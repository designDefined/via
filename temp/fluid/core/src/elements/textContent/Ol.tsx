import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidOlProps } from "../../types/fluidElementProps";

export function Ol({ children, fluid, style, ...props }: FluidOlProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <ol {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </ol>
  );
}

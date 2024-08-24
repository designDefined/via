import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidPreProps } from "../../types/fluidElementProps";

export function Pre({ children, fluid, style, ...props }: FluidPreProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <pre {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </pre>
  );
}

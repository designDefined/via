import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidSectionProps } from "../../types/fluidElementProps";

export function Section({ children, fluid, style, ...props }: FluidSectionProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <section {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </section>
  );
}

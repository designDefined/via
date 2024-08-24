import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidAsideProps } from "../../types/fluidElementProps";

export function Aside({ children, fluid, style, ...props }: FluidAsideProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <aside {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </aside>
  );
}

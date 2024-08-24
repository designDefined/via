import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidHeaderProps } from "../../types/fluidElementProps";

export function Header({ children, fluid, style, ...props }: FluidHeaderProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <header {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </header>
  );
}

import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidFooterProps } from "../../types/fluidElementProps";

export function Footer({ children, fluid, style, ...props }: FluidFooterProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <footer {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </footer>
  );
}

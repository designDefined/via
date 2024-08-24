import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidButtonProps } from "../../types/fluidElementProps";

export function Button({ children, fluid, style, ...props }: FluidButtonProps) {
  const fluidStyle = useFluidStyle(fluid, style, true);
  const fluidClass = useFluidClass(props);

  return (
    <button {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </button>
  );
}

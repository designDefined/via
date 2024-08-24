import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidFormProps } from "../../types/fluidElementProps";

export function Form({ children, fluid, style, ...props }: FluidFormProps) {
  const fluidStyle = useFluidStyle(fluid, style, true);
  const fluidClass = useFluidClass(props);

  return (
    <form {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </form>
  );
}

import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidInputProps } from "../../types/fluidElementProps";

export function Input({ fluid, style, ...props }: FluidInputProps) {
  const fluidStyle = useFluidStyle(fluid, style, true);
  const fluidClass = useFluidClass(props);

  return <input {...props} style={fluidStyle} className={fluidClass} />;
}

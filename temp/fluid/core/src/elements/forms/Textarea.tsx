import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidTextareaProps } from "../../types/fluidElementProps";

export function Textarea({ fluid, style, ...props }: FluidTextareaProps) {
  const fluidStyle = useFluidStyle(fluid, style, true);
  const fluidClass = useFluidClass(props);

  return <textarea {...props} style={fluidStyle} className={fluidClass} />;
}

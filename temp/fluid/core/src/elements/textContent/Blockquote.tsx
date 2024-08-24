import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidBlockquoteProps } from "../../types/fluidElementProps";

export function Blockquote({ children, fluid, style, ...props }: FluidBlockquoteProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <blockquote {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </blockquote>
  );
}

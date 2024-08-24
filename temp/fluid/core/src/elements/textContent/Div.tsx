import { forwardRef } from "react";
import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidDivProps } from "../../types/fluidElementProps";

export const Div = forwardRef<HTMLDivElement, FluidDivProps>(({ children, fluid, style, ...props }, ref) => {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <div {...props} style={fluidStyle} className={fluidClass} ref={ref}>
      {children}
    </div>
  );
});

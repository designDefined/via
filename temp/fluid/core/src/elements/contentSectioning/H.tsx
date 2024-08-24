import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidHeadingProps } from "../../types/fluidElementProps";

export function H1({ children, fluid, style, ...props }: FluidHeadingProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <h1 {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </h1>
  );
}

export function H2({ children, fluid, style, ...props }: FluidHeadingProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <h2 {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </h2>
  );
}

export function H3({ children, fluid, style, ...props }: FluidHeadingProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <h3 {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </h3>
  );
}

export function H4({ children, fluid, style, ...props }: FluidHeadingProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <h4 {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </h4>
  );
}

export function H5({ children, fluid, style, ...props }: FluidHeadingProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <h5 {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </h5>
  );
}

export function H6({ children, fluid, style, ...props }: FluidHeadingProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <h6 {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </h6>
  );
}

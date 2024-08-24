import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidArticleProps } from "../../types/fluidElementProps";

export function Article({ children, fluid, style, ...props }: FluidArticleProps) {
  const fluidStyle = useFluidStyle(fluid, style, false);
  const fluidClass = useFluidClass(props);

  return (
    <article {...props} style={fluidStyle} className={fluidClass}>
      {children}
    </article>
  );
}
